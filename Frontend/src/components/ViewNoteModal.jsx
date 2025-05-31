import { useEffect, useState } from "react";
import api from "../services/api";

export default function ViewNoteModal({ noteId, onClose }) {
    const [note, setNote] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${noteId}`);
                setNote(res.data);
            } catch (err) {
                console.error("Failed to fetch note", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await api.get(`/categories/notes/${noteId}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };

        if (noteId) {
            fetchNote();
            fetchCategories();
        }
    }, [noteId]);

    if (!note) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-2 text-secondary-400">{note.title}</h2>

            <hr className="border border-secondary-100 my-1" />

            <div className="flex flex-wrap gap-2 my-3">
                {categories.map((cat) => (
                    <span key={cat.id} className="text-sm px-2 py-1 bg-secondary-100 text-secondary-400 rounded-md">
                        {cat.name}
                    </span>
                ))}
            </div>

            <p className="text-secondary-400 whitespace-pre-wrap">{note.content}</p>

            <div className="my-2 flex justify-between items-center">
                <small
                    className="text-secondary-300"
                >
                    {new Date(note.updated_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })} • {new Date(note.updated_at).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </small>

                <button onClick={onClose} className="button">Close</button>

            </div>

        </div>

    )
}