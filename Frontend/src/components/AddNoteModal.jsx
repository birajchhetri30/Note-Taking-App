import { useEffect, useState } from "react";
import api from "../services/api";
import TextInput from "./TextInput";
import { toast } from 'react-toastify';
import CategorySelect from "./CategorySelect";
import TipTapEditor from "./TipTapEditor";

export default function AddNoteModal({ onClose, onNoteCreated, note, onNoteUpdated }) {
    const [form, setForm] = useState({ title: '', content: '', categories: [] });
    const [error, setError] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                const options = res.data.map(cat => ({ value: cat.id, label: cat.name }));
                setCategoryOptions(options);
            } catch (err) {
                setError('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (note) {
            console.log('note.categories:', note);
            setForm((prev) => ({
                ...prev,
                title: note.title,
                content: note.content,
                categories: [],
            }));

            const fetchNoteCategories = async () => {
                try {
                    const res = await api.get(`/categories/notes/${note.id}/categories`);
                    const formatted = res.data.map(cat => ({
                        label: cat.name,
                        value: cat.id
                    }));
                    setForm((prev) => ({
                        ...prev,
                        categories: formatted
                    }))
                } catch (err) {
                    console.error('Failed to fetch note categories:', err);
                }
            };

            fetchNoteCategories();
        }
    }, [note]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (selectedOptions) => {
        setForm({ ...form, categories: selectedOptions || [] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title.trim()) {
            setError('Title cannot be empty');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const payload = {
                title: form.title,
                content: form.content,
                categoryIds: form.categories.map(cat => cat.label),
            };

            if (note) {
                // Edit mode so send PUT request
                await api.put(`/notes/${note.id}`, payload);
                toast.success('Note updated');
                if (onNoteUpdated) onNoteUpdated();
            } else {
                const res = await api.post('/notes', payload);
                toast.success('Note created');
                if (onNoteCreated) onNoteCreated(res.data);
            }

            onClose();
            setForm({ title: '', content: '', categories: [] });
        } catch (err) {
            setError(err.response?.data?.error || `Failed to ${note ? 'edit' : 'create'} note`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <h3
                className="text-xl text-secondary-400 font-bold"
            >{note ? 'Edit Note' : 'Add New Note'}</h3>

            <hr className="border border-secondary-100 my-1" />

            <form
                className="mt-3"
                onSubmit={handleSubmit}>

                <TextInput
                    name='title'
                    value={form.title}
                    onChange={handleChange}
                />

                <small className="flex justify-end mx-1 text-secondary-300">{form.title.length}/100</small>

                <textarea
                    className="max-h-40 min-h-40 h-40 mt-3 credentials_input outline-none"
                    name='content'
                    placeholder='Content'
                    value={form.content}
                    onChange={handleChange}
                    rows={4}
                    style={{ width: '100%', marginBottom: '10px' }}
                />

                {/* <TipTapEditor /> */}

                <label className="mx-1 my-2 text-secondary-400">Categories (optional)</label>

                <CategorySelect
                    value={form.categories}
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    onCreateOption={(inputValue) => {
                        if (inputValue.length > 20) {
                            setError('Category name must be less that 20 characters');
                            return;
                        }
                        setError('');
                        const newOption = { label: inputValue, value: inputValue };
                        const updated = [...form.categories, newOption];
                        setForm({ ...form, categories: updated });
                    }}
                />

                {error && <p className="error_style">{error}</p>}

                <div className="flex items-center justify-end">
                    <button className='button mt-3' type='submit' disabled={loading}>{note ? 'Update' : 'Create'}</button>
                    <button className='button mt-3 bg-transparent text-secondary-400' type='button' onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
                </div>
            </form>
        </div>
    );
}