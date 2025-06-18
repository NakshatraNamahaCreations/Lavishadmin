import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Userdetails from "./components/Userdetails";
import ServiceManagement from "./components/ServiceManagement";
// import Orderdetails from "./components/Orderdetails";
import CouponCreations from "./components/CouponCreations";
import UserdetailsCard from "./components/UserdetailsCard";
import OrderDetailsCard from "./components/OrderDetailsCard";
import AddCategory from "./components/category_managemnet/AddCategory";
import AddSubCategory from "./components/category_managemnet/AddSubCategory";
import AddSubSubCategory from "./components/category_managemnet/AddSubSubCategory";
import AddService from "./components/service_management/AddService";
import AddTheme from "./components/category_managemnet/AddTheme";
import ServiceList from "./components/service_management/ServiceList";
import { AuthProvider, useAuth } from "./utils/authContext.jsx";
import AddBalloonColor from "./components/category_managemnet/AddBalloonColor.jsx";
import EditService from "./components/service_management/EditService.jsx";
import ServiceDetails from "./components/service_management/ServiceDetails.jsx";
import AddonsList from "./components/service_management/Addons/AddonsList.jsx";
import AddAddons from "./components/service_management/Addons/AddAddons.jsx";
import EditAddons from "./components/service_management/Addons/EditAddons.jsx";
import AddonsDetails from "./components/service_management/Addons/AddonsDetails.jsx";
import BulkServices from "./components/service_management/BulkServices.jsx";
import BigCalendar from "./components/orderDetails/BigCalendar.jsx";
import Bookingdetails from "./components/orderDetails/Bookingdetails.jsx";
import RescheduledBookings from "./components/orderDetails/RescheduledBookings.jsx";
import CancelledBookings from "./components/orderDetails/CancelledBookings.jsx";
import CompletedBookings from "./components/orderDetails/CompletedBookings.jsx";
import Banner from "./components/Banner.jsx";
import Reports from "./components/Reports.jsx";
import PaymentsDetails from "./components/payment/PaymentsDetails.jsx";
import Teams from "./components/settings/teams/Teams.jsx";
import AddTeamMember from "./components/settings/teams/AddTeamMember.jsx";
import EditTeamMember from "./components/settings/teams/EditTeamMember.jsx";
import OrderDetails from "./components/orderDetails/orderDetails.jsx";
import Enquiry from "./components/Enquiry.jsx";
import RaiseTicket from "./components/RaiseTicket.jsx";
import Invoice from "./components/orderDetails/Invoice.jsx";

const AppContent = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { token, logout } = useAuth();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    logout();
  };


  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <div className="flex h-screen">
                <Sidebar
                  openSidebar={openSidebar}
                  setOpenSidebar={setOpenSidebar}
                />
                <div className="flex-1 flex flex-col md:w-[80%] md:ml-[280px]">
                  <Navbar
                    setOpenSidebar={setOpenSidebar}
                    onLogout={handleLogout}
                  />
                  <div className="flex-1 p-6 bg-gray-100 h-screen overflow-y-scroll">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/users" element={<Userdetails />} />
                      <Route path="/enquiry" element={<Enquiry />} />

                      <Route path="/banner" element={<Banner />} />
                      <Route
                        path="/catgory/add_category"
                        element={<AddCategory />}
                      />
                      <Route
                        path="/catgory/add_subcategory"
                        element={<AddSubCategory />}
                      />
                      <Route
                        path="/catgory/add_sub_subcategory"
                        element={<AddSubSubCategory />}
                      />
                      <Route path="/catgory/add_theme" element={<AddTheme />} />
                      <Route
                        path="/catgory/add_balloonColor"
                        element={<AddBalloonColor />}
                      />
                      <Route
                        path="/service/addService"
                        element={<AddService />}
                      />
                      <Route
                        path="/service/editService/:serviceId"
                        element={<EditService />}
                      />
                      <Route
                        path="/service/view-details/:serviceId"
                        element={<ServiceDetails />}
                      />
                      <Route
                        path="/service/service-list"
                        element={<ServiceList />}
                      />
                      <Route
                        path="/addons/addons-list"
                        element={<AddonsList />}
                      />
                      <Route
                        path="/addons/add-addons"
                        element={<AddAddons />}
                      />
                      <Route
                        path="/addons/editAddons/:addonId"
                        element={<EditAddons />}
                      />
                      <Route
                        path="/addons/view-details/:addonId"
                        element={<AddonsDetails />}
                      />
                      <Route
                        path="/service/bulk-services"
                        element={<BulkServices />}
                      />
                      <Route
                        path="/servicemanagement"
                        element={<ServiceManagement />}
                      />
                      <Route
                        path="/orderdetails/calender"
                        element={<BigCalendar />}
                      />
                      <Route
                        path="/orderdetails/booking-details/:date"
                        element={<Bookingdetails />}
                      />
                      <Route
                        path="/orderdetails/cancelled-bookings"
                        element={<CancelledBookings />}
                      />
                      <Route
                        path="/orderdetails/rescheduled-bookings"
                        element={<RescheduledBookings />}
                      />
                      <Route
                        path="/orderdetails/completed-bookings"
                        element={<CompletedBookings />}
                      />
                      <Route
                        path="/orderdetails/details/:id"
                        element={<OrderDetails />}
                      />
                      <Route
                        path="/orderdetails/cancelled-bookings/:id"
                        element={<OrderDetails />}
                      />
                      <Route
                        path="/orderdetails/rescheduled-bookings/:id"
                        element={<OrderDetails />}
                      />
                      <Route
                        path="/orderdetails/completed-bookings/:id"
                        element={<OrderDetails />}
                      />
                      <Route path="/coupon" element={<CouponCreations />} />
                      <Route
                        path="/users/:userid"
                        element={<UserdetailsCard />}
                      />
                      <Route
                        path="/order/:_id"
                        element={<OrderDetailsCard />}
                      />
                      <Route
                        path="/invoice/:id"
                        element={<Invoice />}
                      />
                      <Route
                        path="/payment-details"
                        element={<PaymentsDetails />}
                      />
                      <Route path="/report" element={<Reports />} />
                      <Route path="/teams" element={<Teams />} />
                      <Route path="/raised-tickests" element={<RaiseTicket />} />
                      <Route path="/teams/add-member" element={<AddTeamMember />} />
                      <Route path="/teams/edit-member/:id" element={<EditTeamMember />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
