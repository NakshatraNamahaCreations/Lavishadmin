// import React, { useState, useEffect } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const EditBlog = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     bannerImage: null,
//     thumbnailImage: null,
//     redirectLink: "",
//     metaTitle: "",
//     metaDescription: "",
//     description: "",
//   });

//   const [previewImages, setPreviewImages] = useState({
//     bannerImage: "",
//     thumbnailImage: "",
//   });

//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/blog/${id}`);
//         const blog = res.data.data;

//         setFormData({
//           title: blog.title || "",
//           bannerImage: null,
//           thumbnailImage: null,
//           redirectLink: blog.redirectLink || "",
//           metaTitle: blog.metaTitle || "",
//           metaDescription: blog.metaDescription || "",
//           description: blog.description || "",
//         });

//         setPreviewImages({
//           bannerImage: blog.bannerImage || "",
//           thumbnailImage: blog.thumbnailImage || "",
//         });
//       } catch (err) {
//         console.error("Failed to load blog:", err.message);
//         alert("Unable to fetch blog data.");
//       }
//     };

//     fetchBlog();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       const file = files[0];
//       setFormData((prev) => ({ ...prev, [name]: file }));

//       const previewUrl = URL.createObjectURL(file);
//       setPreviewImages((prev) => ({
//         ...prev,
//         [name]: previewUrl,
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCKEditorChange = (event, editor) => {
//     const data = editor.getData();
//     setFormData((prev) => ({ ...prev, description: data }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("redirectLink", formData.redirectLink);
//       data.append("metaTitle", formData.metaTitle);
//       data.append("metaDescription", formData.metaDescription);
//       data.append("description", formData.description);

//       if (formData.bannerImage) {
//         data.append("bannerImage", formData.bannerImage);
//       }

//       if (formData.thumbnailImage) {
//         data.append("thumbnailImage", formData.thumbnailImage);
//       }

//       const response = await axios.put(`http://localhost:5000/api/blog/${id}`, data);

//       if (response.data.success) {
//         alert("Blog updated successfully!");
//         navigate("/blogs");
//       } else {
//         alert("Blog update failed.");
//       }
//     } catch (err) {
//       console.error("Update failed:", err.message);
//       alert("Failed to update blog");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           className="w-full border px-3 py-2"
//           required
//           placeholder="Title"
//         />

//         <div className="flex gap-6">
//           <div>
//             <label className="block font-semibold">Banner Image</label>
//             {previewImages.bannerImage && (
//               <img
//                 src={previewImages.bannerImage}
//                 alt="Banner Preview"
//                 className="w-32 h-20 object-cover mt-2 rounded border"
//               />
//             )}
//             <input
//               type="file"
//               name="bannerImage"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-2"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold">Thumbnail Image</label>
//             {previewImages.thumbnailImage && (
//               <img
//                 src={previewImages.thumbnailImage}
//                 alt="Thumbnail Preview"
//                 className="w-32 h-20 object-cover mt-2 rounded border"
//               />
//             )}
//             <input
//               type="file"
//               name="thumbnailImage"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-2"
//             />
//           </div>
//         </div>

//         <input
//           type="url"
//           name="redirectLink"
//           value={formData.redirectLink}
//           onChange={handleChange}
//           className="w-full border px-3 py-2"
//           required
//           placeholder="Redirect Link"
//         />

//         <textarea
//           name="metaTitle"
//           value={formData.metaTitle}
//           onChange={handleChange}
//           rows="2"
//           className="w-full border px-3 py-2"
//           required
//           placeholder="Meta Title"
//         />

//         <textarea
//           name="metaDescription"
//           value={formData.metaDescription}
//           onChange={handleChange}
//           rows="3"
//           className="w-full border px-3 py-2"
//           required
//           placeholder="Meta Description"
//         />

//         <CKEditor
//           editor={ClassicEditor}
//           data={formData.description}
//           onChange={handleCKEditorChange}
//         />

//         <div className="pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
//           >
//             {loading ? "Updating..." : "Update Blog"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditBlog;



import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    bannerImage: null,
    thumbnailImage: null,
    redirectLink: "",
    metaTitle: "",
    metaDescription: "",
    description: "",
    faqs: [{ question: "", answer: "" }] // Initialize with one FAQ field
  });

  const [previewImages, setPreviewImages] = useState({
    bannerImage: "",
    thumbnailImage: "",
  });

  const [loading, setLoading] = useState(false);

  // Fetch the blog data from the API
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blog/${id}`);
        const blog = res.data.data;

        setFormData({
          title: blog.title || "",
          bannerImage: null, // Don't set the banner image directly, upload it when editing
          thumbnailImage: null, // Same for the thumbnail image
          redirectLink: blog.redirectLink || "",
          metaTitle: blog.metaTitle || "",
          metaDescription: blog.metaDescription || "",
          description: blog.description || "",
          faqs: blog.faqs || [{ question: "", answer: "" }] // Assuming FAQs are saved in the DB as well
        });

        setPreviewImages({
          bannerImage: blog.bannerImage || "",
          thumbnailImage: blog.thumbnailImage || "",
        });
      } catch (err) {
        console.error("Failed to load blog:", err.message);
        alert("Unable to fetch blog data.");
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      const previewUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCKEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prev) => ({ ...prev, description: data }));
  };

  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const newFaqs = [...formData.faqs];
    newFaqs[index][name] = value;
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("redirectLink", formData.redirectLink);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDescription", formData.metaDescription);
      data.append("description", formData.description);

      if (formData.bannerImage) {
        data.append("bannerImage", formData.bannerImage);
      }

      if (formData.thumbnailImage) {
        data.append("thumbnailImage", formData.thumbnailImage);
      }

      data.append("faqs", JSON.stringify(formData.faqs)); // Send FAQs as a JSON string

      const response = await axios.put(`http://localhost:5000/api/blog/${id}`, data);

      if (response.data.success) {
        alert("Blog updated successfully!");
        navigate("/blogs");
      } else {
        alert("Blog update failed.");
      }
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Blog Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="Enter blog title"
          />
        </div>

        {/* Image Upload & Previews */}
        <div className="flex gap-6">
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Banner Image *</label>
            {previewImages.bannerImage && (
              <img
                src={previewImages.bannerImage}
                alt="Banner Preview"
                className="w-full h-32 object-cover mt-2 rounded-lg border border-gray-300"
              />
            )}
            <input
              type="file"
              name="bannerImage"
              accept="image/*"
              onChange={handleChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Thumbnail Image</label>
            {previewImages.thumbnailImage && (
              <img
                src={previewImages.thumbnailImage}
                alt="Thumbnail Preview"
                className="w-full h-32 object-cover mt-2 rounded-lg border border-gray-300"
              />
            )}
            <input
              type="file"
              name="thumbnailImage"
              accept="image/*"
              onChange={handleChange}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Redirect Link Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Redirect Link *</label>
          <input
            type="url"
            name="redirectLink"
            value={formData.redirectLink}
            onChange={handleChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="Enter the redirect link"
          />
        </div>

        {/* Meta Title Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Meta Title *</label>
          <textarea
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="Enter meta title"
            rows="2"
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Meta Description Input */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Meta Description *</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Enter meta description"
            rows="3"
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* CKEditor for Blog Description */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Blog Description *</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={handleCKEditorChange}
          />
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-xl font-semibold mt-6 text-gray-800">FAQs</h3>
          {formData.faqs.map((faq, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <div className="w-full">
                <input
                  type="text"
                  name="question"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, e)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  name="answer"
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, e)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                  rows="3"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFaq(index)}
                className="self-start bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Remove 
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFaq}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
          >
            Add FAQ
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
