import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { getAxios } from "../utils/api";

const statusOptions = ["Interested", "Not Interested", "Pending", "Follow Up"];

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchVal, setSearchVal] = useState(""); // Store the search term
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 5;

  // Fetch enquiries based on current page and search value
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await getAxios().get("/enquiries", {
        params: {
          search: searchVal,
          page: currentPage,
          limit: limit,
        },
      });
      setEnquiries(response.data.data.enquiries);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update status of an enquiry
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/enquiries/${id}/status`, {
        status: newStatus,
      });
      fetchEnquiries(); // Refresh after status update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Trigger search and reset to the first page
  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page
    fetchEnquiries();  // Fetch with search term
  };

  useEffect(() => {
    fetchEnquiries();
  }, [currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Enquiries</h2>
      <div className="my-4 flex gap-2">
        <input
          placeholder="Search"
          className="px-4 py-2 border-2 rounded-md w-[30%]"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}  // Update search value
        />
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          onClick={handleSearch}  // Trigger the search
        >
          Search
        </button>
      </div>
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">SI No.</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq, idx) => (
              <tr key={enq._id} className="border-b">
                <td className="px-4 py-2">{(currentPage - 1) * limit + idx + 1}</td>
                <td className="px-4 py-2">{enq.name}</td>
                <td className="px-4 py-2">{enq.phone}</td>
                <td className="px-4 py-2">{enq.email}</td>
                <td className="px-4 py-2">{enq.service}</td>
                <td className="px-4 py-2">{enq.message}</td>
                <td className="px-4 py-2">
                  <select
                    value={enq.status || ""}
                    onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!loading && enquiries.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
};

export default Enquiry;
