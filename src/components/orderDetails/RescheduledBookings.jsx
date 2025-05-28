import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack, IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import Pagination from "../Pagination";
import { getAxios } from "../../utils/api";

// Utility to format date in yyyy-mm-dd
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const RescheduledBookings = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Holds input until search is triggered
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getAxios().get("/orders/getordersbystatus", {
          params: {
            search: searchVal,
            page: currentPage,
            limit: limit,
            status: "rescheduled",
          },
        });

        setOrderData(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching rescheduled bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchVal, currentPage]);


  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-300 px-2 py-1 rounded-xl"
        >
          <IoArrowBack size={20} />
          Back
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Rescheduled Bookings</h2>
        <div className="my-4 flex gap-2">
          <input
            placeholder="Search by order Id or customer name"
            className="px-4 py-2 border-2 rounded-md min-w-[300px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setSearchVal(searchInput); // Only update this when button is clicked
              setCurrentPage(1); // Reset pagination to page 1
            }}
          >
            Search
          </button>

        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">SI No.</th>
              <th className="px-4 py-2 text-left">Order Id</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-2 text-left">Original Date</th>
              <th className="px-4 py-2 text-left">Rescheduled  Date</th>
              <th className="px-4 py-2 text-left">Rescheduled Reason</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderData?.length > 0 ? (
              orderData.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{formatDate(order.eventDate)}</td>
                  <td className="px-4 py-2">{order.rescheduledEventDate ? formatDate(order.rescheduledEventDate) : "Same Date"}</td>
                  <td className="px-4 py-2">{order.reason || "—"}</td>
                  <td className="px-4 py-2">
                    <Link to={`/orderdetails/details/${order._id}`}>  <IoEyeSharp size={18} /></Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No rescheduled bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default RescheduledBookings;
