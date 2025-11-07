import React, { useState } from 'react';
import { LockIcon } from './icons/LockIcon';
import { auth } from '../firebase/config';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    AuthError
} from 'firebase/auth';

const Login: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFirebaseError = (err: AuthError) => {
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                setError('Invalid email or password.');
                break;
            case 'auth/email-already-in-use':
                setError('An account with this email already exists.');
                break;
            case 'auth/weak-password':
                setError('Password should be at least 6 characters.');
                break;
            default:
                setError('An unexpected error occurred. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Email and password cannot be empty.');
            return;
        }
        
        setIsLoading(true);
        try {
            if (isLoginView) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            // onAuthStateChanged in App.tsx will handle the rest.
        } catch (err) {
            handleFirebaseError(err as AuthError);
        } finally {
            setIsLoading(false);
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                </div>
                {error && <p className="text-brand-danger text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-success text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center disabled:bg-brand-accent disabled:transform-none disabled:cursor-not-allowed"
                >
                     {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        isLoginView ? 'Login' : 'Sign Up'
                      )}
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