import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

export default function SearchBox({ searchTerm, setSearchTerm, onChange, handleSearchSubmit, onSearch }) {
    return (
        <div
            className="flex items-center justify-between w-full credentials_input"
        >
            <input
                className="w-full outline-none"
                type='text'
                placeholder='Search notes'
                value={searchTerm}
                onChange={onChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />

            <div className="flex items-center">
                {searchTerm !== "" && (
                    <IoIosClose
                        className="cursor-pointer text-2xl mr-1 hover:brightness-50"
                        onClick={() => {
                            setSearchTerm('');
                            if (onSearch) onSearch('');
                        }}
                    />
                )}

                <FaMagnifyingGlass
                    className="mr-1 fill-secondary-400 cursor-pointer hover:brightness-50"
                    onClick={handleSearchSubmit}
                />
            </div>
        </div>
    )
}