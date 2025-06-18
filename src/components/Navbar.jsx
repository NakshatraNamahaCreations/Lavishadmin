import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoLogOut } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext.jsx';
import { getAuthAxios } from '../utils/api.js';

const Navbar = ({ setOpenSidebar, onLogout }) => {
  const navigate = useNavigate();
  const { logout, currentAdmin } = useAuth(); // ✅ Added currentAdmin

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return; // If user cancels, do nothing

    try {
      const token = sessionStorage.getItem("accessToken");

      try {
        await getAuthAxios().post("/admin/auth/logout", {}, {
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
            src={`https://api.lavisheventzz.com/api/images/${currentAdmin.profileImage}`}
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

