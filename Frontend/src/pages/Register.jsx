import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import TextInput from '../components/TextInput';
import AuthRedirectLink from '../components/AuthRedirectLink';
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa";


export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
            setError('Password conditions not satisfied');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
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

    const passwordConditions = {
        length: form.password.length >= 8,
        lowercase: /[a-z]/.test(form.password),
        uppercase: /[A-Z]/.test(form.password),
        number: /\d/.test(form.password),
        specialChar: /[@$!%*?#&.,';:"^()]/.test(form.password)
    };

    const renderCondition = (condition, label) => (
        <div className="flex items-center text-sm gap-2 text-secondary-300">
            {condition ? (
                <FaRegCheckCircle size={16} className="text-green-500" />
            ) : (
                <FaRegCircle size={16} className="text-gray-400" />
            )}
            <span>{label}</span>
        </div>
    )

    return (
        <div className='login_card'>
            <div className='bg-primary-200 h-[90vh] sm:w-1/2 md:1/2 lg:w-1/3 xl:w-1/4 p-6 rounded-3xl shadow-2xl flex flex-col items-center'>
                <h1 className='h1'>Register</h1>
                <form onSubmit={handleSubmit} className='credentials_form gap-2 mt-8'>
                    <TextInput name='name' value={form.name} onChange={handleChange} />
                    <TextInput name='email' value={form.email} onChange={handleChange} />
                    <PasswordInput name="password" value={form.password} onChange={handleChange} />

                    <div className='m-1 mb-4 space-y-1'>
                        {renderCondition(passwordConditions.length, 'At least 8 characters')}
                        {renderCondition(passwordConditions.lowercase, 'One lowercase letter')}
                        {renderCondition(passwordConditions.uppercase, 'One uppercase letter')}
                        {renderCondition(passwordConditions.number, 'One number')}
                        {renderCondition(passwordConditions.specialChar, 'One special character')}
                    </div>

                    <PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

                    <div className='mx-1 mb-2'>
                        {renderCondition((form.password || form.confirmPassword) && form.password === form.confirmPassword, 'Passwords match')}
                    </div>

                    <button
                        className='button'
                        type='submit' disabled={loading}>Register</button>
                </form>
                {error && <p className='error_style mb-0'>{error}</p>}
                <AuthRedirectLink text="Already have an account?" linkText="Sign in" to="/login" />
            </div>
        </div>
    )
}