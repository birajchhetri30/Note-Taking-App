import { useEffect, useState } from "react";
import api from "../services/api";
import CreatableSelect from 'react-select/creatable';

export default function AddNoteModal({ onClose, onNoteCreated, note, onNoteUpdated }) {
    const [form, setForm] = useState({ title: '', content: '', categories: [] });
    const [error, setError] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);

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
            setForm({
                title: note.title,
                content: note.content,
                categories: note.categories
                    ? note.categories.map((cat) => ({ label: cat.name, value: cat.id || cat.name }))
                    : [],
            });
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

        try {
            const payload = {
                title: form.title,
                content: form.content,
                categoryIds: form.categories.map(cat => cat.label),
            };

            if (note) {
                // Edit mode so send PUT request
                await api.put(`/notes/${note.id}`, payload);
                if (onNoteUpdated) onNoteUpdated();
            } else {
                const res = await api.post('/notes', payload);
                if (onNoteCreated) onNoteCreated(res.data);
            }

            onClose();
            setForm({ title: '', content: '', categories: [] });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create note');
        }
    };

    return (
        <div>
            <h3>{note ? 'Edit Note' : 'Add New Note'}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    name='title'
                    placeholder='Title'
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', marginBottom: '10px' }}
                />

                <textarea
                    name='content'
                    placeholder='Content'
                    value={form.content}
                    onChange={handleChange}
                    rows={4}
                    style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ marginBottom: '5px', display: 'block' }}>Categories (optional)</label>
                <CreatableSelect
                    isMulti
                    options={categoryOptions}
                    value={form.categories}
                    onChange={handleCategoryChange}
                    placeholder='Select or create categories'
                    onCreateOption={(inputValue) => {
                        const newOption = { label: inputValue, value: inputValue };
                        const updated = [...form.categories, newOption];
                        setForm({ ...form, categories: updated });
                    }}
                    styles={{ container: base => ({ ...base, marginBottom: '10px' }) }}
                />

                <button type='submit'>{note ? 'Update' : 'Create'}</button>
                <button type='button' onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
            </form>

        </div>
    )
}
