import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../services/auth';

import api from '../services/api';
import SearchBox from './SearchBox';
import Profile from './Profile';
import Filter from './Filter';
import Sort from './Sort';
import CategoryModal from './CategoryModal';
import Modal from 'react-modal';


export default function NavBar({ search, onSearch, onFilterChange, onSortChange, sortBy, sortOrder, selectedCategoryIds, user }) {
    const [searchTerm, setSearchTerm] = useState(search);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [profileDropdown, setProfileDropdownOpen] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const navigate = useNavigate();

    const filterRef = useRef(null);
    const sortRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterDropdownOpen(false);
            }

            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setSortDropdownOpen(false);
            }

            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                const options = res.data.map(cat => ({
                    value: cat.id,
                    label: cat.name
                }));
                setCategories(options);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setSelectedCategories(
            selectedCategoryIds.map(id => categories.find(cat => cat.value === id)).filter(Boolean)
        );
    }, [selectedCategoryIds, categories]);

    const getInitials = (name) => {
        if (!name) return "NA";
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) {
            return nameParts[0].substring(0, 2).toUpperCase();
        }
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    };

    const userInitials = getInitials(user.name)

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (onSearch) onSearch(searchTerm);
    }

    const handleFilterSelect = (categoryIds) => {
        if (onFilterChange) onFilterChange(categoryIds);
    };

    const handleSortSelect = (sortBy) => {
        // setSortDropdownOpen(false);
        if (onSortChange) onSortChange(sortBy);
    };

    const handleCategories = () => {
        setShowCategoryModal(true);
    };

    return (
        <nav
            className="flex justify-between items-center p-2 sticky top-0 z-50 bg-navbar border-b-1 border-b-secondary-300 shadow-sm"
        >
            <h1
                className="text-xl font-semibold text-primary-100 ml-2"
            >
                Notes
            </h1>


            <div className='flex items-center sm:w1/2 md:w-1/2 lg:w-2/5'>
                <SearchBox
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onChange={handleSearchChange}
                    handleSearchSubmit={handleSearchSubmit}
                    onSearch={onSearch}
                />

                <Filter
                    filterDropdownOpen={filterDropdownOpen}
                    setFilterDropdownOpen={setFilterDropdownOpen}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    handleFilterSelect={handleFilterSelect}
                    onFilterChange={onFilterChange}
                    ref={filterRef}
                />

                <Sort
                    sortDropdownOpen={sortDropdownOpen}
                    setSortDropdownOpen={setSortDropdownOpen}
                    handleSortSelect={handleSortSelect}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    ref={sortRef}
                />


            </div>

            <div ref={profileRef}>
                <div
                    className='p-2 mx-2 bg-secondary-200 border-2 border-primary-300 rounded-full cursor-pointer hover:brightness-120'
                    onClick={() => { setProfileDropdownOpen((prev) => !prev) }}
                >
                    <h2
                        className='font-bold text-secondary-400'
                    >
                        {userInitials}
                    </h2>
                </div>

                {profileDropdown && (
                    <Profile name={user.name} email={user.email} handleCategories={handleCategories} handleLogout={handleLogout} />
                )}
            </div>

            <Modal
                isOpen={showCategoryModal}
                onRequestClose={() => setShowCategoryModal(false)}
                contentLabel='View Categories'
                className="modal_style max-h-[90vh] overflow-y-auto"
                overlayClassName="modal_overlay_style"
            >
                <CategoryModal isOpen={showCategoryModal} onClose={() => setShowCategoryModal(false)} />
            </Modal>
        </nav>
    );
}
