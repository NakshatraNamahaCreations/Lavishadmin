// import React, { useState, useEffect } from "react";
// import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { getAuthAxios, getUploadAxios, getAuthToken, getAxios } from "../../utils/api";
// import axios from "axios";
// import Pagination from "../Pagination";

// const AddTheme = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("");
//   const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
//   const [theme, setTheme] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [subSubCategories, setSubSubCategories] = useState([]);
//   const [themes, setThemes] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [addloading, setAddLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [currentThemeId, setCurrentThemeId] = useState(null);
//   const [searchVal, setSearchVal] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setAddLoading(true);
//     setError("");

//     // Validate required fields
//     if (
//       !selectedCategory ||
//       !selectedSubCategory ||
//       !selectedSubSubCategory ||
//       !theme.trim() ||
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

//       const obj = {
//         theme: theme.trim(),
//         subSubCategory: selectedSubSubCategory,
//         image,
//       };

//       if (editMode && currentThemeId) {
//         await uploadAxios.put(`/themes/update/${currentThemeId}`, obj);
//       } else {
//         await uploadAxios.post("/themes/create", obj);
//       }

//       resetForm();
//       await fetchThemes();
//     } catch (error) {
//       console.error("Error while creating/updating Theme:", err);
//       setError(err?.response?.data?.message || "Something went wrong!");
//     } finally {
//       setAddLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedCategory("");
//     setSelectedSubCategory("");
//     setSelectedSubSubCategory("");
//     setTheme("");
//     setImage(null);
//     setImagePreview("");
//     setEditMode(false);
//     setCurrentThemeId(null);
//   };

//   const handleEdit = (item) => {
//     setEditMode(true);
//     setCurrentThemeId(item?._id);
//     setSelectedCategory(item?.subSubCategory?.subCategory?.category?._id);
//     setSelectedSubCategory(item?.subSubCategory?.subCategory?._id);
//     setSelectedSubSubCategory(item?.subSubCategory?._id);
//     setTheme(item.theme);
//     setImagePreview(`http://localhost:5000/images/${item.image}`);
//     setImage(item.image);
//   };

//   const handleDelete = async (id) => {
//     const uploadAxios = getUploadAxios();
//     try {
//       await uploadAxios.delete(`/themes/delete/${id}`);
//       fetchThemes();
//     } catch (error) {
//       setError(err?.response?.data?.message || "Failed to delete Theme");
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

//   const fetchThemes = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await getAxios().get("https://api.lavisheventzz.com/api/themes", {
//         params: {
//           page: currentPage,       // e.g. 1, 2, 3...
//           limit: 5,               // Adjust as needed
//           search: searchVal.trim() // Search input value
//         },
//       });

//       setThemes(res.data.data); // Set the returned themes
//       setTotalPages(res.data.pagination.totalPages || 1);
//       setCurrentPage(res.data.pagination.currentPage || 1);
//     } catch (error) {
//       console.error("Error fetching themes:", error);
//       setError("Failed to load themes");
//     } finally {
//       setLoading(false);
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

//   const fetchSubSubcategoriesBySubCategory = async () => {
//     if (!selectedSubCategory) return;
//     try {
//       const res = await getAuthAxios().get(
//         `subsubcategories/subcategory/${selectedSubCategory}`
//       );
//       setSubSubCategories(res.data.data);
//     } catch (err) {
//       console.error("error", err);
//       setError("Failed to load subcategories");
//     }
//   };

  
//   const handleSearch = (e) => {
//     setSearchVal(e.target.value);
//     setCurrentPage(1);
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchThemes();
//   }, []);

//   useEffect(() => {
//     fetchThemes();
//   }, [currentPage]);

//   useEffect(() => {
//     fetchSubcategoriesByCategory();
//   }, [selectedCategory]);

//   useEffect(() => {
//     fetchSubSubcategoriesBySubCategory();
//   }, [selectedSubCategory]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 lg:p-2">
//       <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           {editMode ? "Update Theme" : "Add New Theme"}
//         </h2>

