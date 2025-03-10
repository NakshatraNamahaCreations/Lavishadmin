import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa'; 
import { IoLogOut } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";

const Navbar = ({setOpenSidebar}) => {
  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center relative md:w-auto ">
    
      <div className='absolute top-4 left-2 block md:hidden ' onClick={()=>setOpenSidebar(true)}>
        <RiMenu2Line size={30}/>
      </div>

      <div className="flex items-center space-x-4 md:mx-0 mx-8">
        <FaUserCircle className="text-2xl text-gray-600 cursor-pointer" />
        <span className="text-gray-600">Admin</span>
      </div>
      <div className="flex items-center gap-1 ">
        <IoLogOut className="text-2xl text-gray-600 cursor-pointer" />
        <span className="text-gray-600">Logout</span>
      </div>
    </div>
  );
};

export default Navbar;
