import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { IoArrowBack } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useAuth } from "../utils/authContext";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const { currentAdmin } = useAuth(); // ✅ Added currentAdmin
  console.log("currentAdmin", currentAdmin)

  const location = useLocation();

  const checkScreenSize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`w-[250px] lg:w-[280px] bg-gray-800 text-white fixed top-0 left-0 h-screen z-30 
            border-r border-gray-300 pt-6 px-4 overflow-y-auto
            ${isMobile && !openSidebar ? "hidden" : "block"}`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        minWidth: "250px",
        maxWidth: "280px",
        paddingBottom: "50px",
      }}
    >
      <style>
        {`
                ::-webkit-scrollbar {
                    display: none;
                }
            `}
      </style>

      <Link to="/" onClick={() => setOpenSidebar(false)}>
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="w-28" />
        </div>
      </Link>

      {isMobile && (
        <div
          className="absolute top-4 right-3"
          onClick={() => setOpenSidebar(false)}
        >
          <IoArrowBack />
        </div>
      )}

      <div className="mt-5">
        <ul className="flex flex-col gap-2">
          {currentAdmin?.accessTabs?.includes("dashboard") && (
            <li>
              <Link to="/" className={`block px-3 py-2 rounded-md ${isActive("/") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Dashboard
              </Link>
            </li>
          )}
          {currentAdmin?.accessTabs?.includes("enquiry") && (
            <li>
              <Link to="/enquiry" className={`block px-3 py-2 rounded-md ${isActive("/enquiry") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Enquiry
              </Link>
            </li>
          )}

          {currentAdmin?.accessTabs?.includes("users") && (
            <li>
              <Link to="/users" className={`block px-3 py-2 rounded-md ${isActive("/users") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                User Details
              </Link>
            </li>
          )}

          {currentAdmin?.accessTabs?.includes("banner") && (
            <li>
              <Link to="/banner" className={`block px-3 py-2 rounded-md ${isActive("/banner") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Banner
              </Link>
            </li>
          )}

          {/* Category Management */}
          {(["add_category", "add_subcategory", "add_sub_subcategory", "add_theme", "add_balloonColor"]
            .some(tab => currentAdmin?.accessTabs?.includes(tab))) && (
              <li>
                <div onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="flex justify-between items-center cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700">
                  <span>Category Management</span>
                  {showCategoryDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {showCategoryDropdown && (
                  <ul className="pl-4 mt-2 flex flex-col gap-2">
                    {currentAdmin.accessTabs.includes("add_category") && (
                      <li><Link to="/catgory/add_category" className={`block px-3 py-2 rounded-md ${isActive("/catgory/add_category") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add Category</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("add_subcategory") && (
                      <li><Link to="/catgory/add_subcategory" className={`block px-3 py-2 rounded-md ${isActive("/catgory/add_subcategory") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add Sub Category</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("add_sub_subcategory") && (
                      <li><Link to="/catgory/add_sub_subcategory" className={`block px-3 py-2 rounded-md ${isActive("/catgory/add_sub_subcategory") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add Sub Sub Category</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("add_theme") && (
                      <li><Link to="/catgory/add_theme" className={`block px-3 py-2 rounded-md ${isActive("/catgory/add_theme") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add Theme</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("add_balloonColor") && (
                      <li><Link to="/catgory/add_balloonColor" className={`block px-3 py-2 rounded-md ${isActive("/catgory/add_balloonColor") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add Balloons Color</Link></li>
                    )}
                  </ul>
                )}
              </li>
            )}

          {/* Service Management */}
          {(["service_list", "addons_list", "coupon"]
            .some(tab => currentAdmin?.accessTabs?.includes(tab))) && (
              <li>
                <div onClick={() => setShowServiceDropdown(!showServiceDropdown)} className="flex justify-between items-center cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700">
                  <span>Service Management</span>
                  {showServiceDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {showServiceDropdown && (
                  <ul className="pl-4 mt-2 flex flex-col gap-2">
                    {currentAdmin.accessTabs.includes("service_list") && (
                      <li><Link to="/service/service-list" className={`block px-3 py-2 rounded-md ${isActive("/service/service-list") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add Service</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("addons_list") && (
                      <li><Link to="/addons/addons-list" className={`block px-3 py-2 rounded-md ${isActive("/addons/addons-list") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Add-ons</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("coupon") && (
                      <li><Link to="/coupon" className={`block px-3 py-2 rounded-md ${isActive("/coupon") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Coupons</Link></li>
                    )}
                  </ul>
                )}
              </li>
            )}

          {/* Order Details */}
          {(["booking_details", "cancelled_bookings", "rescheduled_bookings", "completed_bookings"]
            .some(tab => currentAdmin?.accessTabs?.includes(tab))) && (
              <li>
                <div onClick={() => setShowOrderDropdown(!showOrderDropdown)} className="flex justify-between items-center cursor-pointer px-3 py-2 rounded-md hover:bg-gray-700">
                  <span>Order Details</span>
                  {showOrderDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                {showOrderDropdown && (
                  <ul className="pl-4 mt-2 flex flex-col gap-2">
                    {currentAdmin.accessTabs.includes("booking_details") && (
                      <li><Link to="/orderdetails/calender" className={`block px-3 py-2 rounded-md ${isActive("/orderdetails/booking-details") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Booking Details</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("cancelled_bookings") && (
                      <li><Link to="/orderdetails/cancelled-bookings" className={`block px-3 py-2 rounded-md ${isActive("/orderdetails/cancelled-bookings") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Cancelled Bookings</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("rescheduled_bookings") && (
                      <li><Link to="/orderdetails/rescheduled-bookings" className={`block px-3 py-2 rounded-md ${isActive("/orderdetails/rescheduled-bookings") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Rescheduled Bookings</Link></li>
                    )}
                    {currentAdmin.accessTabs.includes("completed_bookings") && (
                      <li><Link to="/orderdetails/completed-bookings" className={`block px-3 py-2 rounded-md ${isActive("/orderdetails/completed-bookings") ? "bg-gray-600" : "hover:bg-gray-700"}`}>Completed Bookings</Link></li>
                    )}
                  </ul>
                )}
              </li>
            )}

          {currentAdmin.accessTabs.includes("payment_details") && (
            <li>
              <Link to="/payment-details" className={`block px-3 py-2 rounded-md ${isActive("/payment-details") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Payment Details
              </Link>
            </li>
          )}

          {/* {currentAdmin.accessTabs.includes("report") && (
            <li>
              <Link to="/report" className={`block px-3 py-2 rounded-md ${isActive("/report") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Reports
              </Link>
            </li>
          )} */}

             <li>
              <Link to="/blogs" className={`block px-3 py-2 rounded-md ${isActive("/report") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Add Blogs
              </Link>
            </li>

          {currentAdmin.accessTabs.includes("teams") && (
            <li>
              <Link to="/teams" className={`block px-3 py-2 rounded-md ${isActive("/teams") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Teams
              </Link>
            </li>
          )}

          {currentAdmin.accessTabs.includes("raised_tickets") && (
            <li>
              <Link to="/raised-tickests" className={`block px-3 py-2 rounded-md ${isActive("/raised-tickests") ? "bg-gray-600" : "hover:bg-gray-700"}`}>
                Raise Ticket
              </Link>
            </li>
           )}
        </ul>

      </div>
    </div>
  );
};

export default Sidebar;


