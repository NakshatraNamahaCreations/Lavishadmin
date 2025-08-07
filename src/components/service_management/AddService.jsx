import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { MdCancel } from "react-icons/md";
import {
  getAuthAxios,
  getAuthToken,
  getAxios,
  getUploadAxios,
} from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddService = () => {
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState("");
  const [requiredDetails, setRequiredDetails] = useState("");
  const [customizedInputs, setCustomizedInputs] = useState([]);
  const [customizedInput, setCustomizedInput] = useState({
    label: "",
    inputType: "",
    maxValue: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedBalloonColors, setSelectedBalloonColors] = useState([]);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [offerPrice, setOfferPrice] = useState(null);
  const [service, setService] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [themes, setThemes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [keywords, setKeywords] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const handleAddImageLink = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
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
    setCustomizedInputs(customizedInputs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !selectedCategory ||
      !selectedSubCategory ||
      !service ||
      !offerPrice ||
      !originalPrice ||
      !packageDetails ||
      selectedBalloonColors.length === 0 ||
      images.length === 0
    ) {
      alert("Please fill the required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      const authAxios = getAuthAxios();
      if (!token) {
        setError("Unauthorized! Please login first.");
        setLoading(false);
        return;
      }

      const validFaqs = faqs.filter(
        (faq) => faq.question.trim() && faq.answer.trim()
      );

      const formData = new FormData();
      formData.append("serviceName", service);
      formData.append("categoryId", selectedCategory);
      formData.append("subCategoryId", selectedSubCategory);
      formData.append("subSubCategoryId", selectedSubSubCategory);
      formData.append("themeId", selectedTheme);
      formData.append("packageDetails", packageDetails);
      formData.append("requiredDetails", requiredDetails);
      formData.append("customizedInputs", JSON.stringify(customizedInputs));
      formData.append("originalPrice", originalPrice);
      formData.append("offerPrice", offerPrice);
      formData.append("balloonColors", JSON.stringify(selectedBalloonColors));
      formData.append("images", JSON.stringify(images));
      formData.append("metaTitle", metaTitle.trim());
      formData.append("metaDescription", metaDescription.trim());
      formData.append("caption", caption.trim());
      formData.append("keywords", keywords.trim());
   formData.append("faqs", JSON.stringify(validFaqs.length > 0 ? validFaqs : []));


      await authAxios.post("/services/create", formData);
      alert("Service Created Successfully");
      resetForm();
    } catch (error) {
      console.error("Error while creating/updating service:", error);
      setError(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
      setTimeout(() => navigate("/service/service-list"), 100);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedSubSubCategory("");
    setSelectedTheme("");
    setService("");
    setOfferPrice("");
    setOriginalPrice("");
    setPackageDetails("");
    setRequiredDetails("");
    setCustomizedInputs([]);
    setSelectedBalloonColors([]);
    setImages([]);
    setImageInput("");
    setMetaTitle("");
    setMetaDescription("");
    setKeywords("");
    setCaption("");
    setFaqs([{ question: "", answer: "" }]);
  };

  const fetchCategories = async () => {
    try {
      const res = await getAxios().get("/categories/");
      setCategories(res.data.data);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const fetchSubcategoriesByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const res = await getAxios().get(
        `/subcategories/category/${selectedCategory}`
      );
      setSubCategories(res.data.data);
    } catch (err) {
      setError("Failed to load subcategories");
    }
  };

  const fetchSubsubcategoriesByCategory = async () => {
    if (!selectedSubCategory) return;
    try {
      const res = await getAxios().get(
        `/subsubcategories/subcategory/${selectedSubCategory}`
      );
      setSubSubCategories(res.data.data);
    } catch (err) {
      setError("Failed to load sub-subcategories");
    }
  };

  const fetchThemesBySubSubCategory = async () => {
    if (!selectedSubSubCategory) return;
    try {
      const res = await getAxios().get(
        `/themes/subsubCategory/${selectedSubSubCategory}`
      );
      setThemes(res.data.data);
    } catch (err) {
      setError("Failed to load themes");
    }
  };

  const fetchBalloons = async () => {
    try {
      const res = await getAxios().get("/balloons/");
      setBalloons(res.data.data);
    } catch (err) {
      setError("Failed to load balloons");
    }
  };

  useEffect(() => {
    fetchBalloons();
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

  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="min-h-screen bg-gray-100 p-1">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Service</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-5">
            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(toTitleCase(e.target.value))
                }
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
                onChange={(e) =>
                  setSelectedSubCategory(toTitleCase(e.target.value))
                }
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
                onChange={(e) =>
                  setSelectedSubSubCategory(toTitleCase(e.target.value))
                }
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
                onChange={(e) => setSelectedTheme(toTitleCase(e.target.value))}
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

            {/* Service Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Service Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(toTitleCase(e.target.value))}
                placeholder="Enter Service Name"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            {/* Offer Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Offer Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="Enter Offer Price"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Original Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter Original Price"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Image Links <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleAddImageLink}
                className="p-2 px-4 bg-gray-600 text-white rounded-md flex items-center gap-1"
              >
                <FiPlus /> Add
              </button>
            </div>
            <div className="flex gap-4 flex-wrap">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0 text-sm p-1"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <MdCancel />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Package Details */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Package Details <span className="text-red-600">*</span>
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={packageDetails}
              onChange={(event, editor) => setPackageDetails(editor.getData())}
            />
          </div>

          {/* Required Details */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Required Details <span className="text-red-600">*</span>
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={requiredDetails}
              onChange={(event, editor) => setRequiredDetails(editor.getData())}
            />
          </div>

          {/* <div className="grid grid-cols-2 gap-10"> */}
          {/* Customized Inputs */}

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
                  setCustomizedInput({
                    ...customizedInput,
                    label: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md"
              />

              <select
                value={customizedInput.inputType}
                disabled={!customizedInput.label}
                onChange={(e) =>
                  setCustomizedInput({
                    ...customizedInput,
                    inputType: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
              </select>

              <input
                type="number"
                placeholder="Max Value"
                disabled={!customizedInput.inputType}
                value={customizedInput.maxValue}
                onChange={(e) =>
                  setCustomizedInput({
                    ...customizedInput,
                    maxValue: e.target.value,
                  })
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
                    <strong>{input.label}</strong> ({" "}
                    {input.inputType && `Type: ${input.inputType}`}{" "}
                    {input.maxValue && `,Max: ${input.maxValue}`})
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

          {/* Balloon Colors */}
          <div className="mt-5 max-w-sm">
            <label className="block text-gray-700 font-medium mb-1">
              Balloon Colors <span className="text-red-600">*</span>
            </label>
            <select
              onChange={(e) => {
                const selectedColor = e.target.value;
                if (
                  selectedColor &&
                  !selectedBalloonColors.includes(selectedColor)
                ) {
                  setSelectedBalloonColors([
                    ...selectedBalloonColors,
                    selectedColor,
                  ]);
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select Balloon Color</option>
              {balloons.map((balloon) => (
                <option key={balloon._id} value={balloon.balloonColor}>
                  {balloon.balloonColor}
                </option>
              ))}
            </select>
            <ul className="list-disc pl-5 mt-2 flex gap-4 flex-wrap">
              {selectedBalloonColors.map((color, index) => (
                <li key={index} className="flex items-center gap-2 mb-2">
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedBalloonColors(
                        selectedBalloonColors.filter((_, i) => i !== index)
                      )
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <MdCancel />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* </div> */}

          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title"
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description"
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. birthday, balloon, decoration"
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
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

          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-2">FAQs</label>
            {faqs.map((faq, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => {
                    const updatedFaqs = [...faqs];
                    updatedFaqs[index].question = e.target.value;
                    setFaqs(updatedFaqs);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const updatedFaqs = [...faqs];
                    updatedFaqs[index].answer = e.target.value;
                    setFaqs(updatedFaqs);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <div className="col-span-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove FAQ
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addFaq}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add another FAQ
            </button>
          </div>

          <div className="mt-6 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-gray-700 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
