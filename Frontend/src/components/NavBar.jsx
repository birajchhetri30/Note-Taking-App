import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../services/auth';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

import Select from 'react-select';
import api from '../services/api';

function NavBar({ search, onSearch, onFilterChange, onSortChange, sortBy, sortOrder, selectedCategoryIds }) {
    const [searchTerm, setSearchTerm] = useState(search);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

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
        <nav style={styles.nav}>
            <div style={styles.left}>
                <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    MyNotesApp
                </h2>
            </div>

            <div style={styles.center}>
                <input
                    type='text'
                    placeholder='Search notes'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    style={styles.searchInput}

                />

                {searchTerm !== '' && (
                    <IoIosClose
                        onClick={() => {
                            setSearchTerm('');
                            if (onSearch) onSearch('');
                        }}
                        style={{ cursor: 'pointer', marginLeft: '8px', color: 'white' }}
                    />
                )}

                <FaMagnifyingGlass
                    onClick={handleSearchSubmit}
                    style={{ cursor: 'pointer', marginLeft: '8px', color: 'white' }}
                />


            </div>

            <div style={styles.center}>

                <div style={{ position: 'relative', marginLeft: 10 }}>
                    <button onClick={() => setFilterDropdownOpen(!filterDropdownOpen)} style={styles.btn}>
                        Filter
                    </button>
                    {filterDropdownOpen && (
                        <div style={styles.dropdown}>
                            <div style={{ padding: '10px', color: 'black' }}>
                                <strong>Category</strong>
                                <Select
                                    options={categories}
                                    isClearable
                                    isMulti
                                    closeMenuOnSelect={false}
                                    value={selectedCategories}
                                    onChange={(selectedOptions) => {
                                        const selected = selectedOptions || [];
                                        setSelectedCategories(selected);

                                        if (selected.length === 0) {
                                            if (onFilterChange) onFilterChange([]);
                                        }
                                    }}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            marginTop: '8px',
                                            minWidth: '180px',
                                        }),
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        handleFilterSelect(selectedCategories.map(opt => opt.value))
                                        setFilterDropdownOpen(false);
                                    }}
                                    style={{
                                        marginTop: '10px',
                                        backgroundColor: 'black',
                                        color: 'white',
                                        padding: '6px 10px',
                                        border: '1px solid black',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ position: 'relative', marginLeft: 10 }}>
                    <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)} style={styles.btn}>
                        Sort By
                    </button>
                    {sortDropdownOpen && (
                        <div style={styles.dropdown}>
                            <button style={styles.dropdownItem} onClick={() => handleSortSelect('created_at')}>
                                Date Created {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </button>
                            <button style={styles.dropdownItem} onClick={() => handleSortSelect('updated_at')}>
                                Date Updated {sortBy === 'updated_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </button>
                            <button style={styles.dropdownItem} onClick={() => handleSortSelect('title')}>
                                Title {sortBy === 'title' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </button>
                        </div>
                    )}

                </div>
            </div>

            <div style={styles.right}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={styles.profileBtn}>
                    Profile
                </button>
                {dropdownOpen && (
                    <button onClick={handleLogout} style={styles.dropdownItem}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '60px',
        borderBottom: '1px solid #ccc',
        backgroundColor: 'black',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    left: {
        flex: 1,
    },
    center: {
        flex: 2,
        display: 'flex',
        justifyContent: 'center'
    },
    right: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'relative',
    },
    searchInput: {
        width: '60%',
        padding: '6px 10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    profileBtn: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '6px 12px',
    },
    dropdown: {
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 4px)',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        minWidth: '120px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    },
    dropdownItem: {
        width: '100%',
        padding: '8px 12px',
        backgroundColor: 'black',
        // background: 'none',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
    },
};


export default React.memo(NavBar);