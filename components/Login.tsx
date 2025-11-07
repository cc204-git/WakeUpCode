import React, { useState } from 'react';
import { LockIcon } from './icons/LockIcon';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Email and password cannot be empty.');
            return;
        }

        if (isLoginView) {
            // Handle Login
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setError('No account found with this email. Please sign up.');
                return;
            }
            const user = JSON.parse(storedUser);
            if (user.email === email && user.password === password) {
                localStorage.setItem('sessionToken', 'mock-logged-in');
                onLoginSuccess();
            } else {
                setError('Invalid email or password.');
            }
        } else {
            // Handle Sign Up
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user.email === email) {
                    setError('An account with this email already exists.');
                    return;
                }
            }
            // In a real app, password would be hashed.
            localStorage.setItem('user', JSON.stringify({ email, password }));
            localStorage.setItem('sessionToken', 'mock-logged-in');
            onLoginSuccess();
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="bg-brand-secondary p-8 rounded-2xl shadow-2xl animate-fade-in">
            <div className="text-center mb-6">
                <div className="inline-block bg-brand-accent p-4 rounded-full mb-4">
                    <LockIcon className="w-8 h-8 text-brand-highlight" />
                </div>
                <h1 className="text-3xl font-bold text-brand-highlight">
                    {isLoginView ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-brand-light mt-2">
                    {isLoginView ? 'Log in to access your goals.' : 'Sign up to start your journey.'}
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-light mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-brand-primary border border-brand-accent text-brand-highlight rounded-lg p-3 focus:ring-2 focus:ring-brand-light focus:outline-none transition"
                        autoComplete="email"
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="block text-sm font-medium text-brand-light mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-brand-primary border border-brand-accent text-brand-highlight rounded-lg p-3 focus:ring-2 focus:ring-brand-light focus:outline-none transition"
                        autoComplete={isLoginView ? "current-password" : "new-password"}
                    />
                </div>
                {error && <p className="text-brand-danger text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-brand-success text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    {isLoginView ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <div className="text-center mt-6">
                <button onClick={toggleView} className="text-sm text-brand-light hover:text-brand-highlight font-semibold transition-colors">
                    {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default Login;
