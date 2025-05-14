import { useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoEyeSharp } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";

const Reports = () => {
  const [searchVal, setSearchVal] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFilterClick = () => {
    console.log("Filter clicked with:", { filterDate, statusFilter });
    // Implement filtering logic here
  };

  return (
    <div className="">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={handleBackClick} className="text-xl">
            <IoArrowBack />
          </button>
          <h2 className="text-2xl font-bold">Payments Details</h2>
        </div>


      </div>

      <div className="flex justify-between items-center">

        {/* Search Field */}
        <div className="flex gap-2">
          <input
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
        {/* Filters Below Search */}
        <div className="flex flex-col justify-end mt-6  sm:flex-row gap-3 mb-4">
          <input
            type="date"
            className="px-3 py-1 border border-gray-300 rounded-md w-full sm:w-auto"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <select
            className="px-3 py-1 border border-gray-300 rounded-md w-full sm:w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            className="text-gray-600 rounded-md w-full sm:w-auto"
            onClick={handleFilterClick}
          >
            <FaFilter size={20} />
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">SI No.</th>
              <th className="px-4 py-2 text-left">Booking Date</th>
              <th className="px-4 py-2 text-left">Booking Id</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-2 text-left">Total Amt.</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">01</td>
              <td className="px-4 py-2">{new Date().toLocaleDateString()}</td>
              <td className="px-4 py-2">BKG-123456</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">
                <div className="flex items-center">
                  <MdOutlineCurrencyRupee />
                  2000
                </div>
              </td>
              <td className="px-4 py-2">Paid</td>
              <td className="px-4 py-2">
                <div className="flex  items-center">
                  <button className="text-blue-600 hover:text-gray-800 transition">
                    <IoEyeSharp size={18} />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
