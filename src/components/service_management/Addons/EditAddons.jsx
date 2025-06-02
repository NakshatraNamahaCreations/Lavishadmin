import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAuthAxios, getAxios, getUploadAxios } from "../../../utils/api";

const EditAddons = () => {
  const navigate = useNavigate();
  const { addonId } = useParams();

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
    maxValue: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState([]);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchAddonDetails = async () => {
    try {
      const { data } = await getAxios().get(`/addons/${addonId}`);
      const addonData = data.data;

      setSubCategory(addonData.subCategory?._id || "");
      setAddonsName(addonData.addonsName || "");
      setPrice(addonData.price || "");
      setSamedaydelivery(addonData.samedaydelivery || "");
      setAddonsDescription(addonData.addonsDescription || "");
      setCustomizedInputs(addonData.customizedInputs || []);
      setImage(addonData.image || "")
      setImagePreview(addonData.image ? `${addonData.image}` : "");
    } catch (err) {
      console.error("Addon fetch failed:", err);
      setError("Failed to fetch addon details.");
    }
  };


  const fetchSubcategory = async () => {
    try {
      const { data } = await getAxios().get("/subcategories/");
      setSubCategories(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch subcategories.");
    }
  };

  useEffect(() => {
    fetchAddonDetails();
    fetchSubcategory();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCustomizedInput = () => {
    const { label, inputType, maxValue } = customizedInput;
    if (label && inputType) {
      setCustomizedInputs([...customizedInputs, customizedInput]);
      setCustomizedInput({ label: "", inputType: "", maxValue: "" });
    } else {
      alert("Please fill all input fields");
    }
  };

  const handleRemoveCustomizedInput = (index) => {
    const updatedInputs = customizedInputs.filter((_, i) => i !== index);
    setCustomizedInputs(updatedInputs);
  };

  const resetForm = () => {
    setSubCategory("");
    setAddonsName("");
    setImage(null);
    setImagePreview("");
    setPrice("");
    setSamedaydelivery("");
    setAddonsDescription("");
    setCustomizedInputs([]);
    setCustomizedInput({ label: "", inputType: "", maxValue: "" });
    setError("");
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategory || !addonsName || !price || !samedaydelivery || !addonsDescription) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("subCategory", subCategory);
    formData.append("addonsName", addonsName);
    formData.append("price", price);
    formData.append("samedaydelivery", samedaydelivery);
    formData.append("addonsDescription", addonsDescription);
    formData.append("customizedInputs", JSON.stringify(customizedInputs));
    formData.append("image", image);

    try {
      const authAxios = getAuthAxios();
      const res = await authAxios.put(`/addons/update/${addonId}`, formData);

      if (res.status === 200) {
        alert("Addon updated successfully!");
        resetForm();
        navigate("/addons/addons-list");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update addon.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    resetForm();
    navigate("/addons/addons-list");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Addon</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label>Sub Category *</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Sub Category</option>
                {subCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.subCategory}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Addon Name *</label>
              <input
                type="text"
                value={addonsName}
                onChange={(e) => setAddonsName(toTitleCase(e.target.value))}
                className="w-full border rounded p-2"
                placeholder="Addon Name"
              />
            </div>

            <div>
              <label>Price *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Addon Image URL <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={image}
                placeholder="Enter Image URL"
                onChange={(e) => {
                  setImage(e.target.value);
                  setImagePreview(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label>Same Day Delivery *</label>
              <select
                value={samedaydelivery}
                onChange={(e) => setSamedaydelivery(toTitleCase(e.target.value))}
                className="w-full border rounded p-2"
              >
                <option value="">Select Option</option>
                <option value="Possible">Possible</option>
                <option value="Not Possible">Not Possible</option>
              </select>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                onClick={() => {
                  setImage("");
                  setImagePreview("");
                }}
              >
                <MdCancel />
              </button>
            </div>
          )}

          <div className="my-4">
            <label>Addons Description *</label>
            <CKEditor
              editor={ClassicEditor}
              data={addonsDescription}
              onChange={(e, editor) => setAddonsDescription(editor.getData())}
            />
          </div>

          <div className="my-6">
            <h3 className="text-lg font-semibold mb-3">Customized Input Details</h3>

            {/* Add New Input */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={customizedInput.label}
                onChange={(e) => setCustomizedInput({ ...customizedInput, label: e.target.value })}
                placeholder="Field Label"
                className="border p-2 rounded"
              />
              <select
                value={customizedInput.inputType}
                onChange={(e) => setCustomizedInput({ ...customizedInput, inputType: e.target.value })}
                className="border p-2 rounded"
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
                value={customizedInput.maxValue}
                onChange={(e) => setCustomizedInput({ ...customizedInput, maxValue: e.target.value })}
                placeholder="Max Value"
                className="border p-2 rounded"
              />
              <div className="col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCustomizedInput}
                  className="bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-1"
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>

            {/* Editable Inputs */}
            {customizedInputs.map((input, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center mb-2">
                <input
                  type="text"
                  value={input.label}
                  onChange={(e) => {
                    const updated = [...customizedInputs];
                    updated[index].label = e.target.value;
                    setCustomizedInputs(updated);
                  }}
                  placeholder="Label"
                  className="border p-2 rounded"
                />
                <select
                  value={input.inputType}
                  onChange={(e) => {
                    const updated = [...customizedInputs];
                    updated[index].inputType = e.target.value;
                    setCustomizedInputs(updated);
                  }}
                  className="border p-2 rounded"
                >
                  <option value="">Type</option>
                  <option value="radio">Radio</option>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </select>
                <input
                  type="number"
                  value={input.maxValue}
                  onChange={(e) => {
                    const updated = [...customizedInputs];
                    updated[index].maxValue = e.target.value;
                    setCustomizedInputs(updated);
                  }}
                  placeholder="Max Value"
                  className="border p-2 rounded"
                />
                <div className="col-span-3 flex justify-end">
                  <button
                    type="button"
                    className="text-red-600 flex items-center gap-1"
                    onClick={() => handleRemoveCustomizedInput(index)}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
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

export default EditAddons;
