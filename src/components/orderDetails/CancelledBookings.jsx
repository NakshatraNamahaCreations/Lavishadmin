import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack, IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import Pagination from "../Pagination"; // Ensure this is correctly imported
import { getAxios } from "../../utils/api";

const CancelledBookings = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Temporary input holder
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5; // Pagination limit

  const navigate = useNavigate();

  // Fetch cancelled orders based on search term, pagination, and status
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
  
      try {
        const response = await getAxios().get("/orders/getordersbystatus/", {
          params: {
            search: searchVal, // This only updates on search button click
            page: currentPage,
            limit: limit,
            status: "cancelled",
          },
        });
  
        setOrderData(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching cancelled bookings.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [searchVal, currentPage]);
  
  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1); // Reset page to 1 whenever search text changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the page when pagination is used
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if needed
    const day = String(d.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
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

      {/* Title and Search Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Cancelled Bookings</h2>
        <div className="my-4 flex gap-2">
          <input
            placeholder="Search by order Id or customer name"
            className="px-4 py-2 border-2 rounded-md min-w-[300px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Only update local input
          />
          {/* Optional: You can use a button to explicitly trigger the search if necessary */}
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setSearchVal(searchInput); // Trigger search
              setCurrentPage(1);         // Reset to first page
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Error and Loading States */}
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Table displaying cancelled orders */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">SI No.</th>
              <th className="px-4 py-2 text-left">Order Id</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-2 text-left">Cancelled Date</th>
              <th className="px-4 py-2 text-left">Refund Amount</th>
              <th className="px-4 py-2 text-left">Cancellation Reason</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Display order data */}
            {orderData?.length > 0 ? (
              orderData.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{formatDate(order.updatedAt)}</td>
                  <td className="px-4 py-2 flex items-center">
                    <MdOutlineCurrencyRupee />
                    {order.paidAmount}
                  </td>
                  <td className="px-4 py-2">{order.reason || "—"}</td>
                  <td className="px-4 py-2">
                    <Link to={`/orderdetails/details/${order._id}`}>  <IoEyeSharp size={18} /></Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No cancelled bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CancelledBookings;
