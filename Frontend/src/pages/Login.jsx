import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setToken } from '../services/auth';
import TextInput from '../components/TextInput';
import PasswordInput from '../components/PasswordInput';
import AuthRedirectLink from '../components/AuthRedirectLink';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
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
        };

        if (!cleanedForm.email || !cleanedForm.password) {
            setError('All fields are required');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(cleanedForm.email)) {
            setError('Invalid email');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const res = await api.post('/users/login', cleanedForm);
            setToken(res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Incorrect email/password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='login_card'>
            <div className='bg-primary-200 h-3/4 sm:w-1/2 md:1/2 lg:w-1/3 xl:w-1/4 p-6 rounded-3xl shadow-2xl flex flex-col items-center'>
                <h1 className="h1 mt-10">Sign in to Notes</h1>
                <form onSubmit={handleSubmit} className="credentials_form mt-10">
                    <TextInput name='email' value={form.email} onChange={handleChange} />
                    <PasswordInput name='password' value={form.password} onChange={handleChange} />
                    <button
                        className="button"
                        type='submit' disabled={loading}
                    >
                        Login
                    </button>
                </form>
                {error && <p className="error_style">{error}</p>}
                <AuthRedirectLink text="New to Notes?" linkText={"Create an account"} to="/register" />
            </div>
        </div>
    );
}