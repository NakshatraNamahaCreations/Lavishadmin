// import React, { useState } from 'react';
// import logo from "../assets/logo.png";
// import bg from "../assets/login_bg.png";
// import axios from "axios"
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../utils/authContext.jsx';

// const Login = ({ onLoginSuccess }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     const handleLogin = async () => {
//         setError("");
//         setLoading(true);

//         try {
//             const response = await axios.post("https://api.lavisheventzz.com/api/admin/auth/login", { email, password }, { withCredentials: true })
//             console.log(response)

//             // Handling response status and setting access token
//             if (response.status === 201) {
//                 const { accessToken } = response.data;
//                 sessionStorage.setItem("accessToken", accessToken);
//                 login(accessToken);

//                 console.log("Logged in User :", response.data)
//                 if (onLoginSuccess) {
//                     onLoginSuccess();
//                 }
//                 navigate("/");
//             } else {
//                 setError("Something went wrong");
//             }

//         } catch (error) {
//             setError(error.response?.data?.message || "Something went wrong!");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleKeyDown = (e) => {
//         // Check if the pressed key is "Enter" (key code 13)
//         if (e.key === 'Enter') {
//             handleLogin();
//         }
//     };

//     return (
//         <div
//             className="flex flex-col gap-10 pt-4 items-center h-screen w-screen"
//             style={{
//                 backgroundImage: `url(${bg})`,
//                 backgroundSize: 'cover',
//                 backgroundRepeat: 'no-repeat',
//                 backgroundPosition: 'center',
//             }}
//         >
//             <img src={logo} className='mx-auto w-32' alt="Logo" />
//             <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//                 <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
//                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium">Email</label>
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded mt-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter username"
//                         onKeyDown={handleKeyDown}
//                     />
//                 </div>

//                 <div className="mb-6">
//                     <label className="block text-sm font-medium">Password</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded mt-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Enter password"
//                         onKeyDown={handleKeyDown}
//                     />
//                 </div>

//                 <button
//                     onClick={handleLogin}
//                     className="w-full bg-pink-800 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//                 >
//                     {loading ? "Processing..." : "Login"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react';
import logo from "../assets/logo.png";
import bg from "../assets/login_bg.png";
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext.jsx';
import { getAuthAxios } from '../utils/api.js';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleLogin = async () => {
      setError("");
      setLoading(true);
    
      try {
        const response = await getAuthAxios().post("https://api.lavisheventzz.com/api/admin/auth/login", { email, password }, { withCredentials: true });
    
        if (response.status === 201) {
          const { accessToken, admin } = response.data;
    
          login(accessToken, admin); // ✅ store both token and admin
    
          console.log("Logged in Admin:", admin);
          if (onLoginSuccess) onLoginSuccess();
          navigate("/");
        } else {
          setError("Something went wrong");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    

    const handleKeyDown = (e) => {
        // Check if the pressed key is "Enter" (key code 13)
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div
            className="flex flex-col gap-10 pt-4 items-center h-screen w-screen"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <img src={logo} className='mx-auto w-32' alt="Logo" />
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded mt-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username"
                        onKeyDown={handleKeyDown}
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
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-pink-800 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                    {loading ? "Processing..." : "Login"}
                </button>
            </div>
        </div>
    );
};

export default Login;
