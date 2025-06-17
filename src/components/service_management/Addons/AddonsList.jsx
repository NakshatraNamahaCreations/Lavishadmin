import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getAuthAxios, getAxios } from "../../../utils/api";
import { IoEyeSharp } from "react-icons/io5";
import Pagination from "../../Pagination";

const AddonsList = () => {
  const navigate = useNavigate();

  const [addonsList, setAddonsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 10;

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };

  const fetchAddons = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAxios().get("/addons", {
        params: { page: currentPage, limit, search: searchVal },
      });

      const { data, pagination } = response.data;

      setAddonsList(data || []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching addons:", err);
      setError("Failed to fetch addons.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addonId) => {
    const authAxios = getAuthAxios();
    if (window.confirm("Are you sure you want to delete this addon?")) {
      try {
        await authAxios.delete(`/addons/delete/${addonId}`);
        fetchAddons();
      } catch (err) {
        console.error("Error deleting addon:", err);
        alert("Failed to delete addon. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchAddons();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="mx-auto bg-white rounded-lg pt-4 px-3 flex justify-between items-center">
          <div className="my-4 flex gap-2">
            <input
              placeholder="Search by sub category or addon name"
              className="px-4 py-2 border-2 rounded-md w-[400px]"
              value={searchVal}
              onChange={handleSearch}
            />
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              onClick={fetchAddons}
            >
              Search
            </button>
          </div>
          <button
            onClick={() => navigate("/addons/add-addons")}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Add
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Addons List</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : addonsList.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-center">Subcategory</th>
                <th className="border px-4 py-2 text-center">Addon Name</th>
                <th className="border px-4 py-2 text-center">Image</th>
                <th className="border px-4 py-2 text-center">Price</th>
                <th className="border px-4 py-2 text-center">Description</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {addonsList.map((addon) => (
                <tr key={addon._id} className="text-center">
                  <td className="border px-4 py-2">{addon.subCategory}</td>
                  <td className="border px-4 py-2">{addon.addonsName}</td>
                  <td className="border px-4 py-2">
                    <img src={`${addon.image}`} className="w-20 h-20" />
                  </td>
                  <td className="border px-4 py-2">{addon.price}</td>
                  <td className="border px-4 py-2" dangerouslySetInnerHTML={{ __html: addon.addonsDescription }} />
                  <td>
                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          className="text-blue-600 hover:text-gray-800 transition"
                          onClick={() =>
                            navigate(`/addons/view-details/${addon._id}`)
                          }
                        >
                          <IoEyeSharp size={18} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/addons/editAddons/${addon._id}`)
                          }
                          className="text-gray-600 hover:text-gray-800 transition"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(addon._id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No addons found.</p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
};

export default AddonsList;
