import { useState } from "react";
import api from "../services/api";

export default function AddNoteModal({ onClose, onNoteCreated }) {
    const [form, setForm] = useState({ title: '', content: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/notes', form);
            onNoteCreated(res.data);
            onClose();
            setForm({ title: '', content: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create note');
        }
    };

    return (
        <div>
            <h3>Add New Note</h3>
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

                <button type='submit'>Create</button>
                <button type='button' onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</button>
            </form>

        </div>
    )
}
