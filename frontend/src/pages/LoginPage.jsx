import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center dark:text-white">Login</h2>
                {error && <p className="mb-4 text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Username</label>
                        <input className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                        <input className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700" type="submit">Login</button>
                </form>
                <p className="mt-4 text-center dark:text-gray-300">
                    Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
                </p>
            </div>
        </div>
    );
}
