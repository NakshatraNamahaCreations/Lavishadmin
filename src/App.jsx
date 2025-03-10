// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import MainContent from './components/MainContent';
// import Navbar from './components/Navabar';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import Userdetails from './components/Userdetails';
// import ServiceManagement from './components/ServiceManagement';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [openSidebar, setOpenSidebar] = useState(false);


//   const handleLogin = (status) => {
//     setIsLoggedIn(status);
//   };

//   return (
//     <Router>
//       <div className="flex h-screen ">
//         {/* If not logged in, show the login page */}
//         {!isLoggedIn ? (
//           <Login onLogin={handleLogin} />
//         ) : (
//           <>

//             <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>


//             {/* Main Content */}
//             <div className="flex-1 flex flex-col md:w-[80%] md:ml-[20%] ">
//               {/* Navbar */}
//               <Navbar setOpenSidebar={setOpenSidebar}/>

//               <div className="flex-1 p-6 bg-gray-100 h-screen overflow-y-scroll">
//                 <Routes>
//                   <Route path="/" element={<Dashboard />} />
//                   <Route path="/userdetails" element={<Userdetails />} />
//                   <Route path="/servicemanagement" element={<ServiceManagement />} />
//                   <Route path="/order" element={<h1>Order</h1>} />
//                   <Route path="/coupon" element={<h1>Coupons</h1>} />
//                   {/* Default Route */}
//                   <Route path="/" element={<Dashboard />} />
//                 </Routes>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </Router>
//   );
// };

// export default App;









import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Navbar from './components/Navabar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Userdetails from './components/Userdetails';
import ServiceManagement from './components/ServiceManagement';
import Orderdetails from './components/Orderdetails';
import CouponCreations from './components/CouponCreations';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);


  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <Router>
      <div className="flex h-screen ">

        <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:w-[80%] md:ml-[20%]">
          {/* Navbar */}
          <Navbar setOpenSidebar={setOpenSidebar} />

          <div className="flex-1 p-6 bg-gray-100 h-screen overflow-y-scroll">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/userdetails" element={<Userdetails />} />
              <Route path="/servicemanagement" element={<ServiceManagement />} />
              <Route path="/order" element={<Orderdetails/>} />
              <Route path="/coupon" element={<CouponCreations/>} />
              {/* Default Route */}
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>

      </div>
    </Router>
  );
};

export default App;

