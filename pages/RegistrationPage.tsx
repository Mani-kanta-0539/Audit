
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Button from '../components/Button';
import Card from '../components/Card';
import { SparklesIcon } from '../components/icons/SparklesIcon';


const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to onboarding flow instead of login/dashboard
      navigate('/onboarding');
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError('An account with this email already exists.');
        } else {
            setError('Failed to create account. Please try again.');
        }
        console.error(err);
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
                    Create Your GritGrade Account
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Get started with your free content analysis today.
                </p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
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
                    placeholder="Password (min. 6 characters)"
                    required
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:outline-none disabled:opacity-50"
                    aria-label="Password"
                />
                 <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    disabled={isLoading}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:outline-none disabled:opacity-50"
                    aria-label="Confirm Password"
                />
                {error && <p className="text-error text-sm">{error}</p>}
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account?{' '}
                <NavLink to="/login" className="font-semibold text-primary dark:text-primary-dark hover:underline">
                    Log in
                </NavLink>
            </p>
       </Card>
    </div>
  );
};

export default RegistrationPage;
