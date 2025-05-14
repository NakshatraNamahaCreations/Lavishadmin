// import React from 'react';
// import { FaSearch, FaUserCircle } from 'react-icons/fa';
// import { IoLogOut } from "react-icons/io5";
// import { RiMenu2Line } from "react-icons/ri";
// import axios from "axios"
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../utils/authContext.jsx';

// const Navbar = ({ setOpenSidebar, onLogout }) => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleLogout = async () => {
//     try {
//       const token = sessionStorage.getItem("accessToken");
//       if (!token) {
//         // If token is already missing, just clean up and redirect
//         sessionStorage.removeItem("accessToken");
//         logout(); // Use context logout
//         if (onLogout) {
//           onLogout();
//         }
//         navigate("/login");
//         return;
//       }

//       try {
//         // Try to call the logout endpoint
//         const response = await axios.post("http://localhost:5000/api/admin/auth/logout", {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             }
//           });

//         console.log("Logout successful:", response.data);
//       } catch (apiError) {
//         // Even if the server logout fails, we'll continue with client-side logout
//         console.error("Logout API error:", apiError.message);
//       } finally {
//         // Always remove token and redirect regardless of API success
//         sessionStorage.removeItem("accessToken");
//         logout(); // Use context logout
//         if (onLogout) {
//           onLogout();
//         }
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//       // Failsafe: make sure we handle any unexpected errors by still clearing state
//       sessionStorage.removeItem("accessToken");
//       logout(); // Use context logout
//       if (onLogout) {
//         onLogout();
//       }
//       navigate("/login");
//     }
//   }

//   return (
//     <div className="bg-white p-4 shadow-md flex justify-between items-center relative md:w-auto ">
//       <div className='absolute top-4 left-2 block md:hidden ' onClick={() => setOpenSidebar(true)}>
//         <RiMenu2Line size={30} />
//       </div>

//       <div className="flex items-center space-x-4 md:mx-0 mx-8  cursor-pointer">
//         <FaUserCircle className="text-2xl text-gray-600" />
//         <span className="text-gray-600">Admin</span>
//       </div>
//       <div className="flex items-center gap-1  cursor-pointer" onClick={handleLogout}>
//         <IoLogOut className="text-2xl text-gray-600 cursor-pointer" />
//         <span className="text-gray-600">Logout</span>
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoLogOut } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext.jsx';

const Navbar = ({ setOpenSidebar, onLogout }) => {
  const navigate = useNavigate();
  const { logout, currentAdmin } = useAuth(); // ✅ Added currentAdmin

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      try {
        await axios.post("http://localhost:5000/api/admin/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (apiError) {
        console.error("Logout API error:", apiError.message);
      } finally {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("admin");
        logout();
        if (onLogout) onLogout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("admin");
      logout();
      if (onLogout) onLogout();
      navigate("/login");
    }
  };

  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center relative md:w-auto">
      <div className="absolute top-4 left-2 block md:hidden" onClick={() => setOpenSidebar(true)}>
        <RiMenu2Line size={30} />
      </div>

      <div className="flex items-center space-x-4 md:mx-0 mx-8 cursor-pointer">
        {currentAdmin?.profileImage ? (
          <img
            // src={`/images/uploads/${currentAdmin.profileImage}`}
            src={`http://localhost:5000/images/${currentAdmin.profileImage}`}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-2xl text-gray-600" />
        )}
        <span className="text-gray-600">
          {currentAdmin?.name || "Admin"}
        </span>
      </div>

      <div className="flex items-center gap-1 cursor-pointer" onClick={handleLogout}>
        <IoLogOut className="text-2xl text-gray-600" />
        <span className="text-gray-600">Logout</span>
      </div>
    </div>
  );
};

export default Navbar;

