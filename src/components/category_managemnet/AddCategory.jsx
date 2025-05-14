import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import axios from "axios";
import { getAuthAxios, getAuthToken } from "../../utils/api";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!category.trim()) {
      alert("Category name cannot be empty");
      setLoading(false);
      return;
    }

    try {
      const authAxios = getAuthAxios();

      if (!getAuthToken()) {
        setError("You must be logged in to add categories");
        setLoading(false);
        return;
      }

      const response = await authAxios.post("/categories/create", { category });

      setCategory("");
      fetchCategories();
    } catch (error) {
      console.log("err", error);
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/categories/");
      if (res.status !== 200) {
        throw new Error("something went wrong");
      }
      setCategories(res.data.data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const authAxios = getAuthAxios();

      if (!getAuthToken()) {
        setError("You must be logged in to delete categories");
        return;
      }

      const response = await authAxios.delete(`/categories/delete/${id}`);
      fetchCategories();
    } catch (error) {
      console.log("err", error.message);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen shadow-lg  rounded-lg bg-white p-6 lg:p-2">
      <div className="max-w-sm rounded-lg p-3 mb-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Category
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleAddCategory}>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(toTitleCase(e.target.value));
              }}
              placeholder="Enter category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className={` bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-all cursor-pointer`}
            >
              {loading ? "Adding..." : "Add "}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Categories
          </h3>
          <ul className="space-y-3">
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <li
                  key={cat._id}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-md shadow-sm"
                >
                  <span className="text-gray-800 font-medium">
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-4 ml-4">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center">No Category Found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
