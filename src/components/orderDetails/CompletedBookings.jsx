import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack, IoEyeSharp } from "react-icons/io5";
import Pagination from "../Pagination"; 
import { getAxios } from "../../utils/api";

const CompletedBookings = () => {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; 

  const navigate = useNavigate();

  // Fetch completed orders based on search term, pagination, and status
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
  
      try {
        const response = await getAxios().get("/orders/getordersbystatus/", {
          params: {
            search: searchVal,
            page: currentPage,
            limit: limit,
            status: "completed",
          },
        });
  
        setOrderData(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching completed bookings.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [searchVal, currentPage]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
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
        <h2 className="text-2xl font-bold mb-4">Completed Bookings</h2>
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
              setSearchVal(searchInput);
              setCurrentPage(1);
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Error and Loading States */}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : orderData.length > 0 ? (
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left">SI No.</th>
                <th className="px-4 py-2 text-left">Order Id</th>
                <th className="px-4 py-2 text-left">Customer Name</th>
                <th className="px-4 py-2 text-left">Event Date</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">
                    {/* {(currentPage - 1) * limit + index + 1} */}
                    {index + 1}
                  </td>
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{formatDate(order.eventDate)}</td>
                  <td className="px-4 py-2">
                    <Link to={`/orderdetails/completed-bookings/${order._id}`}>  <IoEyeSharp size={18} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No completed bookings found.</p>
          </div>
        )}
      </div>

      {/* Pagination below the table, centered */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CompletedBookings;
