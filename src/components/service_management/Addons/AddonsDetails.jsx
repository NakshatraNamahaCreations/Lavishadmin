import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAxios } from "../../../utils/api";

const AddonsDetails = () => {
  const { addonId } = useParams();
  const navigate = useNavigate();
  const [addon, setAddon] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("custome", addon?.customizedInputs[0]?.inputType)

  // Fetch addon details
  const fetchAddonDetails = async () => {
    setLoading(true);
    try {
      const response = await getAxios().get(`/addons/${addonId}`);
      setAddon(response.data.data);
      console.log("addon", response.data.data);
    } catch (error) {
      console.error("Error fetching addon details:", error.message);
      setError("Failed to load addon details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddonDetails();
  }, [addonId]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-600 animate-pulse">
        Loading addon details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!addon) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        No addon found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
          Addon Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base">
          <Detail label="Addon Name" value={addon.addonsName} />
          <Detail label="Subcategory" value={addon.subCategory?.subCategory} />
          <Detail label="Price" value={`₹${addon.price}`} />
          <Detail label="Same Day Delivery" value={addon.samedaydelivery} />
          {/* <Detail
            label="Customized Inputs"
            value={
              addon.customizedInputs.length > 0 ? (
                <ul className="list-disc pl-5">
                  {addon.customizedInputs.map((input, index) => (
                    <li key={index} className="text-gray-600">
                      {input}
                    </li>
                  ))}
                </ul>
              ) : (
                "N/A"
              )
            }
          /> */}

          {
            addon.customizedInputs.length > 0 ?
              <div>
                <h4 className="text-gray-700 font-semibold">Customized Inputs</h4>
                <table class="min-w-full table-auto border border-gray-200 text-sm text-left mt-5 ">

                  <thead class="bg-gray-600 text-white uppercase text-xs tracking-wider">
                    <tr>
                      <th class="px-6 py-1">Field Name</th>
                      <th class="px-6 py-1">Field Type</th>
                      <th class="px-6 py-1">Max Value</th>
                    </tr>
                  </thead>

                  <tbody class="bg-white divide-y divide-gray-200">
                    {addon.customizedInputs.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-100 transition">
                        <td className="px-6 py-2 text-gray-900">{item.label}</td>
                        <td className="px-6 py-2 text-gray-900">{item.inputType}</td>
                        <td className="px-6 py-2 text-gray-900">
                          {item.maxValue !== undefined ? item.maxValue : "N/A"}
                        </td>
                      </tr>
                    ))}
                   
                  </tbody>
                </table>
              </div>
              :
              <div>
                <h4 className="text-gray-700 font-semibold">Customized Inputs</h4>
                <p>No Customized Inputs</p>
              </div>
          }

        </div>

        <Section title="📝 Addon Description" html={addon.addonsDescription} />

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🖼 Addon Image</h3>
          {addon.image ? (
            <img
              src={`http://localhost:5000/images/${addon.image}`}
              alt={addon.addonsName}
              className="w-32 h-32 object-cover rounded-md shadow"
            />
          ) : (
            <p className="text-gray-500">No image available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <h4 className="text-gray-700 font-semibold">{label}</h4>
    <div className="bg-gray-200 p-2 my-2 rounded-lg">{value || "N/A"}</div>
  </div>
);

const Section = ({ title, html }) => (
  <div className="mt-8 bg-gray-200 p-2 my-2 rounded-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <div
      className="text-gray-800 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
);

export default AddonsDetails;


