// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { getUploadAxios } from "../utils/api";
// import { FiEdit, FiTrash2 } from "react-icons/fi";

// const Banner = () => {
//   // States for form fields and banner data
//   const [bannerLink, setBannerLink] = useState("");
//   const [bannerType, setBannerType] = useState("");
//   const [bannerImage, setBannerImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState("");
//   const [bannerData, setBannerData] = useState([]);
//   const [editBannerId, setEditBannerId] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState(null); // Error state

//   // Handle file upload and image preview


//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setBannerImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   // Fetch banners from the backend
//   const fetchBanner = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get("https://api.lavisheventzz.com/api/banners/");
//       setBannerData(response.data.data || []);
//     } catch (error) {
//       setError("Error fetching banners.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form submission (Create or Update Banner)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!bannerType) {
//       alert("Please select banner type.");
//       return;
//     }

//     // New validation for create
//     if (!isEditing && (!bannerImage || typeof bannerImage === "string")) {
//       alert("Please upload a banner image.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("bannerLink", bannerLink);
//     formData.append("bannerType", bannerType);

//     if (bannerImage && typeof bannerImage !== "string") {
//       formData.append("bannerImage", bannerImage);
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       let response;
//       if (isEditing && editBannerId) {
//         response = await getUploadAxios().put(
//           `https://api.lavisheventzz.com/api/banners/update/${editBannerId}`,
//           formData
//         );
//       } else {
//         response = await getUploadAxios().post(
//           "https://api.lavisheventzz.com/api/banners/create",
//           formData
//         );
//       }

//       resetForm();
//       fetchBanner();
//     } catch (error) {
//       setError("There was an error, please try again later.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle banner edit
//   const handleEdit = (banner) => {
//     setBannerLink(banner.bannerLink);
//     setBannerType(banner.bannerType);
//     setImagePreview(`http://localhost:5000/images/${banner.bannerImage}`);
//     setBannerImage(banner.bannerImage);
//     setIsEditing(true);
//     setEditBannerId(banner._id);
//   };

//    // Handle banner deletion
//    const handleDelete = async (id) => {
//     // if (window.confirm("Are you sure you want to delete this banner?")) {
//     try {
//       await axios.delete(`https://api.lavisheventzz.com/api/banners/delete/${id}`);
//       fetchBanner();
//     } catch (error) {
//       setError("Error deleting banner.");
//       console.error(error);
//     }
//     // }
//   };

//   // Reset form fields
//   const resetForm = () => {
//     setBannerLink("");
//     setBannerImage(null);
//     setImagePreview("");
//     setBannerType("");
//     setIsEditing(false);
//     setEditBannerId(null);
//   };

//   // Fetch banners on component mount
//   useEffect(() => {
//     fetchBanner();
//   }, []);

//   return (
//     <div className="banner-form-container p-6 bg-gray-50 rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-center">Create Banner</h1>

//       {/* Form to create/update banner */}
//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 gap-4">
//           {/* Banner Type and Link */}
//           <div className="col-span-1 flex flex-col">
//             <label className="font-medium">
//               Banner Type <span className="text-red-500">*</span>
//             </label>
//             <select
//               className="border-2 p-2 mt-2 rounded-md"
//               value={bannerType}
//               onChange={(e) => setBannerType(e.target.value)}
//               required
//             >
//               <option value="">Select Option</option>
//               <option value="upcoming banner">Upcoming banner</option>
//               <option value="main banner">Main banner</option>
//             </select>
//           </div>

//           <div className="col-span-1 flex flex-col">
//             <label className="font-medium">Banner Link</label>
//             <input
//               type="text"
//               value={bannerLink}
//               onChange={(e) => setBannerLink(e.target.value)}
//               placeholder="Enter Banner Link"
//               className="border-2 p-2 mt-2 rounded-md"
//             />
//           </div>

//           {/* Image Upload */}
//           <div className="col-span-1 flex flex-col">
//             <label className="font-medium">
//               Upload Banner Image (1280 x 420)
//               <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="file"
//               onChange={handleImageUpload}
//               className="border-2 p-2 mt-2 rounded-md"
//             />
//           </div>

//           {/* Image Preview */}
//           <div className="col-span-1 flex flex-col">
//             <label className="font-medium">Image Preview</label>
//             {imagePreview ? (
//               <img
//                 src={imagePreview}
//                 className="w-[100px] h-[50px] object-cover mt-2 rounded border"
//                 alt="Preview"
//               />
//             ) : (
//               <p className="text-sm text-gray-400 mt-2">No image selected</p>
//             )}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-2 flex justify-end">
//           <button
//             type="submit"
//             className="cursor-pointer bg-yellow-500 text-white font-semibold text-lg px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : isEditing ? "Update" : "Create"}
//           </button>
//         </div>
//       </form>

//       {/* Error and Loading States */}
//       {error && (
//         <div className="text-red-500 text-center mt-4">
//           <strong>{error}</strong>
//         </div>
//       )}

