import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../Pagination";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../../utils/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Triggered search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/blog`, {
        params: {
          search: searchQuery,
          page: currentPage,
          limit: 10,
        },
      });
      setBlogs(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch blogs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchVal.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/blog/${id}`);
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog List</h2>
        <Link
          to="/blogs/add-blog"
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
        >
          Add Blog
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="px-4 py-2 border rounded-md w-[250px]"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-600">No blogs found.</p>
        ) : (
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Sl. No</th>
                <th className="p-3 border text-left">Title</th>
                <th className="p-3 border text-left">Image</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={blog._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 border">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="p-3 border">{blog.title}</td>
                  <td className="p-3 border">
                    <img
                      src={blog.bannerImage}
                      alt={blog.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 border">
                    {blog.description.replace(/<[^>]+>/g, "").slice(0, 80)}...
                  </td>
                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/blogs/edit-blog/${blog._id}`)}
                        className="text-gray-600 hover:text-gray-800 transition"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-800 transition"
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
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />
    </div>
  );
};

export default Blogs;
