
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/logo.png";
import { IoArrowBack } from "react-icons/io5";
import { TfiAlignLeft } from "react-icons/tfi";

const Sidebar = ({ openSidebar, setOpenSidebar }) => {
    const [isMobile, setIsMobile] = useState(false);

    const location = useLocation(); 

    const checkScreenSize = () => {
        if (window.innerWidth < 768) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    // Check screen size on mount and resize
    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <div className={`lg:w-[20%] w-[250px] border  bg-gray-800 text-white mr-4 border-gray-300 p-4 pt-6 lg:shadow-md fixed h-screen z-30 ${isMobile && !openSidebar ? "hidden" : "block"}`}>
            <Link to="/" onClick={() => setOpenSidebar(false)}>
                <div className="flex justify-center mb-8">
                    <img src={logo} alt="Logo" className="w-28" />
                </div>
            </Link>
            {isMobile && <div className='absolute top-4 right-3' onClick={() => setOpenSidebar(false)}>
                <IoArrowBack />
            </div>}
            <div className="mt-5">
                <ul className="flex flex-col gap-4 md:px-5">
                    <li>
                        <Link
                            to="/"
                            className={`block p-3 rounded-md ${location.pathname === '/' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/userdetails"
                            className={`block p-3 rounded-md ${location.pathname === '/userdetails' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            User Details
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/servicemanagement"
                            className={`block p-3 rounded-md ${location.pathname === '/servicemanagement' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            Service Management
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/ordersdetail"
                            className={`block p-3 rounded-md ${location.pathname === '/ordersdetail' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            Order Details
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/coupon"
                            className={`block p-3 rounded-md ${location.pathname === '/coupon' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            Coupons
                        </Link>
                    </li>
                </ul>
            </div>

            {
                isMobile && !openSidebar && (
                    <div className="lg:hidden fixed top-[134px] left-0 z-20 w-[15%] h-[86vh] bg-white border border-gray-300 lg:rounded-xl rounded-e-xl p-4 shadow-md">
                        <TfiAlignLeft size={25} className='text-blue-800 mx-auto ' onClick={() => setOpenSidebar(true)} />
                        <ul className="flex flex-col gap-4 px-5">
                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setOpenSidebar(false)}
                                    className={`block p-3 rounded-md ${location.pathname === '/' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/userdetails"
                                    onClick={() => setOpenSidebar(false)}
                                    className={`block p-3 rounded-md ${location.pathname === '/userdetails' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                                >
                                    User Details
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/servicemanagement"
                                    onClick={() => setOpenSidebar(false)}
                                    className={`block p-3 rounded-md ${location.pathname === '/servicemanagement' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                                >
                                    Service Management
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/ordersdetail"
                                    onClick={() => setOpenSidebar(false)}
                                    className={`block p-3 rounded-md ${location.pathname === '/ordersdetail' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                                >
                                    Orders Details
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/coupon"
                                    onClick={() => setOpenSidebar(false)}
                                    className={`block p-3 rounded-md ${location.pathname === '/coupon' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                                >
                                    Coupons
                                </Link>
                            </li>
                        </ul>
                    </div>
                )
            }
        </div >
    );
};

export default Sidebar;
