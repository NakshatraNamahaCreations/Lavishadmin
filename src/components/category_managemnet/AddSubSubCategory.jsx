// import React, { useState, useEffect } from "react";
// import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { getAuthAxios, getUploadAxios, getAuthToken } from "../../utils/api";
// import Pagination from "../Pagination";

// const AddSubSubCategory = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("");
//   const [subSubCategoryName, setSubSubCategoryName] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [subSubCategories, setSubSubCategories] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [addloading, setAddLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [currentSubSubCategoryId, setCurrentSubSubCategoryId] = useState(null);
//   const [searchVal, setSearchVal] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   const limit = 5;

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchVal(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setAddLoading(true);

//     // Validate required fields
//     if (
//       !selectedCategory ||
//       !selectedSubCategory ||
//       !subSubCategoryName.trim() ||
//       !image
//     ) {
//       alert("Please fill all fields and upload an image.");
//       setAddLoading(false);
//       return;
//     }

//     try {
//       const token = getAuthToken();
//       const uploadAxios = getUploadAxios();

//       if (!token) {
//         setError("Unauthorized! Please login first.");
//         setAddLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("subSubCategory", subSubCategoryName.trim());
//       formData.append("subCategory", selectedSubCategory);
//       formData.append("image", image);

//       // Determine whether to create or update
//       if (editMode && currentSubSubCategoryId) {
//         await uploadAxios.put(
//           `/subsubcategories/update/${currentSubSubCategoryId}`,
//           formData
//         );
//       } else {
//         await uploadAxios.post("/subsubcategories/create", formData);
//       }

//       // Reset the form
//       resetForm();
//       // Fetch the updated list of sub-subcategories
//       await fetchSubSubCategories();
//     } catch (err) {
//       console.error("Error while creating/updating sub-sub-category:", err);
//       setError(err?.response?.data?.message || "Something went wrong!");
//     } finally {
//       setAddLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedCategory("");
//     setSelectedSubCategory("");
//     setSubSubCategoryName("");
//     setImage(null);
//     setImagePreview("");
//     setEditMode(false);
//     setCurrentSubSubCategoryId(null);
//   };

//   const handleEdit = (item) => {
//     setEditMode(true);
//     setCurrentSubSubCategoryId(item._id);
//     setSelectedCategory(item.subCategory.category._id);
//     setSelectedSubCategory(item.subCategory._id);
//     setSubSubCategoryName(item.subSubCategory);
//     setImagePreview(`http://localhost:5000/images/${item.image}`);
//     setImage(item.image);
//   };

//   const handleDelete = async (id) => {
//     if (!getAuthToken()) {
//       setError("Unauthorized! Please login first.");
//       return;
//     }
//     try {
//       await getUploadAxios().delete(`/subsubcategories/delete/${id}`);
//       fetchSubSubCategories();
//     } catch (err) {
//       setError(
//         err?.response?.data?.message || "Failed to delete sub-sub-category"
//       );
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await getAuthAxios().get("/categories/");
//       setCategories(res.data.data);
//     } catch (err) {
//       setError("Failed to load categories");
//     }
//   };

//   const fetchSubcategoriesByCategory = async () => {
//     if (!selectedCategory) return;
//     try {
//       const res = await getAuthAxios().get(
//         `/subcategories/category/${selectedCategory}`
//       );
//       setSubCategories(res.data.data);
//     } catch (err) {
//       setError("Failed to load subcategories");
//     }
//   };

//   const fetchSubSubCategories = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await getAuthAxios().get("/subsubcategories", {
//         params: { page: currentPage, limit, search: searchVal },
//       });

//       setSubSubCategories(res.data.data);
//       setTotalPages(res.data.pagination.totalPages || 1);
//       setCurrentPage(res.data.pagination.currentPage || 1);
//     } catch (err) {
//       console.error("Error fetching sub-subcategories:", err);
//       setError("Failed to load sub-subcategories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchSubSubCategories();
//   }, [currentPage]);

//   useEffect(() => {
//     fetchSubcategoriesByCategory();
//   }, [selectedCategory]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 lg:p-2">
//       <div className="bg-white rounded-lg shadow-md p-6  mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           {editMode ? "Update Sub-Sub Category" : "Add New Sub-Sub Category"}
//         </h2>


//         {error && <p className="text-red-600 mb-3">{error}</p>}
//         {/* {loading && <p className="text-blue-600 mb-3">Processing...</p>} */}

//         <form encType="multipart/form-data" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(toTitleCase(e.target.value))}
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.category}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedSubCategory}
//               onChange={(e) =>
//                 setSelectedSubCategory(toTitleCase(e.target.value))
//               }
//               disabled={!selectedCategory}
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Sub Category</option>
//               {subCategories.map((subcat) => (
//                 <option key={subcat._id} value={subcat._id}>
//                   {subcat.subCategory}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               value={subSubCategoryName}
//               onChange={(e) =>
//                 setSubSubCategoryName(toTitleCase(e.target.value))
//               }
//               placeholder="Enter sub-sub-category name"
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             />

