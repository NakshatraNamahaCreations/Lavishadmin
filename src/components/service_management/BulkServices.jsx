import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import { getAuthToken, getAxios, getUploadAxios } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RiFileExcel2Fill } from "react-icons/ri";


const BulkServices = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select a valid Excel file.");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload an Excel file (.xls or .xlsx)."
      );
      return;
    }

    // Set the file to state for submission
    setExcelFile(file);
    setError(""); // Clear any previous errors
    console.log("File selected:", file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!excelFile || excelFile.length === 0) {
      setError("Please upload a valid Excel file.");
      return;
    }

    if (!selectedCategory || !selectedSubCategory) {
      setError("Please select a category and subcategory.");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", excelFile);
    formData.append("categoryId", selectedCategory);
    formData.append("subCategoryId", selectedSubCategory);
    formData.append("subSubCategoryId", selectedSubSubCategory || "");
    formData.append("themeId", selectedTheme || "");

    try {
      const uploadAxios = getUploadAxios();
      const response = await uploadAxios.post(
        "/services/bulk-upload",
        formData
      );

      console.log("Bulk upload successful:", response.data);
      alert("Services uploaded successfully!");
      resetForm();
      navigate("/service/service-list");
    } catch (error) {
      console.error("Error uploading bulk services:", error);
      setError("Failed to upload bulk services.");
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    setSelectedTheme("");
    setExcelFile(null);
    setError("");
  };

  const handleDownloadTemplate = () => {
    const worksheetData = [
      {
        serviceName: "",
        originalPrice: "",
        offerPrice: "",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Services");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "bulk_services_template.xlsx");
  };

  const fetchCategories = async () => {
    try {
      const response = await getAxios().get("/categories/");
      setCategories(response.data.data);
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const fetchSubcategoriesByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const response = await getAxios().get(
        `/subcategories/category/${selectedCategory}`
      );
      setSubCategories(response.data.data);
    } catch (error) {
      setError("Failed to load subcategories");
    }
  };

  const fetchSubsubcategoriesByCategory = async () => {
    if (!selectedSubCategory) return;
    try {
      const response = await getAxios().get(
        `/subsubcategories/subcategory/${selectedSubCategory}`
      );
      setSubSubCategories(response.data.data);
    } catch (error) {
      setError("Failed to load subcategories");
    }
  };

  const fetchThemesBySubSubCategory = async () => {
    if (!selectedSubSubCategory) return;
    try {
      const response = await getAxios().get(
        `/themes/subsubCategory/${selectedSubSubCategory}`
      );
      setThemes(response.data.data);
    } catch (error) {
      setError("Failed to load themes");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategoriesByCategory();
  }, [selectedCategory]);

  useEffect(() => {
    fetchSubsubcategoriesByCategory();
  }, [selectedSubCategory]);

  useEffect(() => {
    fetchThemesBySubSubCategory();
  }, [selectedSubSubCategory]);

  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Service</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={handleDownloadTemplate}
            className="bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-1 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Add Service"
          >
          <RiFileExcel2Fill size={20} className="text-white"/>  Download Sheet
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* <form> */}
          <div className="grid grid-cols-3 gap-5">
            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subcategory <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.subCategory}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Subcategory */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Sub-Subcategory
              </label>
              <select
                value={selectedSubSubCategory}
                onChange={(e) => setSelectedSubSubCategory(e.target.value)}
                disabled={!selectedSubCategory}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Sub-Subcategory</option>
                {subSubCategories.map((subsubcat) => (
                  <option key={subsubcat._id} value={subsubcat._id}>
                    {subsubcat.subSubCategory}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Theme
              </label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                disabled={!selectedSubSubCategory}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Theme</option>
                {themes.map((theme) => (
                  <option key={theme._id} value={theme._id}>
                    {theme.theme}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Upload Services Sheet <span className="text-red-600">*</span>
              </label>

              <input
                type="file"
                accept=".xlsx, .xls"
                className="py-1 w-full"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-700 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkServices;

// import React, { useEffect, useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { FiPlus, FiTrash2 } from "react-icons/fi";
// import axios from "axios";
// import { MdCancel } from "react-icons/md";
// import { getAuthToken, getUploadAxios } from "../../utils/api";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const BulkServices = () => {
//   const navigate = useNavigate();

//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("");
//   const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
//   const [selectedTheme, setSelectedTheme] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [subSubCategories, setSubSubCategories] = useState([]);
//   const [themes, setThemes] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [excelFile, setExcelFile] = useState([]);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet);
//       setExcelFile(data);
//       console.log("Parsed Excel Data:", data);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleDownloadTemplate = () => {
//     const worksheetData = [
//       {
//         serviceName: "",
//         originalPrice: "",
//         offerPrice: "",
//       },
//     ];

//     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Services");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(data, "bulk_services_template.xlsx");
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/categories/");
//       setCategories(response.data.data);
//     } catch (error) {
//       setError("Something went wrong");
//     }
//   };

//   const fetchSubcategoriesByCategory = async () => {
//     if (!selectedCategory) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/subcategories/category/${selectedCategory}`
//       );
//       setSubCategories(response.data.data);
//     } catch (error) {
//       setError("Failed to load subcategories");
//     }
//   };

//   const fetchSubsubcategoriesByCategory = async () => {
//     if (!selectedSubCategory) return;

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/subsubcategories/subcategory/${selectedSubCategory}`
//       );
//       setSubSubCategories(response.data.data);
//     } catch (error) {
//       setError("Failed to load subcategories");
//     }
//   };

//   const fetchThemesBySubSubCategory = async () => {
//     if (!selectedSubSubCategory) return;
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/themes/subsubCategory/${selectedSubSubCategory}`
//       );
//       setThemes(response.data.data);
//     } catch (error) {
//       setError("Failed to load themes");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!excelFile || excelFile.length === 0) {
//       setError("Please upload a valid Excel file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("excelFile", excelFile);
//     formData.append("categoryId", selectedCategory);
//     formData.append("subCategoryId", selectedSubCategory);
//     formData.append("subSubCategoryId", selectedSubSubCategory);
//     formData.append("themeId", selectedTheme);

//     setLoading(true);

//     try {
//       const uploadAxios = getUploadAxios();
//       const response = await uploadAxios.post(
//         "/services/bulk-upload",
//         formData
//       );
//       setLoading(false);
//       console.log("Bulk upload successful:", response.data);
//       // handle success (e.g. navigate to another page)
//     } catch (error) {
//       setLoading(false);
//       setError("Failed to upload bulk services.");
//       console.error("Error uploading bulk services:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     fetchSubcategoriesByCategory();
//   }, [selectedCategory]);

//   useEffect(() => {
//     fetchSubsubcategoriesByCategory();
//   }, [selectedSubCategory]);

//   useEffect(() => {
//     fetchThemesBySubSubCategory();
//   }, [selectedSubSubCategory]);

//   return (
//     <div className="min-h-screen bg-gray-100 p-1">
//       <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Bulk Upload Services
//           </h2>
//           {error && <p className="text-red-600 text-sm">{error}</p>}
//           <button
//             onClick={handleDownloadTemplate}
//             className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
//             aria-label="Download Template"
//           >
//             Download Template
//           </button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-3 gap-5">
//             {/* Category */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Category <span className="text-red-600">*</span>
//               </label>
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Subcategory */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Subcategory <span className="text-red-600">*</span>
//               </label>
//               <select
//                 value={selectedSubCategory}
//                 onChange={(e) => setSelectedSubCategory(e.target.value)}
//                 disabled={!selectedCategory}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               >
//                 <option value="">Select Subcategory</option>
//                 {subCategories.map((subcat) => (
//                   <option key={subcat._id} value={subcat._id}>
//                     {subcat.subCategory}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sub-Subcategory */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Sub-Subcategory
//               </label>
//               <select
//                 value={selectedSubSubCategory}
//                 onChange={(e) => setSelectedSubSubCategory(e.target.value)}
//                 disabled={!selectedSubCategory}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               >
//                 <option value="">Select Sub-Subcategory</option>
//                 {subSubCategories.map((subsubcat) => (
//                   <option key={subsubcat._id} value={subsubcat._id}>
//                     {subsubcat.subSubCategory}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Theme */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Theme
//               </label>
//               <select
//                 value={selectedTheme}
//                 onChange={(e) => setSelectedTheme(e.target.value)}
//                 disabled={!selectedSubSubCategory}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               >
//                 <option value="">Select Theme</option>
//                 {themes.map((theme) => (
//                   <option key={theme._id} value={theme._id}>
//                     {theme.theme}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Upload File */}
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Upload Services Sheet <span className="text-red-600">*</span>
//               </label>

//               <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 className="py-1 w-full"
//                 onChange={handleFileUpload}
//               />
//             </div>
//           </div>
//           <div className="mt-6 text-right">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-gray-700 text-white rounded-md"
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Upload Services"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BulkServices;
