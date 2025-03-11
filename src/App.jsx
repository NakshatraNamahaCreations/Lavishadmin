import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navabar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Userdetails from './components/Userdetails';
import ServiceManagement from './components/ServiceManagement';
import Orderdetails from './components/Orderdetails';
import CouponCreations from './components/CouponCreations';
import UserdetailsCard from './components/UserdetailsCard';
import OrderDetailsCard from './components/OrderDetailsCard';

const token = localStorage.getItem("accessToken")
const App = () => {

  const [openSidebar, setOpenSidebar] = useState(false);

  console.log("nafn:", token)
  return (
    <Router>
      <div className="flex h-screen ">

        <>
          <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

          <div className="flex-1 flex flex-col md:w-[80%] md:ml-[20%] ">
            {/* Navbar */}
            <Navbar setOpenSidebar={setOpenSidebar} />

            <div className="flex-1 p-6 bg-gray-100 h-screen overflow-y-scroll">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/userdetails" element={<Userdetails />} />
                <Route path="/servicemanagement" element={<ServiceManagement />} />
                <Route path="/ordersdetail" element={<Orderdetails />} />
                <Route path="/coupon" element={<CouponCreations />} />
                <Route path="/userdetails/:userid" element={<UserdetailsCard />} />
                <Route path="/order/:orderid" element={<OrderDetailsCard />} />
              </Routes>
            </div>
          </div>
        </>

      </div>
    </Router>
  );
};

export default App;