//             <input
//               type="text"
//               value={image}
//               placeholder="Enter Image URL"
//               onChange={(e) => setImage(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           {imagePreview && (
//             <div className="mb-4">
//               <img
//                 src={image}
//                 alt="Preview"
//                 className="w-36 h-32 object-cover rounded-md"
//               />
//             </div>
//           )}

//           <div className="text-end">
//             <button
//               className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
//               type="submit"
//             >
//               {addloading ? "Processing..." : editMode ? "Update" : "Add"}
//             </button>
//             {editMode && (
//               <button
//                 onClick={resetForm}
//                 type="button"
//                 className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 ml-3 rounded-md"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>


//         <div className="my-4 flex gap-2">
//           <input
//             placeholder="Search"
//             className="px-4 py-2 border-2 rounded-md w-[30%]"
//             value={searchVal}
//             onChange={handleSearch}
//           />
//           <button
//             className="bg-yellow-500 text-white px-4 py-2 rounded-md"
//             onClick={fetchSubSubCategories}
//           >
//             Search
//           </button>
//         </div>
//         {/* Display Sub-Sub Categories in Table */}
//         <div className="mt-10">
//           {/* <h3 className="text-xl font-semibold mb-4 text-gray-700">Sub-Sub Categories</h3> */}
//           <div className="overflow-auto">
//             <table className="min-w-full border-collapse border border-gray-300 text-sm">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border px-4 py-2 text-left">Category</th>
//                   <th className="border px-4 py-2 text-left">Sub Category</th>
//                   <th className="border px-4 py-2 text-left">
//                     Sub-Sub Category
//                   </th>
//                   <th className="border px-4 py-2 text-left">Image</th>
//                   <th className="border px-4 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subSubCategories.length > 0 ? (
//                   subSubCategories.map((item) => (
//                     <tr key={item._id} className="bg-white hover:bg-gray-50">
//                       <td className="border px-4 py-2">
//                         {item?.subCategory?.category?.category}
//                       </td>
//                       <td className="border px-4 py-2">
//                         {item?.subCategory?.subCategory}
//                       </td>
//                       <td className="border px-4 py-2">
//                         {item?.subSubCategory}
//                       </td>
//                       <td className="border px-4 py-2">
//                         <img
//                           src={`${item?.image}`}
//                           alt="Preview"
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                       </td>
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                         <div className="flex justify-center gap-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="text-gray-600 hover:text-gray-800 transition"
//                           >
//                             <FiEdit size={16} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id)}
//                             className="text-red-600 hover:text-red-800 transition"
//                           >
//                             <FiTrash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-4 text-gray-500">
//                       No sub-sub categories found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={(newPage) => setCurrentPage(newPage)}
//         />
//       </div>
//     </div>
//   );
// };

// export default AddSubSubCategory;


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

  const limit = 5;

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
      setCurrentPage(res.data.pagination.currentPage || 1);
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
              {subSubCategories.length > 0 ? (
                subSubCategories.map((item) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No sub-sub categories found.</td>
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
    </div>
  );
};

export default AddSubSubCategory;
