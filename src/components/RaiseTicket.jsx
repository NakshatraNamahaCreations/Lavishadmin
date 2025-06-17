import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { getAxios } from "../utils/api"; 

const RaiseTicket = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await getAxios().get("/tickets/", {
        params: {
          search: searchVal,
          page: currentPage,
          limit: limit,
        },
      });

      setEnquiries(response.data.tickets);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEnquiries();
  };

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Raised Tickets</h2>

      <div className="my-4 flex gap-2">
        <input
          placeholder="Search by Order ID or Mobile Number"
          className="px-4 py-2 border-2 rounded-md w-[30%]"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left">SI No.</th>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Mobile Number</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length > 0 ? (
                enquiries.map((enq, idx) => (
                  <tr key={enq._id} className="border-b">
                    <td className="px-4 py-2">{(currentPage - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-2">{enq.orderId}</td>
                    <td className="px-4 py-2">{enq.mobileNumber}</td>
                    <td className="px-4 py-2">{enq.title}</td>
                    <td className="px-4 py-2">{enq.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    <p className="text-lg">No tickets found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
};

export default RaiseTicket;
