import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { getAxios } from "../utils/api";
import dayjs from "dayjs";

const formatDateTime = (isoString) => {
  return dayjs(isoString).format("DD-MM-YYYY hh:mm A");
};

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [searchVal, setSearchVal] = useState(""); // Store the search term
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 10;

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
      console.log("enquiries",response.data.data.enquiries)
      setEnquiries(response.data.data.enquiries);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
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
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : enquiries.length > 0 ? (
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left">SI No.</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Service</th>
                <th className="px-4 py-2 text-left">Message</th>
               <th className="px-4 py-2 text-left">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq, idx) => (
                <tr key={enq._id} className="border-b">
                  <td className="px-2 py-2">{(currentPage - 1) * limit + idx + 1}</td>
                  <td className="px-2 py-2">{enq.name}</td>
                  <td className="px-2 py-2">{enq.phone}</td>
                  <td className="px-2 py-2  ">{enq.email}</td>
                  <td className="px-2 py-2">{enq.service}</td>
                  <td className="px-2 py-2 ">{enq.message}</td>
                    <td className="px-2 py-2">{formatDateTime(enq.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No enquiries found.</p>
          </div>
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

export default Enquiry;
