import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {setToken} from '../services/auth';


export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/users/login', form);
            setToken(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name='email' value={form.email} onChange={handleChange} placeholder='Email' required/>
                <input name='password' type='password' value={form.password} onChange={handleChange} placeholder='password' required />
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}