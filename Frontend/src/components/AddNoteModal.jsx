import { useEffect, useState } from "react";
import api from "../services/api";
import CreatableSelect from 'react-select/creatable';
import TextInput from "./TextInput";
import { toast } from 'react-toastify';

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

                <label className="mx-1 my-2 text-secondary-400">Categories (optional)</label>

                <div className="lg:w-1/2 md:w-1/2">
                    <CreatableSelect
                        isMulti
                        options={categoryOptions}
                        value={form.categories}
                        onChange={handleCategoryChange}
                        placeholder='Select or create categories'
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
                        styles={styles}
                    />
                </div>

                <div className="flex items-center justify-end">
                    <button className='button mt-3' type='submit' disabled={loading}>{note ? 'Update' : 'Create'}</button>
                    <button className='button mt-3 bg-transparent text-secondary-400' type='button' onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
                </div>
            </form>

            {error && <p className="self-center error_style">{error}</p>}

        </div>
    );
}


const styles = {
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#9c6644",
        borderRadius: '0.75rem',
        borderWidth: '2px',
        borderColor: '#ddb892',
        padding: '0.25rem',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#ddb892' : 'transparent',
        cursor: 'pointer',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        color: '#412512',
        fontWeight: 'bold',

    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: '#ddb892',
        borderRadius: '0.75rem',
        borderColor: '#b08968',
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