//         {error && <p className="text-red-600 mb-3">{error}</p>}

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

//             <select
//               value={selectedSubSubCategory}
//               onChange={(e) =>
//                 setSelectedSubSubCategory(toTitleCase(e.target.value))
//               }
//               disabled={!selectedSubCategory}
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select Sub Sub Category</option>
//               {subSubCategories.map((subsubcat) => (
//                 <option key={subsubcat._id} value={subsubcat._id}>
//                   {subsubcat.subSubCategory}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               value={theme}
//               onChange={(e) => setTheme(toTitleCase(e.target.value))}
//               placeholder="Enter Theme name"
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             />

//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="px-4 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           {imagePreview && (
//             <div className="mb-4">
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="w-32 h-32 object-cover rounded-md"
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
//           onClick={fetchThemes}
//           >
//             Search
//           </button>
//         </div>

//         {/* Display Sub-Sub Categories in Table */}
//         <div className="mt-10">
//           <div className="overflow-auto">
//             <table className="min-w-full border-collapse border border-gray-300 text-sm">
//               <thead className="bg-gray-200">
//                 <tr>
//                   <th className="border px-4 py-2 text-left">Category</th>
//                   <th className="border px-4 py-2 text-left">Sub Category</th>
//                   <th className="border px-4 py-2 text-left">
//                     Sub-Sub Category
//                   </th>
//                   <th className="border px-4 py-2 text-left">Theme</th>
//                   <th className="border px-4 py-2 text-left">Image</th>
//                   <th className="border px-4 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {themes.length > 0 ? (
//                   themes.map((item) => {
//                     const { subSubCategory } = item || {};
//                     const { subCategory } = subSubCategory || {};
//                     const { category } = subCategory || {};

//                     return (
//                       <tr key={item._id} className="bg-white hover:bg-gray-50">
//                         <td className="border px-4 py-2">
//                           {category?.category}
//                         </td>
//                         <td className="border px-4 py-2">
//                           {subCategory?.subCategory}
//                         </td>
//                         <td className="border px-4 py-2">
//                           {subSubCategory?.subSubCategory}
//                         </td>
//                         <td className="border px-4 py-2">{item?.theme}</td>
//                         <td className="border px-4 py-2">
//                           <img
//                             src={`http://localhost:5000/images/${item.image}`}
//                             alt="Preview"
//                             className="w-16 h-16 object-cover rounded"
//                           />
//                         </td>
//                         <td className="border border-gray-300 px-4 py-2 text-center">
//                           <div className="flex justify-center gap-2">
//                             <button
//                               onClick={() => handleEdit(item)}
//                               className="text-gray-600 hover:text-gray-800 transition"
//                             >
//                               <FiEdit size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(item._id)}
//                               className="text-red-600 hover:text-red-800 transition"
//                             >
//                               <FiTrash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="5" className="text-center py-4 text-gray-500">
//                       No Themes found.
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

// export default AddTheme;


// Replace file input with image URL handling like in AddSubSubCategory

import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getAuthAxios, getAxios } from "../../utils/api";
import Pagination from "../Pagination";

