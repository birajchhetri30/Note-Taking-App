import { useEffect, useState } from "react";
import api from "../services/api";

export default function ViewNoteModal({ noteId, onClose, buttonText }) {
    const [note, setNote] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${noteId}`);
                setNote(res.data);
            } catch (err) {
                console.error("Failed to fetch note", err);
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

    if (!note) return (
        <div className='flex w-full justify-center items-center'>
            <p className='text-xl text-secondary-200'>Loading note...</p>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-2 text-secondary-400 break-words">{note.title}</h2>

            <hr className="border border-secondary-100 my-1" />

            <div className="flex flex-wrap gap-2 my-3">
                {categories.map((cat) => (
                    <span key={cat.id} className="text-sm px-2 py-1 bg-secondary-100 text-secondary-400 rounded-md">
                        {cat.name}
                    </span>
                ))}
            </div>

            <p className="text-secondary-400 whitespace-pre-wrap break-words">
                {note.content}
            </p>

            {/* <div
                className="prose prose-sm text-secondary-400 mt-2 line-clamp-4 prose-headings:text-secondary-400 prose-p:text-secondary-400"
                dangerouslySetInnerHTML={{ __html: note.content }}
            /> */}

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

                <button onClick={onClose} className="button">{buttonText}</button>

            </div>

        </div>

    )
}