//       {/* Banner Table */}
//       <div>
//         {loading ? (
//           <div className="text-center mt-8">Loading banners...</div>
//         ) : (
//           bannerData?.length > 0 && (
//             <div className="mt-8">
//               <h2 className="text-xl font-semibold mb-4">Uploaded Banners</h2>
//               <div className="overflow-x-auto rounded-lg shadow">
//                 <table className="min-w-full table-auto border-collapse text-sm">
//                   <thead>
//                     <tr className="bg-gray-100 border-b">
//                       <th className="px-4 py-2 text-left">#</th>
//                       <th className="px-4 py-2 text-left">Image</th>
//                       <th className="px-4 py-2 text-left">Type</th>
//                       <th className="px-4 py-2 text-left">Link</th>
//                       <th className="px-4 py-2 text-left">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {bannerData.map((banner, index) => (
//                       <tr
//                         key={banner._id || index}
//                         className="border-b hover:bg-gray-50"
//                       >
//                         <td className="px-4 py-2">{index + 1}</td>
//                         <td className="px-4 py-2">
//                           <img
//                             src={`http://localhost:5000/images/${banner.bannerImage}`}
//                             alt="Banner"
//                             className="w-32 h-16 object-cover rounded"
//                           />
//                         </td>
//                         <td className="px-4 py-2 capitalize">
//                           {banner.bannerType}
//                         </td>
//                         <td className="px-4 py-2 text-blue-500 underline">
//                           <a
//                             href={banner.bannerLink}
//                             target="_blank"
//                             rel="noreferrer"
//                           >
//                             {banner.bannerLink || "N/A"}
//                           </a>
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="flex gap-2">
//                             <button
//                               className="text-gray-600 hover:text-gray-800 transition"
//                               onClick={() => handleEdit(banner)}
//                             >
//                               <FiEdit size={18} />
//                             </button>
//                             <button
//                               className="text-red-600 hover:text-red-800 transition"
//                               onClick={() => handleDelete(banner._id)}
//                             >
//                               <FiTrash2 size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default Banner;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { getAuthAxios, getAxios } from "../utils/api";

const Banner = () => {
  const [bannerLink, setBannerLink] = useState("");
  const [bannerType, setBannerType] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerData, setBannerData] = useState([]);
  const [editBannerId, setEditBannerId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBanner = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAxios().get("/banners/");
      setBannerData(response.data.data || []);
    } catch (error) {
      setError("Error fetching banners.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerType || !bannerImage) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      bannerLink,
      bannerType,
      bannerImage,
    };

    setLoading(true);
    setError(null);

    try {
      if (isEditing && editBannerId) {
        await getAuthAxios().put(
          `/banners/update/${editBannerId}`,
          payload
        );
      } else {
        await getAuthAxios().post("/banners/create", payload);
      }

      resetForm();
      fetchBanner();
    } catch (error) {
      const msg = error.response?.data?.message || "There was an error, please try again later.";
      setError(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setBannerLink(banner.bannerLink);
    setBannerType(banner.bannerType);
    setBannerImage(banner.bannerImage);
    setIsEditing(true);
    setEditBannerId(banner._id);
  };

  const handleDelete = async (id) => {
    try {
      await getAuthAxios().delete(`/banners/delete/${id}`);
      fetchBanner();
    } catch (error) {
      setError("Error deleting banner.");
      console.error(error);
    }
  };

  const resetForm = () => {
    setBannerLink("");
    setBannerImage("");
    setBannerType("");
    setIsEditing(false);
    setEditBannerId(null);
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <div className="banner-form-container p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">{isEditing ? "Update Banner" : "Create Banner"}</h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 flex flex-col">
            <label className="font-medium">
              Banner Type <span className="text-red-500">*</span>
            </label>
            <select
              className="border-2 p-2 mt-2 rounded-md"
              value={bannerType}
              onChange={(e) => setBannerType(e.target.value)}
              required
            >
              <option value="">Select Option</option>
              <option value="upcoming banner">Upcoming Banner</option>
              <option value="main banner">Main Banner</option>
            </select>
          </div>

          <div className="col-span-1 flex flex-col">
            <label className="font-medium">Banner Link</label>
            <input
              type="text"
              value={bannerLink}
              onChange={(e) => setBannerLink(e.target.value)}
              placeholder="Enter Banner Link"
              className="border-2 p-2 mt-2 rounded-md"
            />
          </div>

          <div className="col-span-1 flex flex-col">
            <label className="font-medium">
              Banner Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="border-2 p-2 mt-2 rounded-md"
              required
            />
          </div>

          <div className="col-span-1 flex flex-col">
            <label className="font-medium">Image Preview</label>
            {bannerImage ? (
              <img
                src={bannerImage}
                className="w-[100px] h-[50px] object-cover mt-2 rounded border"
                alt="Preview"
              />
            ) : (
              <p className="text-sm text-gray-400 mt-2">No image URL provided</p>
            )}
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="cursor-pointer bg-yellow-500 text-white font-semibold text-lg px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-center mt-4">
          <strong>{error}</strong>
        </div>
      )}

      <div>
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : (
          bannerData?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Uploaded Banners</h2>
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Image</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Link</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannerData.map((banner, index) => (
                      <tr key={banner._id || index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">
                          <img
                            src={banner.bannerImage}
                            alt="Banner"
                            className="w-32 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2 capitalize">{banner.bannerType}</td>
                        <td className="px-4 py-2 text-blue-500 underline">
                          <a href={banner.bannerLink} target="_blank" rel="noreferrer">
                            {banner.bannerLink || "N/A"}
                          </a>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="text-gray-600 hover:text-gray-800 transition"
                              onClick={() => handleEdit(banner)}
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 transition"
                              onClick={() => handleDelete(banner._id)}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Banner;
