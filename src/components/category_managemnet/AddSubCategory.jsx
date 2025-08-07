// import React, { useEffect, useState } from "react";
// import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { getAuthAxios, getAuthToken, getAxios } from "../../utils/api";
// import axios from "axios";

// const AddSubCategory = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [subCategory, setSubCategory] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [filteredData, setFilteredData] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

//   // Add or update subcategory
//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!selectedCategory || !subCategory.trim()) {
//       alert("All fields should be filled");
//       setLoading(false);
//       return;
//     }

//     try {
//       const authAxios = getAuthAxios();
//       const token = getAuthToken();

//       if (!token) {
//         setError("You must be logged in to manage sub categories");
//         setLoading(false);
//         return;
//       }

//       const obj = { category: selectedCategory, subCategory };

//       if (editMode && currentSubCategoryId) {
//         await authAxios.put(
//           `/subcategories/update/${currentSubCategoryId}`,
//           obj
//         );
//       } else {
//         await authAxios.post("/subcategories/create", obj);
//       }

//       resetForm();
//       fetchSubcategory();
//     } catch (error) {
//       setError(
//         error?.response?.data?.message ||
//           error.message ||
//           "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedCategory("");
//     setSubCategory("");
//     setEditMode(false);
//     setCurrentSubCategoryId(null);
//   };

//   const handleEdit = (item) => {
//     setSelectedCategory(item.category._id);
//     setSubCategory(item.subCategory);
//     setEditMode(true);
//     setCurrentSubCategoryId(item._id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleCancelEdit = () => {
//     resetForm();
//   };

//   const fetchCategories = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await getAxios().get("/categories/");
//       setCategories(res.data.data);
//     } catch (error) {
//       setError(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSubcategory = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await getAxios().get("/subcategories/");
//       setData(res.data.data);
//       setFilteredData(res.data.data);
//     } catch (error) {
//       setError(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const authAxios = getAuthAxios();

//       if (!getAuthToken()) {
//         setError("You must be logged in to delete sub-categories");
//         return;
//       }

//       await authAxios.delete(`/subcategories/delete/${id}`);
//       fetchSubcategory();
//     } catch (error) {
//       setError("Something went wrong while deleting");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchSubcategory();
//   }, []);

//   useEffect(() => {
//     if (filterCategory === "All") {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter(
//         (item) => item.category?._id === filterCategory
//       );
//       setFilteredData(filtered);
//     }
//   }, [filterCategory, data]);

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 lg:p-1">
//       <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">
//           {editMode ? "Update Sub Category" : "Add New Sub Category"}
//         </h2>
//         {error && <p className="text-red-600 mb-2">{error}</p>}

//         <form onSubmit={handleFormSubmit}>
//           <div className="max-w-xl flex flex-col sm:flex-row gap-4 mb-8">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(toTitleCase(e.target.value))}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.category}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               value={subCategory}
//               onChange={(e) => setSubCategory(toTitleCase(e.target.value))}
//               placeholder="Enter sub-category name"
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className={`bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-all`}
//               >
//                 {loading ? "Processing..." : editMode ? "Update" : "Add"}
//               </button>

//               {editMode && (
//                 <button
//                   type="button"
//                   onClick={handleCancelEdit}
//                   className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-all"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </div>
//         </form>

