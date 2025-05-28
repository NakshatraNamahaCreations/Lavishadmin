import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import Pagination from "../Pagination";
import { getAxios } from "../../utils/api";

const Bookingdetails = () => {
  const { date } = useParams(); // Extract date from URL params
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For typing
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 5; // Number of orders per page
  const navigate = useNavigate();

  // Fetch orders based on the date, search term, and pagination
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getAxios().get(`/orders/getordersbystatus/`, {
          params: {
            eventDate: date,
            search: searchVal, // <-- This only updates when button is clicked
            page: currentPage,
            limit: limit,
            status: "created"
          },
        });

        setOrderData(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [date, searchVal, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };


  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous route
  };

  return (
    <div className="">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-300 px-2 py-1 rounded-xl"
        >
          <IoArrowBack size={20} />
          Back
        </button>
      </div>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold mb-4">Order Details for {date}</h2>
        <div className="my-4 flex gap-2 ">
          <input
            placeholder="Search by order Id or customer name"
            className="px-4 py-2 border-2 rounded-md min-w-[300px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} 
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setSearchVal(searchInput);
              setCurrentPage(1);     
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Display Order Data */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left cursor-pointer">SI No.</th>
              <th className="px-4 py-2 text-left cursor-pointer">Order Id</th>
              <th className="px-4 py-2 text-left cursor-pointer">Cust. name</th>
              <th className="px-4 py-2 text-left cursor-pointer">Event Date</th>
              <th className="px-4 py-2 text-left cursor-pointer">Total Amount</th>
              <th className="px-4 py-2 text-left cursor-pointer">Status</th>
              <th className="px-4 py-2 text-left cursor-pointer">Action</th>
            </tr>
          </thead>
          <tbody>
            {orderData && orderData.length > 0 ? (
              orderData.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">{index + 1}</td>
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.eventDate}</td>
                  <td className="px-4 py-2 flex items-center">
                    <MdOutlineCurrencyRupee />
                    {order.grandTotal}
                  </td>
                  <td className="px-4 py-2">{order.orderStatus}</td>
                  <td className="px-4 py-2">
                    <Link to={`/orderdetails/details/${order._id}`}>  <IoEyeSharp size={18} /></Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-4 py-2">
                  No orders found for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />}

    </div>
  );
};

export default Bookingdetails;
