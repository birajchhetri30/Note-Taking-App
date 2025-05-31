import { FaFilter } from "react-icons/fa6";
import Select from 'react-select';

export default function Filter({ filterDropdownOpen, setFilterDropdownOpen, categories, selectedCategories, setSelectedCategories, handleFilterSelect, onFilterChange, ref }) {
    return (
        <div ref={ref} className="relative inline-block">
            <div
                className="rounded-full bg-primary-300 border-2 border-secondary-300 p-2 mx-2 cursor-pointer hover:brightness-120"
                onClick={() => setFilterDropdownOpen((prev) => !prev)}
            >
                <FaFilter className='fill-secondary-400'/>
            </div>

            {filterDropdownOpen && (
                <div className="mt-2 w-60 z-50 dropdown">
                    <h3 className="block p-2 text-secondary-400 font-bold text-lg">Categories</h3>
                    <Select
                        className="p-2 fill-primary-300"
                        options={categories}
                        isClearable
                        isMulti
                        placeholder="Select categories"
                        closeMenuOnSelect={false}
                        value={selectedCategories}
                        onChange={(selectedOptions) => {
                            const selected = selectedOptions || [];
                            setSelectedCategories(selected);

                            if (selected.length === 0) {
                                if (onFilterChange) onFilterChange([]);
                            }
                        }}
                        styles={styles}
                    />

                    <button
                        onClick={() => {
                            handleFilterSelect(selectedCategories.map(opt => opt.value))
                            setFilterDropdownOpen(false);
                        }}
                        className="button m-2"
                    >
                        Apply Filters
                    </button>
                </div>
            )}
        </div>
    )
}


const styles = {
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#9c6644",
        borderRadius: '0.75rem',
        borderWidth: '2px',
        borderColor: '#ddb892',
        padding: '0.25rem'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#ddb892' : 'transparent',
        cursor: 'pointer',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        color: '#412512',
        fontWeight: 'bold'
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: '#ddb892',
        borderRadius: '0.75rem',
        borderColor: '#b08968',
        // color: '#412512'
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#7f5539",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ede0d4',
    }),
}