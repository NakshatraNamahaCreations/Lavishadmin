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
import { useNavigate, useParams } from "react-router-dom";

const EditService = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
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
  const [originalPrice, setOriginalPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
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

  const handleCancel = (e) => {
    e.preventDefault();
    resetForm();
    navigate("/service/service-list");
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const fetchSubcategoriesByCategory = async () => {
    if (!selectedCategory) return;
    try {
      const response = await getAxios().get(
        `/subcategories/category/${selectedCategory}`
      );
      setSubCategories(response.data.data);
    } catch (error) {
      console.log("err", error.message);
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
      console.log("err", error.message);
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
      console.log("theme", response.data.data);
    } catch (error) {
      console.log("err", error.message);
      setError("Failed to load subcategories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBalloons();
    fetchServiceDetails();
  }, []);

  useEffect(() => {
    fetchThemesBySubSubCategory();
  }, [selectedSubSubCategory]);

  useEffect(() => {
    fetchSubcategoriesByCategory();
  }, [selectedCategory]);

  useEffect(() => {
    fetchSubsubcategoriesByCategory();
  }, [selectedSubCategory]);

  const handlePackageDetailsChange = (event, editor) => {
    const data = editor.getData();
    console.log("ckdata", editor.getData());
    setPackageDetails(data);
  };

  const handleRequiredDetailsChange = (event, editor) => {
    const data = editor.getData();
    setRequiredDetails(data);
  };

  const handleAddCustomizedInput = (e) => {
    e.preventDefault();
    const { label, inputType, maxValue } = customizedInput;
    if (label && inputType) {
      setCustomizedInputs([
        ...customizedInputs,
        { label, inputType, maxValue },
      ]);
      setCustomizedInput({ label: "", inputType: "", maxValue: "" });
    } else {
      alert("Please fill all customized input fields.");
    }
  };

  const handleRemoveCustomizedInput = (index) => {
    const updatedInputs = customizedInputs.filter((_, i) => i !== index);
    setCustomizedInputs(updatedInputs);
  };

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchServiceDetails = async () => {
    try {
      const response = await fetch(
        `https://api.lavisheventzz.com/api/services/${serviceId}`
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch service details");
      const serviceData = data.data;
      setService(serviceData.serviceName || "");
      setSelectedCategory(serviceData.categoryId?._id || "");
      setSelectedSubCategory(serviceData.subCategoryId?._id || "");
      setSelectedSubSubCategory(serviceData.subSubCategoryId?._id || "");
      setSelectedTheme(serviceData.themeId?._id || "");
      setPackageDetails(serviceData.packageDetails || "");
      setRequiredDetails(serviceData.requiredDetails || "");
      setCustomizedInputs(serviceData.customizedInputs || []);
      setSelectedBalloonColors(serviceData.balloonColors || []);
      setOriginalPrice(serviceData.originalPrice || "");
      setOfferPrice(serviceData.offerPrice || "");
      setImages(serviceData.images || []);
      setMetaTitle(serviceData.metaTitle || "");
      setMetaDescription(serviceData.metaDescription || "");
      setCaption(serviceData.caption || "");
      setKeywords(serviceData.keywords || "");
      setFaqs(serviceData.faqs || []);
    } catch (error) {
      console.error("Error fetching service details:", error.message);
      setError(error.message);
    }
  };

  // ✅ Fixed version of handleSubmit inside your AddService component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
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
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      const authAxios = getAuthAxios(); // Ensure this doesn't set Content-Type manually

      if (!token) {
        setError("Unauthorized! Please login first.");
        setLoading(false);
        return;
      }

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

      const res = await authAxios.put(
        `/services/update/${serviceId}`,
        formData
      );

      alert("Service Updated Successfully");
      resetForm();
      navigate("/service/service-list");
    } catch (error) {
      console.error("Error while creating/updating service:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
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
  };

  const handleAddImageLink = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchServiceDetails();
    fetchCategories();
    fetchBalloons();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAxios().get("/categories/");
      setCategories(res.data.data);
    } catch (error) {
      setError("Something went wrong");
    }
  };

  const fetchBalloons = async () => {
    try {
      const res = await getAxios().get("/balloons/");
      setBalloons(res.data.data);
    } catch (error) {
      setError("Failed to load balloons");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-0">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 lg:px-6 lg:py-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Service</h2>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-5">
            {/* Category */}
            <div className="relative">
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
            <div className="relative">
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
            <div className="relative">
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
            <div className="relative">
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
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                Service Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(toTitleCase(e.target.value))}
                placeholder="Add Service Name"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Offer Price */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                Offer Price <span className="text-red-600">*</span>
              </label>
              <input
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                type="number"
                placeholder="Enter Offer Price"
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            {/* Original Price */}
            <div className="relative">
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

          {/* Selected Images */}
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

          {/* CKEditor for Package Details */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Package Details - Inclusion{" "}
              <span className="text-red-600">*</span>
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={packageDetails}
              onChange={handlePackageDetailsChange}
            />
          </div>

          {/* CKEditor for Required Details */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Required Details
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={requiredDetails}
              onChange={handleRequiredDetailsChange}
            />
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-semibold mb-2">
              Customized Input Details
            </h3>

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

          <div className="mt-4">
            <h4 className="font-semibold">
              Select Balloon Colors <span className="text-red-600">*</span>
            </h4>
            <select
              onChange={(e) => {
                const selectedColorId = e.target.value;
                if (
                  selectedColorId &&
                  !selectedBalloonColors.includes(selectedColorId)
                ) {
                  setSelectedBalloonColors([
                    ...selectedBalloonColors,
                    selectedColorId,
                  ]);
                }
              }}
              className="mt-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            >
              <option value="" disabled>
                Select Balloon Color
              </option>
              {balloons.map((balloon) => (
                <option key={balloon._id} value={balloon.balloonColor}>
                  {balloon.balloonColor}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <h4 className="font-semibold">Selected Balloon Colors:</h4>
              <ul className="list-disc flex gap-4 flex-wrap">
                {selectedBalloonColors.map((color) => {
                  const balloon = balloons.find(
                    (b) => b.balloonColor === color
                  );
                  return (
                    <li
                      key={color}
                      className="flex items-center gap-2 bg-gray-200 p-2 rounded-md"
                    >
                      <span className="flex-1">{balloon?.balloonColor} </span>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          setSelectedBalloonColors(
                            selectedBalloonColors.filter(
                              (colorName) => colorName !== color
                            )
                          )
                        }
                      >
                        <MdCancel />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

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

          {/* </div> */}
          <div className="flex justify-end gap-2 ">
            <button
              type="submit"
              className="rounded-lg bg-gray-700 px-4 py-2 text-white my-4"
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              onClick={handleCancel}
              className="rounded-lg bg-red-700 px-4 py-2 text-white my-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
