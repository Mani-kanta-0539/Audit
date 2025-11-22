
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Button from '../components/Button';
import Card from '../components/Card';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      // Handle various authentication failure codes
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.');
      } else {
        // Only log unexpected errors to the console
        console.error("Login error:", err);
        setError('Failed to log in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
       <Card className="max-w-md w-full">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <SparklesIcon className="h-12 w-12 text-primary dark:text-primary-dark" />
                </div>
                <h1 className="text-2xl font-bold font-display text-light-text dark:text-dark-text mb-2">
                    Welcome Back to GritGrade
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Sign in to access your dashboard and audit history.
                </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
                 <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:outline-none disabled:opacity-50"
                    aria-label="Email"
                />
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:outline-none disabled:opacity-50"
                    aria-label="Password"
                />
                {error && <p className="text-error text-sm">{error}</p>}
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
                Don't have an account?{' '}
                <NavLink to="/register" className="font-semibold text-primary dark:text-primary-dark hover:underline">
                    Sign up
                </NavLink>
            </p>
       </Card>
    </div>
  );
};

export default LoginPage;
