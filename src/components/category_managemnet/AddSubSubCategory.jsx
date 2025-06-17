import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getAuthAxios } from "../../utils/api";
import Pagination from "../Pagination";

const AddSubSubCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [subSubCategoryName, setSubSubCategoryName] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSubSubCategoryId, setCurrentSubSubCategoryId] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 10;

  const authAxios = getAuthAxios()

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAddLoading(true);

    if (!selectedCategory || !selectedSubCategory || !subSubCategoryName.trim() || !image.trim()) {
      alert("Please fill all fields and upload an image URL.");
      setAddLoading(false);
      return;
    }

    const authAxios = getAuthAxios()

    try {
      const payload = {
        subSubCategory: subSubCategoryName.trim(),
        subCategory: selectedSubCategory,
        image: image.trim()
      };

      if (editMode && currentSubSubCategoryId) {
        await authAxios.put(`/subsubcategories/update/${currentSubSubCategoryId}`, payload);
      } else {
        await authAxios.post("/subsubcategories/create", payload);
      }

      resetForm();
      await fetchSubSubCategories();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setAddLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSubSubCategoryName("");
    setImage("");
    setImagePreview("");
    setEditMode(false);
    setCurrentSubSubCategoryId(null);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentSubSubCategoryId(item._id);
    setSelectedCategory(item.subCategory.category._id);
    setSelectedSubCategory(item.subCategory._id);
    setSubSubCategoryName(item.subSubCategory);
    setImage(item.image);
    setImagePreview(item.image);
  };

  const handleDelete = async (id) => {

    try {
      await authAxios.delete(`/subsubcategories/delete/${id}`);
      fetchSubSubCategories();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete sub-sub-category");
    }
  };

  const fetchCategories = async () => {

    try {
      const res = await authAxios.get("/categories/");
      setCategories(res.data.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const fetchSubcategoriesByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const res = await authAxios.get(`/subcategories/category/${selectedCategory}`);
      setSubCategories(res.data.data);
    } catch (err) {
      setError("Failed to load subcategories");
    }
  };

  const fetchSubSubCategories = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get("/subsubcategories", {
        params: { page: currentPage, limit, search: searchVal },
      });
      setSubSubCategories(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      setError("Failed to load sub-subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubSubCategories();
  }, [currentPage]);

  useEffect(() => {
    fetchSubcategoriesByCategory();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-2">
      <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editMode ? "Update Sub-Sub Category" : "Add New Sub-Sub Category"}
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.category}</option>
              ))}
            </select>

            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              disabled={!selectedCategory}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>{subcat.subCategory}</option>
              ))}
            </select>

            <input
              type="text"
              value={subSubCategoryName}
              onChange={(e) => setSubSubCategoryName(toTitleCase(e.target.value))}
              placeholder="Enter sub-sub-category name"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />

            <input
              type="text"
              value={image}
              placeholder="Enter Image URL"
              onChange={(e) => {
                setImage(e.target.value);
                setImagePreview(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Preview" className="w-36 h-32 object-cover rounded-md" />
            </div>
          )}

          <div className="text-end">
            <button
              className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
              type="submit"
            >
              {addloading ? "Processing..." : editMode ? "Update" : "Add"}
            </button>
            {editMode && (
              <button
                onClick={resetForm}
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 ml-3 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="my-4 flex gap-2">
          <input
            placeholder="Search"
            className="px-4 py-2 border-2 rounded-md w-[30%]"
            value={searchVal}
            onChange={handleSearch}
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={fetchSubSubCategories}
          >
            Search
          </button>
        </div>

        <div className="mt-10 overflow-auto">
          {loading ? (
            <div className="flex justify-center items-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">Loading...</span>
            </div>
          ) : subSubCategories.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">Category</th>
                  <th className="border px-4 py-2 text-left">Sub Category</th>
                  <th className="border px-4 py-2 text-left">Sub-Sub Category</th>
                  <th className="border px-4 py-2 text-left">Image</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subSubCategories.map((item) => (
                  <tr key={item._id} className="bg-white hover:bg-gray-50">
                    <td className="border px-4 py-2">{item?.subCategory?.category?.category}</td>
                    <td className="border px-4 py-2">{item?.subCategory?.subCategory}</td>
                    <td className="border px-4 py-2">{item?.subSubCategory}</td>
                    <td className="border px-4 py-2">
                      <img src={item?.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="text-gray-600 hover:text-gray-800 transition">
                          <FiEdit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 transition">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No sub-sub categories found.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
};

export default AddSubSubCategory;
