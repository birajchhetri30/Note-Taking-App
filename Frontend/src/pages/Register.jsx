import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanedForm = {
            email: form.email.trim(),
            password: form.password,
            name: form.name.trim()
        };


        if (!cleanedForm.name || !cleanedForm.email || !cleanedForm.password) {
            setError('All fields are required');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(cleanedForm.email)) {
            setError('Invalid email');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
        if (!passwordRegex.test(cleanedForm.password)) {
            setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            return;
        }

        try {
            await api.post('/users/register', cleanedForm);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name='name' value={form.name} onChange={handleChange} placeholder='Name' />
                <input name='email' value={form.email} onChange={handleChange} placeholder='Email' />
                <input name='password' value={form.password} type='password' onChange={handleChange} placeholder='Password' />
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}