//         {/* Filter Dropdown */}
//         <div className="flex justify-end mb-4">
//           <select
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(toTitleCase(e.target.value))}
//             className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="All">All Categories</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.category}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Subcategories Table */}
//         <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
//           {loading ? (
//             <div className="flex justify-center items-center my-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <span className="ml-2 text-blue-600">Loading...</span>
//             </div>
//           ) : filteredData.length > 0 ? (
//             <table className="w-full border-collapse border border-gray-300 text-sm">
//               <thead className=" top-0 bg-gray-200 z-10">
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2 text-left">
//                     Category
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2 text-left">
//                     Sub Category
//                   </th>
//                   <th className="border border-gray-300 px-4 py-2 text-center">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.map((item) => (
//                   <tr
//                     className={`${
//                       currentSubCategoryId === item._id
//                         ? "bg-blue-50"
//                         : "bg-white"
//                     } hover:bg-gray-50`}
//                     key={item._id}
//                   >
//                     <td className="border border-gray-300 px-4 py-2">
//                       {item?.category?.category}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2">
//                       {item?.subCategory}
//                     </td>
//                     <td className="border border-gray-300 px-4 py-2 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleEdit(item)}
//                           className="text-gray-600 hover:text-gray-800 transition"
//                         >
//                           <FiEdit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(item._id)}
//                           className="text-red-600 hover:text-red-800 transition"
//                         >
//                           <FiTrash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <p className="text-lg">No sub-categories found.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddSubCategory;
import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getAuthAxios, getAuthToken, getAxios } from "../../utils/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddSubCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [caption, setCaption] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSubCategoryId, setCurrentSubCategoryId] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!selectedCategory || !subCategory.trim()) {
      alert("Category and Sub-category name are required.");
      setLoading(false);
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("You must be logged in to manage sub categories");
      setLoading(false);
      return;
    }

    const authAxios = getAuthAxios();

    const cleanedFaqs = faqs
      .filter((faq) => faq.question.trim() && faq.answer.trim())
      .map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }));

    const obj = {
      category: selectedCategory,
      subCategory,
      caption: caption?.trim(),
      metaTitle: metaTitle?.trim(),
      metaDescription: metaDescription?.trim(),
      keywords: keywords?.trim(),
      faqs: cleanedFaqs.length > 0 ? cleanedFaqs : [],
    };

    try {
      if (editMode && currentSubCategoryId) {
        await authAxios.put(
          `/subcategories/update/${currentSubCategoryId}`,
          obj
        );
      } else {
        await authAxios.post("/subcategories/create", obj);
      }
      resetForm();
      fetchSubcategory();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSubCategory("");
    setMetaTitle("");
    setMetaDescription("");
    setCaption("");
    setKeywords("");
    setFaqs([{ question: "", answer: "" }]);
    setEditMode(false);
    setCurrentSubCategoryId(null);
  };

  const handleEdit = (item) => {
    setSelectedCategory(item.category?._id);
    setSubCategory(item.subCategory);
    setMetaTitle(item.metaTitle || "");
    setMetaDescription(item.metaDescription || "");
    setCaption(item.caption || "");
    setKeywords(item.keywords || "");
    setFaqs(
      Array.isArray(item.faqs) ? item.faqs : [{ question: "", answer: "" }]
    );
    setEditMode(true);
    setCurrentSubCategoryId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => resetForm();

  const fetchCategories = async () => {
    try {
      const res = await getAxios().get("/categories/");
      setCategories(res.data.data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  const fetchSubcategory = async () => {
    try {
      const res = await getAxios().get("/subcategories/");
      setData(res.data.data);
      setFilteredData(res.data.data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub-category?"
    );
    if (!confirmDelete) return;

    try {
      const authAxios = getAuthAxios();
      await authAxios.delete(`/subcategories/delete/${id}`);
      fetchSubcategory();
    } catch (error) {
      setError("Something went wrong while deleting");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategory();
  }, []);

  useEffect(() => {
    if (filterCategory === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((item) => item.category?._id === filterCategory)
      );
    }
  }, [filterCategory, data]);

  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);

  const removeFaq = (index) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-1">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editMode ? "Update Sub Category" : "Add New Sub Category"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(toTitleCase(e.target.value))}
              placeholder="Enter sub-category name"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />

            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Meta Title"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />

            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Meta Description"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />

            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Keywords"
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label className="font-semibold block mb-2">Caption</label>
            <CKEditor
              editor={ClassicEditor}
              data={caption}
              onChange={(event, editor) => setCaption(editor.getData())}
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">FAQs</label>
            {faqs.map((faq, index) => (
              <div key={index} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                />
                <div className="flex justify-center items-center gap-10">
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) =>
                      handleFaqChange(index, "answer", e.target.value)
                    }
                    className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addFaq}
                className="bg-gray-700 hover:bg-gray-800 text-sm text-white px-4 py-2 rounded-md"
              >
                Add FAQ
              </button>
            </div>
          </div>

          <div className="flex gap-2 justify-end my-5">
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
            >
              {loading ? "Processing..." : editMode ? "Update" : "Add"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="flex justify-end mb-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">Loading...</span>
            </div>
          ) : filteredData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Sub Category
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className={`${
                      currentSubCategoryId === item._id
                        ? "bg-blue-50"
                        : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {item?.category?.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item?.subCategory}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-gray-600 hover:text-gray-800 transition"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No sub-categories found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSubCategory;
