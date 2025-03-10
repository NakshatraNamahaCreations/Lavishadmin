import React, { useState } from 'react';
import logo from "../assets/logo.png";
import bg from "../assets/login_bg.png"; 

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'password') {
            onLogin(true);
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div
            className="flex flex-col gap-10 pt-24 items-center h-screen w-screen"
            style={{
                backgroundImage: `url(${bg})`, 
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <img src={logo} className='mx-auto' alt="Logo" />
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-pink-800 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
