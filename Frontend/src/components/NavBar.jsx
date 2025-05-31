import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../services/auth';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

import api from '../services/api';
import SearchBox from './SearchBox';
import Profile from './Profile';
import Filter from './Filter';
import Sort from './Sort';

function NavBar({ search, onSearch, onFilterChange, onSortChange, sortBy, sortOrder, selectedCategoryIds }) {
    const [searchTerm, setSearchTerm] = useState(search);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [profileDropdown, setProfileDropdow] = useState(false);

    const navigate = useNavigate();

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

    return (
        <nav
            className="flex justify-between items-center p-2 sticky top-0 z-50 bg-secondary-400 border-b-1 border-b-secondary-300 shadow-sm"
        >
            <h1
                className="text-xl font-semibold text-primary-100"
            >
                Notes App
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
                />

                <Sort 
                    sortDropdownOpen={sortDropdownOpen}
                    setSortDropdownOpen={setSortDropdownOpen}
                    handleSortSelect={handleSortSelect}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </div>

            <div
                className='p-2 mx-2 bg-secondary-200 border-2 border-primary-300 rounded-full cursor-pointer'
                onClick={() => { setProfileDropdow((prev) => !prev) }}
            >
                <h2
                    className='font-bold text-secondary-400'
                >
                    BC
                </h2>
            </div>

            {profileDropdown && (
                <Profile handleLogout={handleLogout} />
            )}

        </nav>
    );
}
