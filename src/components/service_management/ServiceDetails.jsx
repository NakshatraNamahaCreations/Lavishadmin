// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";


// const ServiceDetails = () => {
//   const { serviceId } = useParams();
//   const navigate = useNavigate();
//   const [service, setService] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchServiceDetails = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/services/${serviceId}`
//       );
//       setService(response.data.data);
//     } catch (error) {
//       console.error("Error fetching service details:", error.message);
//       setError("Failed to load service details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServiceDetails();
//   }, [serviceId]);

//   if (loading) {
//     return (
//       <div className="text-center mt-20 text-lg text-gray-600 animate-pulse">
//         Loading service details...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center mt-20 text-red-600 text-lg flex items-center justify-center gap-2">
//         {error}
//       </div>
//     );
//   }

//   if (!service) {
//     return (
//       <div className="text-center mt-20 text-gray-500 text-lg">
//         No service found.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-6 px-4 md:px-10">
//       <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 relative">


//         <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
//           {service.serviceName}
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base mb-6">
//           <Detail label="Category" value={service.categoryId?.category} />
//           <Detail label="Subcategory" value={service.subCategoryId?.subCategory} />
//           <Detail label="Sub-Subcategory" value={service.subSubCategoryId?.subSubCategory} />
//           <Detail label="Theme" value={service.themeId?.theme} />
//           <Detail label="Original Price" value={`₹${service.originalPrice}`} />
//           <Detail label="Offer Price" value={`₹${service.offerPrice}`} />
//           <Detail
//             label="Balloon Colors"
//             value={service.balloonColors.length ? service.balloonColors.join(", ") : "N/A"}
//           />
//           {/* <div>
//             <h4 className="text-gray-700 font-medium">Balloon Colors</h4>
//             <ul>
//               {service.balloonColors.length > 0 ? (
//                 service.balloonColors.map((color) => {
//                   return (
//                     <li>{color}</li>
//                   )
//                 })
//               ) : (
//                 <p>No Balloons Color</p>
//               )

//               }
//               <li></li>
//             </ul>
//           </div> */}
//           {/* <Detail
//             label="Customized Inputs"
//             value={service.customizedInputs.length ? service.customizedInputs.join(", ") : "N/A"}
//           /> */}

//           {
//             service.customizedInputs.length > 0 ? (
//               <div>
//                 <h4 className="text-gray-700 font-semibold mb-2">Customized Inputs</h4>
//                 <table className="min-w-full table-auto border border-gray-200 text-sm text-left">
//                   <thead className="bg-gray-600 text-white uppercase text-xs tracking-wider">
//                     <tr>
//                       <th className="px-6 py-2">Field Name</th>
//                       <th className="px-6 py-2">Field Type</th>
//                       <th className="px-6 py-2">Max Value</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {service.customizedInputs.map((item, index) => (
//                       <tr key={index} className="hover:bg-gray-100 transition">
//                         <td className="px-6 py-2 text-gray-900">{item.label}</td>
//                         <td className="px-6 py-2 text-gray-900">{item.inputType}</td>
//                         <td className="px-6 py-2 text-gray-900">
//                           {item.maxValue !== undefined ? item.maxValue : "N/A"}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div>
//                 <h4 className="text-gray-700 font-semibold">Customized Inputs</h4>
//                 <p className="text-gray-500">No Customized Inputs</p>
//               </div>
//             )
//           }

//         </div>

//         <Section title="📦 Package Details" html={service.packageDetails} />
//         <Section title="📝 Required Details" html={service.requiredDetails} />

//         <div className="mt-10">
//           <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
//             {/* <PhotoIcon className="h-6 w-6 text-indigo-600" /> */}
//             Service Images
//           </h3>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {service.images.length > 0 ? (
//               service.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={`http://localhost:5000/images/${image}`}
//                   alt={`Service ${index}`}
//                   className="w-full h-auto object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
//                 />
//               ))
//             ) : (
//               <p className="text-gray-500">No images available.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Detail = ({ label, value }) => (
//   <div>
//     <h4 className="text-gray-700 font-medium">{label}</h4>
//     <p className="text-gray-900">{value || "N/A"}</p>
//   </div>
// );

// const Section = ({ title, html, icon: Icon }) => (
//   <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-inner">
//     <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
//       {title}
//     </h3>
//     <div
//       className="text-gray-700 leading-relaxed"
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   </div>
// );

// export default ServiceDetails;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAxios } from "../../utils/api";


const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchServiceDetails = async () => {
    setLoading(true);
    try {
      const response = await getAxios().get(
        `/services/${serviceId}`
      );
      setService(response.data.data);
    } catch (error) {
      console.error("Error fetching service details:", error.message);
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-600 animate-pulse">
        Loading service details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg flex items-center justify-center gap-2">
        {error}
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        No service found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 py-6 px-4 md:px-10">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 relative">


        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
          {service.serviceName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base mb-6">
          <Detail label="Category" value={service.categoryId?.category} />
          <Detail label="Subcategory" value={service.subCategoryId?.subCategory} />
          <Detail label="Sub-Subcategory" value={service.subSubCategoryId?.subSubCategory} />
          <Detail label="Theme" value={service.themeId?.theme} />
          <Detail label="Original Price" value={`₹${service.originalPrice}`} />
          <Detail label="Offer Price" value={`₹${service.offerPrice}`} />
          <Detail
            label="Balloon Colors"
            value={service.balloonColors.length ? service.balloonColors.join(", ") : "N/A"}
          />
                {
            service.customizedInputs.length > 0 ? (
              <div>
                <h4 className="text-gray-700 font-semibold mb-2">Customized Inputs</h4>
                <table className="min-w-full table-auto border border-gray-200 text-sm text-left">
                  <thead className="bg-gray-600 text-white uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-2">Field Name</th>
                      <th className="px-6 py-2">Field Type</th>
                      <th className="px-6 py-2">Max Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {service.customizedInputs.map((item, index) => (
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
            ) : (
              <div>
                <h4 className="text-gray-700 font-semibold">Customized Inputs</h4>
                <p className="text-gray-500">No Customized Inputs</p>
              </div>
            )
          }

        </div>

        <Section title="📦 Package Details" html={service.packageDetails} />
        <Section title="📝 Required Details" html={service.requiredDetails} />

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            {/* <PhotoIcon className="h-6 w-6 text-indigo-600" /> */}
            Service Images
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {service.images.length > 0 ? (
              service.images.map((image, index) => (
                <img
                  key={index}
                  src={`${image}`}
                  alt={`Service ${index}`}
                  className="w-full h-auto object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                />
              ))
            ) : (
              <p className="text-gray-500">No images available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <h4 className="text-gray-700 font-medium">{label}</h4>
    <p className="text-gray-900">{value || "N/A"}</p>
  </div>
);

const Section = ({ title, html, icon: Icon }) => (
  <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-inner">
    <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
      {title}
    </h3>
    <div
      className="text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </div>
);

export default ServiceDetails;