const AddTheme = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [theme, setTheme] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const toTitleCase = (str) => str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const authAxios = getAuthAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setError("");

    if (!selectedCategory || !selectedSubCategory || !selectedSubSubCategory || !theme.trim() || !image.trim()) {
      alert("Please fill all fields and upload an image URL.");
      setAddLoading(false);
      return;
    }

    try {
      const payload = {
        theme: theme.trim(),
        subSubCategory: selectedSubSubCategory,
        image: image.trim()
      };

      if (editMode && currentThemeId) {
        await authAxios.put(`/themes/update/${currentThemeId}`, payload);
      } else {
        await authAxios.post("/themes/create", payload);
      }

      resetForm();
      await fetchThemes();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setAddLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    setTheme("");
    setImage("");
    setImagePreview("");
    setEditMode(false);
    setCurrentThemeId(null);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentThemeId(item._id);
    setSelectedCategory(item?.subSubCategory?.subCategory?.category?._id);
    setSelectedSubCategory(item?.subSubCategory?.subCategory?._id);
    setSelectedSubSubCategory(item?.subSubCategory?._id);
    setTheme(item.theme);
    setImage(item.image);
    setImagePreview(item.image);
  };

  const handleDelete = async (id) => {
    try {
      await authAxios.delete(`/themes/delete/${id}`);
      fetchThemes();
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete Theme");
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

  const fetchThemes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAxios().get("/themes", {
        params: {
          page: currentPage,
          limit: 5,
          search: searchVal.trim()
        }
      });
      setThemes(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
      setCurrentPage(res.data.pagination.currentPage || 1);
    } catch (err) {
      setError("Failed to load themes");
    } finally {
      setLoading(false);
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

  const fetchSubSubcategoriesBySubCategory = async () => {
    if (!selectedSubCategory) return;
    try {
      const res = await authAxios.get(`/subsubcategories/subcategory/${selectedSubCategory}`);
      setSubSubCategories(res.data.data);
    } catch (err) {
      setError("Failed to load sub-subcategories");
    }
  };

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchCategories();
    fetchThemes();
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [currentPage]);

  useEffect(() => {
    fetchSubcategoriesByCategory();
  }, [selectedCategory]);

  useEffect(() => {
    fetchSubSubcategoriesBySubCategory();
  }, [selectedSubCategory]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-2">
      <div className="bg-white rounded-lg shadow-md p-6 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editMode ? "Update Theme" : "Add New Theme"}
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.category}</option>
              ))}
            </select>

            <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} disabled={!selectedCategory} className="px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select Sub Category</option>
              {subCategories.map((subcat) => (
                <option key={subcat._id} value={subcat._id}>{subcat.subCategory}</option>
              ))}
            </select>

            <select value={selectedSubSubCategory} onChange={(e) => setSelectedSubSubCategory(e.target.value)} disabled={!selectedSubCategory} className="px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select Sub Sub Category</option>
              {subSubCategories.map((item) => (
                <option key={item._id} value={item._id}>{item.subSubCategory}</option>
              ))}
            </select>

            <input type="text" value={theme} onChange={(e) => setTheme(toTitleCase(e.target.value))} placeholder="Enter Theme name" className="px-4 py-2 border border-gray-300 rounded-md" />

            <input type="text" value={image} onChange={(e) => { setImage(e.target.value); setImagePreview(e.target.value); }} placeholder="Enter Image URL" className="px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}

          <div className="text-end">
            <button type="submit" className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md">
              {addloading ? "Processing..." : editMode ? "Update" : "Add"}
            </button>
            {editMode && (
              <button onClick={resetForm} type="button" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 ml-3 rounded-md">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="my-4 flex gap-2">
          <input value={searchVal} onChange={handleSearch} placeholder="Search" className="px-4 py-2 border-2 rounded-md w-[30%]" />
          <button onClick={fetchThemes} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Search</button>
        </div>

        <div className="mt-10 overflow-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Category</th>
                <th className="border px-4 py-2 text-left">Sub Category</th>
                <th className="border px-4 py-2 text-left">Sub-Sub Category</th>
                <th className="border px-4 py-2 text-left">Theme</th>
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.length > 0 ? (
                themes.map((item) => {
                  const sub = item?.subSubCategory?.subCategory;
                  const cat = sub?.category;
                  return (
                    <tr key={item._id} className="bg-white hover:bg-gray-50">
                      <td className="border px-4 py-2">{cat?.category}</td>
                      <td className="border px-4 py-2">{sub?.subCategory}</td>
                      <td className="border px-4 py-2">{item?.subSubCategory?.subSubCategory}</td>
                      <td className="border px-4 py-2">{item?.theme}</td>
                      <td className="border px-4 py-2">
                        <img src={item?.image} alt="Preview" className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(item)} className="text-gray-600 hover:text-gray-800"><FiEdit size={16} /></button>
                          <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No Themes found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(newPage) => setCurrentPage(newPage)} />
      </div>
    </div>
  );
};

export default AddTheme;
