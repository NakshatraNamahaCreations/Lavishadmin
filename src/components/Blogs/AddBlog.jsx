// import React, { useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const AddBlog = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     bannerImage: null,
//     thumbnailImage: null,
//     redirectLink: "",
//     metaTitle: "",
//     metaDescription: "",
//     description: "",
//     faqs: [{ question: "", answer: "" }],
//   });

//   const [previewImages, setPreviewImages] = useState({
//     bannerImage: null,
//     thumbnailImage: null,
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (files) {
//       const file = files[0];
//       setFormData((prev) => ({ ...prev, [name]: file }));

//       const previewUrl = URL.createObjectURL(file);
//       setPreviewImages((prev) => ({ ...prev, [name]: previewUrl }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCKEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setFormData((prev) => ({ ...prev, description: data }));
//   };

//   const handleFaqChange = (index, e) => {
//     const { name, value } = e.target;
//     const newFaqs = [...formData.faqs];
//     newFaqs[index][name] = value;
//     setFormData((prev) => ({ ...prev, faqs: newFaqs }));
//   };

//   const handleAddFaq = () => {
//     setFormData((prev) => ({
//       ...prev,
//       faqs: [...prev.faqs, { question: "", answer: "" }],
//     }));
//   };

//   const handleRemoveFaq = (index) => {
//     const newFaqs = [...formData.faqs];
//     newFaqs.splice(index, 1);
//     setFormData((prev) => ({ ...prev, faqs: newFaqs }));
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const {
//     title,
//     bannerImage,
//     thumbnailImage,
//     redirectLink,
//     metaTitle,
//     metaDescription,
//     description,
//     faqs,
//   } = formData;

//   if (!title || !bannerImage || !metaTitle || !metaDescription || !description) {
//     alert("All fields are required.");
//     return;
//   }

//   setLoading(true);
//   try {
//     const payload = new FormData();
//     payload.append("title", title);
//     payload.append("redirectLink", redirectLink);
//     payload.append("metaTitle", metaTitle);
//     payload.append("metaDescription", metaDescription);
//     payload.append("description", description);
//     payload.append("bannerImage", bannerImage);
//     payload.append("thumbnailImage", thumbnailImage);
//     payload.append("faqs", JSON.stringify(faqs)); // Send the FAQs as a JSON string

//     const response = await axios.post(`${API_BASE_URL}/blog`, payload);

//     if (response.data.success) {
//       alert("Blog created successfully!");
//       navigate("/blogs");
//     } else {
//       alert("Blog creation failed.");
//     }
//   } catch (err) {
//     console.error("Blog creation failed:", err);
//     alert("Something went wrong.");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Blog</h2>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Title Input */}
//         <div>
//           <label className="block text-lg font-semibold text-gray-700">Blog Title *</label>
//           <input
//             type="text"
//             name="title"
//             onChange={handleChange}
//             placeholder="Enter blog title"
//             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         {/* Image Upload & Previews */}
//         <div className="flex gap-6">
//           <div className="w-1/2">
//             <label className="block text-lg font-semibold text-gray-700">Banner Image *</label>
//             {previewImages.bannerImage && (
//               <img
//                 src={previewImages.bannerImage}
//                 alt="Banner Preview"
//                 className="w-full h-32 object-cover mt-2 rounded-lg border border-gray-300"
//               />
//             )}
//             <input
//               type="file"
//               name="bannerImage"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-2 w-full p-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>

//           <div className="w-1/2">
//             <label className="block text-lg font-semibold text-gray-700">Thumbnail Image </label>
//             {previewImages.thumbnailImage && (
//               <img
//                 src={previewImages.thumbnailImage}
//                 alt="Thumbnail Preview"
//                 className="w-full h-32 object-cover mt-2 rounded-lg border border-gray-300"
//               />
//             )}
//             <input
//               type="file"
//               name="thumbnailImage"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-2 w-full p-2 border border-gray-300 rounded-md"
//             />
//           </div>
//         </div>

//         {/* Redirect Link Input */}
//         <div>
//           <label className="block text-lg font-semibold text-gray-700">Redirect Link *</label>
//           <input
//             type="url"
//             name="redirectLink"
//             value={formData.redirectLink}
//             onChange={handleChange}
//             placeholder="Enter the redirect link"
//             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         {/* Meta Title Input */}
//         <div>
//           <label className="block text-lg font-semibold text-gray-700">Meta Title *</label>
//           <textarea
//             name="metaTitle"
//             value={formData.metaTitle}
//             onChange={handleChange}
//             placeholder="Enter meta title"
//             rows="2"
//             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         {/* Meta Description Input */}
//         <div>
//           <label className="block text-lg font-semibold text-gray-700">Meta Description *</label>
//           <textarea
//             name="metaDescription"
//             value={formData.metaDescription}
//             onChange={handleChange}
//             placeholder="Enter meta description"
//             rows="3"
//             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         {/* CKEditor for Blog Description */}
//         <div>
//           <label className="block text-lg font-semibold text-gray-700">Blog Description *</label>
//           <CKEditor
//             editor={ClassicEditor}
//             data={formData.description}
//             onChange={handleCKEditorChange}
//           />
//         </div>

//         {/* FAQ Section */}
//         <div>
//           <h3 className="text-xl font-semibold mt-6 text-gray-800">FAQs</h3>
//           {formData.faqs.map((faq, index) => (
//             <div key={index} className="flex gap-4 mb-4">
//               <div className="w-full">
//                 <input
//                   type="text"
//                   name="question"
//                   placeholder="Question"
//                   value={faq.question}
//                   onChange={(e) => handleFaqChange(index, e)}
//                   className="w-full mt-2 p-3 border border-gray-300 rounded-md"
//                   required
//                 />
//                 <textarea
//                   name="answer"
//                   placeholder="Answer"
//                   value={faq.answer}
//                   onChange={(e) => handleFaqChange(index, e)}
//                   className="w-full mt-2 p-3 border border-gray-300 rounded-md"
//                   rows="2"
//                   required
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveFaq(index)}
//                 className="self-start bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleAddFaq}
//                  className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
//           >
//             Add FAQ
//           </button>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-6">
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
//             disabled={loading}
//           >
//             {loading ? "Adding..." : "Save Blog"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddBlog;


import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

const AddBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    bannerImage: null,
    thumbnailImage: null,
    redirectLink: "",
    metaTitle: "",
    metaDescription: "",
    description: "",
    faqs: [{ question: "", answer: "" }],
  });

  const [previewImages, setPreviewImages] = useState({
    bannerImage: null,
    thumbnailImage: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviewImages((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCKEditorChange = (event, editor) => {
    setFormData((prev) => ({ ...prev, description: editor.getData() }));
  };

  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][name] = value;
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const handleRemoveFaq = (index) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, bannerImage, metaTitle, metaDescription, description, faqs } = formData;

    if (!title || !bannerImage || !metaTitle || !metaDescription || !description) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("redirectLink", formData.redirectLink);
      payload.append("metaTitle", formData.metaTitle);
      payload.append("metaDescription", formData.metaDescription);
      payload.append("description", formData.description);
      payload.append("bannerImage", formData.bannerImage);
      if (formData.thumbnailImage) {
        payload.append("thumbnailImage", formData.thumbnailImage);
      }
      payload.append("faqs", JSON.stringify(faqs));

      const res = await axios.post(`${API_BASE_URL}/blog`, payload);

      if (res.data.success) {
        alert("Blog created successfully");
        navigate("/blogs");
      } else {
        alert("Failed to create blog");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold">Blog Title *</label>
          <input type="text" name="title" onChange={handleChange} className="w-full mt-2 p-2 border rounded" required />
        </div>

        <div className="flex gap-6">
          <div className="w-1/2">
            <label className="block font-semibold">Banner Image *</label>
            {previewImages.bannerImage && <img src={previewImages.bannerImage} alt="Banner" className="mt-2 h-32 object-cover w-full" />}
            <input type="file" name="bannerImage" accept="image/*" onChange={handleChange} className="mt-2 w-full p-2 border rounded" required />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold">Thumbnail Image</label>
            {previewImages.thumbnailImage && <img src={previewImages.thumbnailImage} alt="Thumbnail" className="mt-2 h-32 object-cover w-full" />}
            <input type="file" name="thumbnailImage" accept="image/*" onChange={handleChange} className="mt-2 w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block font-semibold">Redirect Link</label>
          <input type="url" name="redirectLink" value={formData.redirectLink} onChange={handleChange} className="w-full mt-2 p-2 border rounded" />
        </div>

        <div>
          <label className="block font-semibold">Meta Title *</label>
          <textarea name="metaTitle" value={formData.metaTitle} onChange={handleChange} rows={2} className="w-full mt-2 p-2 border rounded" required />
        </div>

        <div>
          <label className="block font-semibold">Meta Description *</label>
          <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} className="w-full mt-2 p-2 border rounded" required />
        </div>

        <div>
          <label className="block font-semibold">Blog Description *</label>
          <CKEditor editor={ClassicEditor} data={formData.description} onChange={handleCKEditorChange} />
        </div>

        <div>
          <h3 className="text-lg font-bold mt-4 mb-2">FAQs</h3>
          {formData.faqs.map((faq, index) => (
            <div key={index} className="mb-4 flex gap-2">
              <div className="w-full">
                <input type="text" name="question" value={faq.question} onChange={(e) => handleFaqChange(index, e)} placeholder="Question" className="w-full p-2 border rounded mb-2" />
                <textarea name="answer" value={faq.answer} onChange={(e) => handleFaqChange(index, e)} placeholder="Answer" rows={2} className="w-full p-2 border rounded" />
              </div>
              <button type="button" onClick={() => handleRemoveFaq(index)} className="bg-red-500 text-white px-3 py-1 rounded self-start mt-1">Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddFaq} className="bg-gray-700 text-white px-4 py-2 rounded">Add FAQ</button>
        </div>

        <div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
