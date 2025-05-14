
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import Pagination from "../Pagination"; // Import the reusable Pagination component

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Function to fetch services with pagination and search
  const fetchServices = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/services?page=${page}&limit=10&search=${search}`
      );
      const { data, totalPages } = response.data;
      setServices(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching services:", error.message);
      setError("Failed to fetch services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/delete/${id}`);
      fetchServices(page, searchQuery); // Refresh the current page after deletion
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete service");
    }
  };

  // Fetch services when the component mounts or page changes
  useEffect(() => {
    fetchServices(page, searchQuery);
  }, [page]);

  const handleSearch = () => {
    setPage(1); // Reset to the first page when performing a new search
    fetchServices(1, searchQuery); // Fetch services with the search query
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="mx-auto bg-white rounded-lg flex justify-between items-center gap-2 my-4">
          {/* Search Bar */}
          <div className="my-4 flex gap-2">
            <input
              placeholder="Search by sub category or addons"
              className="px-4 py-2 border-2 rounded-md w-[400px] "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />

            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="flex gap-2 align-items-center">
            <button
              onClick={() => navigate("/service/addService")}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Add
            </button>
            <button
              onClick={() => navigate("/service/bulk-services")}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Add Bulk Services
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Service List</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Subcategory</th>
                <th className="border border-gray-300 px-4 py-2">
                  Sub-subcategory
                </th>
                <th className="border border-gray-300 px-4 py-2">Theme</th>
                <th className="border border-gray-300 px-4 py-2 w-[20%]">
                  Service Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Offer Price</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="text-center cursor-pointer">
                  <td className="border border-gray-300 py-2 w-[10%]">
                    {service.categoryId?.category || "N/A"}
                  </td>
                  <td className="border border-gray-300 py-2 w-[15%]">
                    {service.subCategoryId?.subCategory || "N/A"}
                  </td>
                  <td className="border border-gray-300 py-2 w-[15%]">
                    {service.subSubCategoryId?.subSubCategory || "N/A"}
                  </td>
                  <td className="border border-gray-300 py-2 w-[15%]">
                    {service.themeId?.theme || "N/A"}
                  </td>
                  <td className="border border-gray-300 py-2 w-[20%]">
                    {service.serviceName}
                  </td>
                  <td className="border border-gray-300 py-2 w-[10%]">
                    Rs. {service.offerPrice}
                  </td>
                  <td className="border border-gray-300 py-2 w-[10%]">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-600 hover:text-gray-800 transition"
                        onClick={() =>
                          navigate(`/service/view-details/${service._id}`)
                        }
                      >
                        <IoEyeSharp size={18} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 transition"
                        onClick={() =>
                          navigate(`/service/editService/${service._id}`)
                        }
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={() => handleDelete(service._id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Reusable Pagination Component */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default ServiceList;