// import React, { useEffect, useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { FiPlus, FiTrash2 } from "react-icons/fi";
// import { MdCancel } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Import axios for API calls
// import { getUploadAxios } from "../../../utils/api";

// const AddAddons = () => {
//   const navigate = useNavigate();

//   // State management
//   const [subCategory, setSubCategory] = useState("");
//   const [addonsName, setAddonsName] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [price, setPrice] = useState("");
//   const [samedaydelivery, setSamedaydelivery] = useState("");
//   const [addonsDescription, setAddonsDescription] = useState("");
//   const [customizedInputs, setCustomizedInputs] = useState([]);
//   const [customizedInputValue, setCustomizedInputValue] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [subCategories, setSubCategories] = useState([]);


//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleAddCustomizedInput = () => {
//     if (customizedInputValue.trim() !== "") {
//       setCustomizedInputs([...customizedInputs, customizedInputValue]);
//       setCustomizedInputValue("");
//     }
//   };

//   const handleRemoveCustomizedInput = (index) => {
//     const updatedInputs = [...customizedInputs];
//     updatedInputs.splice(index, 1);
//     setCustomizedInputs(updatedInputs);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate required fields
//     if (
//       !subCategory ||
//       !addonsName ||
//       !price ||
//       !samedaydelivery ||
//       !addonsDescription ||
//       !image
//     ) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     // Prepare form data for submission
//     const formData = new FormData();
//     formData.append("subCategory", subCategory);
//     formData.append("addonsName", addonsName);
//     formData.append("price", price);
//     formData.append("samedaydelivery", samedaydelivery);
//     formData.append("addonsDescription", addonsDescription);
//     formData.append("customizedInputs", JSON.stringify(customizedInputs));
//     formData.append("image", image);

//     try {
//       const uploadAxios = getUploadAxios();
//       // Make API call to create addon
//       const response = await uploadAxios.post("addons/create", formData);

//       if (response.status === 200 || response.status === 201) {
//         alert("Addon added successfully!");
//         navigate("/addons/addons-list");
//       }
//     } catch (error) {
//       console.error("Error creating addon:", error);
//       alert(
//         error.response?.data?.message ||
//           "Failed to create addon. Please try again."
//       );
//     }
//   };

//   const fetchSubcategory = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get("http://localhost:5000/api/subcategories/");
//       setSubCategories(res.data.data);
//       // console.log(res.data.data)
//     } catch (error) {
//       setError(error.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubcategory();
//   }, []);

//   const toTitleCase = (str) => {
//     return str
//       .toLowerCase()
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(" ");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-0">
//       <div className="mx-auto bg-white shadow-lg rounded-lg p-6 lg:px-6 lg:py-2">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Addons</h2>
//         {error && <p className="text-red-600 mb-2">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {/* Dropdowns and Addons Name */}
//           <div className="grid grid-cols-3 gap-5">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Sub Category <span className="text-red-600">*</span>
//               </label>
//               <select
//                 value={subCategory}
//                 onChange={(e) => setSubCategory(toTitleCase(e.target.value))}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               >
//                 <option value="">Select Sub Category</option>
//                 {subCategories.map((subcat) => (
//                   <option key={subcat._id} value={subcat._id}>
//                     {subcat.subCategory}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Addon Name <span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={addonsName}
//                 onChange={(e) => setAddonsName(toTitleCase(e.target.value))}
//                 placeholder="Add Addons Name"
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Addon Image <span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Price <span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="number"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 placeholder="Enter Original Price"
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Same Day Delivery <span className="text-red-600">*</span>
//               </label>
//               <select
//                 value={samedaydelivery}
//                 onChange={(e) => setSamedaydelivery(toTitleCase(e.target.value))}
//                 className="px-4 py-2 border border-gray-300 rounded-md w-full"
//               >
//                 <option value="">Select Option</option>
//                 <option value="Possible">Possible</option>
//                 <option value="Not Possible">Not Possible</option>
//               </select>
//             </div>
//           </div>

//           {/* Image Previews */}
//           <div className="mt-4">
//             <h4 className="font-semibold">Selected Images:</h4>
//             <div className="flex gap-4 flex-wrap">
//               {imagePreview && (
//                 <div className="relative">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-32 h-32 object-cover rounded-md"
//                   />
//                   <button
//                     className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0 text-sm p-1"
//                     onClick={() => {
//                       setImage(null);
//                       setImagePreview("");
//                     }}
//                   >
//                     <MdCancel />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* CKEditor for Addons Description */}
//           <div className="mt-5">
//             <label className="block text-gray-700 font-medium mb-1">
//               Addons Description <span className="text-red-600">*</span>
//             </label>
//             <CKEditor
//               editor={ClassicEditor}
//               data={addonsDescription}
//               onChange={(event, editor) =>
//                 setAddonsDescription(editor.getData())
//               }
//             />
//           </div>

//           {/* Customized Input Details Section */}
//           <div className="mt-5">
//             <label className="block text-gray-700 font-medium mb-1">
//               Customized Input Details
//             </label>
//             <div className="flex items-center gap-2 mb-4">
//               <input
//                 type="text"
//                 value={customizedInputValue}
//                 onChange={(e) => setCustomizedInputValue(e.target.value)}
//                 placeholder="Add Customized Input"
//                 className="p-2 border border-gray-300 rounded-md flex-1"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddCustomizedInput}
//                 className="p-2 px-4 bg-gray-600 text-white rounded-md flex items-center gap-1"
//               >
//                 <FiPlus /> Add
//               </button>
//             </div>
//             <ul className="list-disc pl-5">
//               {customizedInputs.map((input, index) => (
//                 <li
//                   key={index}
//                   className="flex items-center gap-2 mb-2 bg-gray-200 p-2 rounded-md"
//                 >
//                   <span className="flex-1">{input}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveCustomizedInput(index)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <FiTrash2 />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="text-end">
//             <button
//               type="submit"
//               className="rounded-lg bg-gray-700 px-4 py-2 text-white my-4"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddAddons;



