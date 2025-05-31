import { TbArrowsSort } from "react-icons/tb";

export default function Sort({ sortDropdownOpen, setSortDropdownOpen, handleSortSelect, sortBy, sortOrder, ref }) {
    return (
        <div ref={ref} className="relative inline-block">
            <div
                className="rounded-full bg-primary-300 border-2 border-secondary-300 p-2 cursor-pointer hover:brightness-120"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            >
                <TbArrowsSort className='text-secondary-400' />
            </div>

            {sortDropdownOpen && (
                <div className="mt-2 w-60 z-50 dropdown">
                    <ul className="list">
                        <li
                            onClick={() => { handleSortSelect('created_at') }}
                            className="list_item"
                        >
                            Date created {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
                        </li>
                        <li
                            onClick={() => { handleSortSelect('updated_at') }}
                            className="list_item"
                        >
                            Date updated {sortBy === 'updated_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
                        </li>
                        <li
                            onClick={() => { handleSortSelect('title') }}
                            className="list_item"
                        >
                            Title {sortBy === 'title' && (sortOrder === 'ASC' ? '↑' : '↓')}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}