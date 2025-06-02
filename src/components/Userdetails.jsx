
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "./Pagination";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { IoEyeSharp } from "react-icons/io5";
import { getAuthAxios, getAxios } from "../utils/api";

const Userdetails = () => {
  const [data, setData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const limit = 5;
  const navigate = useNavigate();
  const authAxios = getAuthAxios()

  const handleRowClick = (userid) => {
    navigate(`/users/${userid}`);
  };


  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      await authAxios.delete(`/admin/users/user/${id}`);
      fetchData();
    }
  };

  const fectchbySearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAxios().get(
        `/admin/users/paginated`,
        {
          params: {
            search: searchVal,
          },
        }
      );
      setData(response.data.data.users);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAxios().get(
        `/admin/users/paginated`,
        {
          params: {
            page: currentPage,
            limit: limit,
          },
        }
      );
      const { users } = response.data.data;
      setData(users);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="md:w-auto w-screen">
      <h2 className="text-2xl font-bold mb-4">User Data Table</h2>
      <div>
        <div className="my-4 flex gap-2">
          <input
            placeholder="Search"
            className="px-4 py-2 border-2 rounded-md w-[30%]"
            value={searchVal}
            onChange={handleSearch}
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={fectchbySearch}
          >
            Search
          </button>
        </div>
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left">SI No.</th>
                <th className="px-4 py-2 text-left">First Name</th>
                <th className="px-4 py-2 text-left">Last Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Mobile No</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">Pincode</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={item._id}
                  onClick={() => handleRowClick(item._id)}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-bold">{idx + 1}</td>
                  <td className="px-4 py-2">{item.firstName || "-"}</td>
                  <td className="px-4 py-2">{item.lastName || "-"}</td>
                  <td className="px-4 py-2">{item.email || "-"}</td>
                  <td className="px-4 py-2">{item.mobile || "-"}</td>
                  <td className="px-4 py-2">{item.city || "-"}</td>
                  <td className="px-4 py-2">{item.pincode || "-"}</td>
                  <td className="border border-gray-300 py-2 w-[10%]">
                    <div className="flex justify-center gap-2">
                      <button
                        className="text-blue-600 hover:text-gray-800 transition"
                        onClick={() => handleRowClick(item._id)}
                      >
                        <IoEyeSharp size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition"
                        onClick={(e) => handleDelete(item._id, e)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Reusable Pagination Component */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
};

export default Userdetails;