import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import { getUploadAxios } from "../../../utils/api";

const AddAddons = () => {
  const navigate = useNavigate();

  // State management
  const [subCategory, setSubCategory] = useState("");
  const [addonsName, setAddonsName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [price, setPrice] = useState("");
  const [samedaydelivery, setSamedaydelivery] = useState("");
  const [addonsDescription, setAddonsDescription] = useState("");
  const [customizedInputs, setCustomizedInputs] = useState([]);
  const [customizedInput, setCustomizedInput] = useState({
    label: "",
    inputType: "",
    maxValue: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const handleAddCustomizedInput = () => {
    const { label, inputType, maxValue } = customizedInput;
    if (label.trim() && inputType) {
      setCustomizedInputs([
        ...customizedInputs,
        { label, inputType, maxValue: maxValue || null },
      ]);
      setCustomizedInput({ label: "", inputType: "", maxValue: "" });
    }
  };
  
  

  const handleRemoveCustomizedInput = (index) => {
    const updatedInputs = [...customizedInputs];
    updatedInputs.splice(index, 1);
    setCustomizedInputs(updatedInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !subCategory ||
      !addonsName ||
      !price ||
      !samedaydelivery ||
      !addonsDescription ||
      !image
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append("subCategory", subCategory);
    formData.append("addonsName", addonsName);
    formData.append("price", price);
    formData.append("samedaydelivery", samedaydelivery);
    formData.append("addonsDescription", addonsDescription);
    formData.append("customizedInputs", JSON.stringify(customizedInputs));
    formData.append("image", image);

    try {
      const uploadAxios = getUploadAxios();
      // Make API call to create addon
      const response = await uploadAxios.post("addons/create", formData);

      if (response.status === 200 || response.status === 201) {
        alert("Addon added successfully!");
        navigate("/addons/addons-list");
      }
    } catch (error) {
      console.error("Error creating addon:", error);
      alert(
        error.response?.data?.message ||
        "Failed to create addon. Please try again."
      );
    }
  };

  const fetchSubcategory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/subcategories/");
      setSubCategories(res.data.data);
      // console.log(res.data.data)
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategory();
  }, []);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-0">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 lg:px-6 lg:py-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Addons</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Dropdowns and Addons Name */}
          <div className="grid grid-cols-3 gap-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Sub Category <span className="text-red-600">*</span>
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(toTitleCase(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>
                    {subcat.subCategory}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Addon Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={addonsName}
                onChange={(e) => setAddonsName(toTitleCase(e.target.value))}
                placeholder="Add Addons Name"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Addon Image <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter Original Price"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Same Day Delivery <span className="text-red-600">*</span>
              </label>
              <select
                value={samedaydelivery}
                onChange={(e) => setSamedaydelivery(toTitleCase(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Option</option>
                <option value="Possible">Possible</option>
                <option value="Not Possible">Not Possible</option>
              </select>
            </div>
          </div>

          {/* Image Previews */}
          <div className="mt-4">
            <h4 className="font-semibold">Selected Images:</h4>
            <div className="flex gap-4 flex-wrap">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0 text-sm p-1"
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                  >
                    <MdCancel />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* CKEditor for Addons Description */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Addons Description <span className="text-red-600">*</span>
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={addonsDescription}
              onChange={(event, editor) =>
                setAddonsDescription(editor.getData())
              }
            />
          </div>

          {/* Customized Input Details Section */}
          {/* <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Customized Input Details
            </label>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={customizedInputValue}
                onChange={(e) => setCustomizedInputValue(e.target.value)}
                placeholder="Add Customized Input"
                className="p-2 border border-gray-300 rounded-md flex-1"
              />
              <button
                type="button"
                onClick={handleAddCustomizedInput}
                className="p-2 px-4 bg-gray-600 text-white rounded-md flex items-center gap-1"
              >
                <FiPlus /> Add
              </button>
            </div>
            <ul className="list-disc pl-5">
              {customizedInputs.map((input, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 mb-2 bg-gray-200 p-2 rounded-md"
                >
                  <span className="flex-1">{input}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomizedInput(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          </div> */}

          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Customized Input Details
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Label"
                value={customizedInput.label}
                onChange={(e) =>
                  setCustomizedInput({ ...customizedInput, label: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md"
              />

              <select
                value={customizedInput.inputType}
                disabled={!customizedInput.label}
                onChange={(e) =>
                  setCustomizedInput({ ...customizedInput, inputType: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="file">Image</option>
              </select>

              <input
                type="number"
                placeholder="Max Value"
                disabled={!customizedInput.inputType}
                value={customizedInput.maxValue}
                onChange={(e) =>
                  setCustomizedInput({ ...customizedInput, maxValue: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="button"
              onClick={handleAddCustomizedInput}
              className="p-2 px-4 bg-gray-600 text-white rounded-md flex items-center gap-1"
            >
              <FiPlus /> Add
            </button>

            <ul className="list-disc pl-5 mt-4">
              {customizedInputs.map((input, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 mb-2 bg-gray-200 p-2 rounded-md"
                >
                  <span className="flex-1">
                    <strong>{input.label}</strong> ({input.inputType}, Max:{" "}
                    {input.maxValue})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomizedInput(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </li>
              ))}
            </ul>
          </div>


          <div className="text-end">
            <button
              type="submit"
              className="rounded-lg bg-gray-700 px-4 py-2 text-white my-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddons;
