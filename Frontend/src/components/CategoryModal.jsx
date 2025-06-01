import { useEffect, useState } from "react";
import api from "../services/api";
import { MdDelete } from "react-icons/md";
import { IoIosClose } from "react-icons/io";


export default function CategoryModal({ isOpen, onClose }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            api.get('/categories')
                .then(res => {
                    const userDefinedCategories = res.data.filter(cat => cat.user_id !== null);
                    setCategories(userDefinedCategories);
                })
                .catch(err => console.error('Error fetching categories', err));
        }
    }, [isOpen]);

    const deleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            console.error('Failed to delete category', err);
        }
    };

    const deleteAll = async () => {
        if (window.confirm("Delete all categories?")) {
            try {
                await api.delete('/categories');
                setCategories([]);
            } catch (err) {
                console.error('Failed to dwlete all categories', err);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div>
            <h2 className="text-2xl text-secondary-400 font-bold">
                My categories
            </h2>

            <hr className="border border-secondary-100 my-2" />

            {categories.length === 0 ? (
                <p className="text-secondary-400">You have not created any categories</p>
            ) : (
                <ul className="flex flex-wrap mt-2 gap-3">
                    {categories.map(cat => (
                        <li
                            className="flex justify-between items-center gap-1 bg-secondary-300 px-2 py-1 mr-2 text-primary-200 rounded-md border-2 border-secondary-400 transition-all duration-100 hover:scale-105"
                            key={cat.id}
                        >
                            {cat.name}
                            {' '}|
                            <MdDelete
                                onClick={() => { deleteCategory(cat.id) }}
                                className="hover:brightness-125 cursor-pointer"
                            />
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex justify-end mt-10">
                {categories.length > 1 && (
                    <button
                        className="button"
                        onClick={deleteAll}>
                        Delete All
                    </button>
                )}
            </div>
        </div>
    );
}