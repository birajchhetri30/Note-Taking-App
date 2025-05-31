import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import TextInput from '../components/TextInput';
import AuthRedirectLink from '../components/AuthRedirectLink';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (loading) return;
        setLoading(true);

        try {
            await api.post('/users/register', cleanedForm);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Email already exists');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login_card'>
            <div className='bg-primary-200 h-4/5 sm:w-1/2 md:1/2 lg:w-1/3 xl:w-1/4 p-6 rounded-3xl shadow-2xl flex flex-col items-center'>
                <h1 className='h1 mt-5'>Register</h1>
                <form onSubmit={handleSubmit} className='credentials_form mt-10'>
                    <TextInput name='name' value={form.name} onChange={handleChange} />
                    <TextInput name='email' value={form.email} onChange={handleChange} />
                    <PasswordInput name="password" value={form.password} onChange={handleChange} />
                    <button
                        className='button'
                        type='submit' disabled={loading}>Register</button>
                </form>
                {error && <p className='error_style'>{error}</p>}
                <AuthRedirectLink text="Already have an account?" linkText="Login" to="/login" />
            </div>
        </div>
    )
}