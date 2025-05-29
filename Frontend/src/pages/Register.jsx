import {useState} from 'react';
import api from '../services/api';
import {useNavigate} from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({name: '', email: '', password: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/users/register', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };
    
    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name='name' value={form.name} onChange={handleChange} placeholder='Name' required/>
                <input name='email' value={form.email} onChange={handleChange} placeholder='Email' required/>
                <input name='password' value={form.password} type='password' onChange={handleChange} placeholder='Password' required/>
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}