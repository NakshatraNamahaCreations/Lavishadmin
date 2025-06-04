// import { useState } from "react";
// import { coupons } from "../json/data";
// import Pagination from "./Pagination";

// const CouponCreations = () => {
//     // State for coupon form inputs
//     const [couponName, setCouponName] = useState("");
//     const [couponCode, setCouponCode] = useState("");
//     const [couponDetails, setCouponDetails] = useState("");
//     const [discount, setDiscount] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     // State for filtered coupons, search, and pagination
//     const [data, setData] = useState(coupons);
//     const [searchVal, setSearchVal] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);

//     // Handle delete
//     const handleDelete = (id) => {
//         const updatedData = data.filter((item) => item.id !== id);
//         setData(updatedData);
//     };

//     // Handle search
//     const filteredData = data.filter(item => {
//         return (
//             (item.couponName && item.couponName.toLowerCase().includes(searchVal.toLowerCase())) ||
//             (item.couponCode && item.couponCode.toLowerCase().includes(searchVal.toLowerCase()))
//         );
//     });

//     // Pagination logic
//     const indexOfLastItem = currentPage * 5;
//     const indexOfFirstItem = indexOfLastItem - 5;
//     const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredData.length / 5);

//     // Handle page change
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const newCoupon = {
//             id: Date.now().toString(),
//             couponName,
//             couponCode,
//             couponDetails,
//             discount,
//             startDate,
//             endDate,
//         };

//         setData([...data, newCoupon]);

//         setCouponName("");
//         setCouponCode("");
//         setCouponDetails("");
//         setDiscount("");
//         setStartDate("");
//         setEndDate("");
//     };

//     return (
//         <div className="py-2 bg-gray-50 rounded-lg shadow-md">
//             <h1 className="text-3xl font-bold mb-6 text-center">Coupon</h1>
//             <form className="bg-white p-6" onSubmit={handleSubmit}>
//                 <div className="gap-6 grid grid-cols-3">
//                     <label className="font-semibold ">
//                         Coupon Name:
//                         <input
//                             value={couponName}
//                             onChange={(e) => setCouponName(e.target.value)}
//                             placeholder="Enter Coupon Name"
//                             className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
//                         />
//                     </label>

//                     <label className="font-semibold ">
//                         Discount Percentage:
//                         <input
//                             value={discount}
//                             onChange={(e) => setDiscount(e.target.value)}
//                             placeholder="Enter Discount Percentage"
//                             className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
//                         />
//                     </label>

//                     <label className="font-semibold ">
//                         Coupon Code:
//                         <input
//                             value={couponCode}
//                             onChange={(e) => setCouponCode(e.target.value)}
//                             placeholder="Enter Coupon Code"
//                             className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
//                         />
//                     </label>

//                     <label className="font-semibold ">
//                         Coupon Details:
//                         <input
//                             value={couponDetails}
//                             onChange={(e) => setCouponDetails(e.target.value)}
//                             placeholder="Enter Coupon Details"
//                             className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
//                         />
//                     </label>

//                     <label className="font-semibold ">
//                         Start Date:
//                         <input
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             type="date"
//                             className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
//                         />
//                     </label>

//                     <label className="font-semibold ">
//                         End Date:
//                         <input
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             type="date"
//                             className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
//                         />
//                     </label>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-end mt-4">
//                     <input
//                         type="submit"
//                         value="Submit"
//                         className="cursor-pointer bg-yellow-500 text-white font-semibold  px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
//                     />
//                 </div>
//             </form>

//             <div className="m-4">
//                 <div className="my-4">
//                     <input
//                         placeholder="Search"
//                         className="px-4 py-2 border-2 rounded-md w-[30%]"
//                         onChange={(e) => setSearchVal(e.target.value)}
//                     />
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <table className="min-w-full table-auto border-collapse">
//                         <thead>
//                             <tr className="border-b bg-gray-100">
//                                 <th className="px-4 py-2 text-left cursor-pointer">SI No.</th>
//                                 <th className="px-4 py-2 text-left cursor-pointer">Coupon Name</th>
//                                 <th className="px-4 py-2 text-left cursor-pointer">Coupon Code</th>
//                                 <th className="px-4 py-2 text-left cursor-pointer">Status</th>
//                                 <th className="px-4 py-2 text-left cursor-pointer">Start Date</th>
//                                 <th className="px-4 py-2 text-left cursor-pointer">End Date</th>
//                                 <th className="px-4 py-2 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {currentData.map((item, idx) => (
//                                 <tr key={idx} className="border-b hover:bg-gray-50">
//                                     <td className="px-4 py-2 font-bold">{indexOfFirstItem + idx + 1}</td>
//                                     <td className="px-4 py-2">{item.couponName}</td>
//                                     <td className="px-4 py-2">{item.couponCode}</td>
//                                     <td className={`px-4 py-2 ${item.status === "Active" ? "text-green-600":"text-red-600"} font-medium`}>{item.status}</td>
//                                     <td className="px-4 py-2">{new Date(item.startDate).toLocaleDateString('en-CA')}</td>
//                                     <td className="px-4 py-2">{new Date(item.endDate).toLocaleDateString('en-CA')}</td>
//                                     <td className="px-4 py-2">
//                                         <div className="flex space-x-2">
//                                         <button
//                                                 onClick={() => handleDelete(item.id)}
//                                                 className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700"
//                                             >
//                                                 Edit
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(item.id)}
//                                                 className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-700"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
//             </div>
//         </div>
//     );
// };

// export default CouponCreations;

import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { getAuthAxios, getAxios } from "../utils/api";

const CouponCreations = () => {
  // State for coupon form inputs
  const [couponName, setCouponName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDetails, setCouponDetails] = useState("");
  const [discount, setDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State for coupons, search, pagination, loading, error, and editing
  const [data, setData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // Track the coupon being edited

  const limit = 5; // Items per page

  // Fetch coupons from the backend
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAxios().get(
          "https://api.lavisheventzz.com/api/coupons/getcoupons",
          {
            params: { page: currentPage, limit },
          }
        );
        setData(response.data.coupons);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setError("Failed to fetch coupons. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [currentPage]);

  // Handle delete
  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await getAuthAxios().delete(`https://api.lavisheventzz.com/api/coupons/delete/${id}`);
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
      setError("Failed to delete coupon. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newCoupon = {
      couponName,
      couponCode,
      couponDetails,
      discount,
      startDate,
      endDate,
    };

    try {
      if (editingId) {
        // Update existing coupon
        await getAuthAxios().put(
          `https://api.lavisheventzz.com/api/coupons/update/${editingId}`,
          newCoupon
        );
        setData(
          data.map((item) =>
            item._id === editingId ? { ...item, ...newCoupon } : item
          )
        );
        setEditingId(null); // Reset editing state
      } else {
        // Create new coupon
        const response = await getAuthAxios().post(
          "https://api.lavisheventzz.com/api/coupons/create",
          newCoupon
        );
        setData([...data, response.data]);
      }

      // Reset form fields
      setCouponName("");
      setCouponCode("");
      setCouponDetails("");
      setDiscount("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error(
        editingId ? "Error updating coupon:" : "Error creating coupon:",
        error
      );
      setError(
        editingId
          ? "Failed to update coupon. Please try again later."
          : "Failed to create coupon. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (coupon) => {
    setEditingId(coupon._id); // Set the coupon being edited
    setCouponName(coupon.couponName);
    setCouponCode(coupon.couponCode);
    setCouponDetails(coupon.couponDetails);
    setDiscount(coupon.discount);
    setStartDate(new Date(coupon.startDate).toISOString().split("T")[0]);
    setEndDate(
      coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : ""
    );
  };

  // Handle search
  const filteredData = data.filter((item) => {
    return (
      (item.couponName &&
        item.couponName.toLowerCase().includes(searchVal.toLowerCase())) ||
      (item.couponCode &&
        item.couponCode.toLowerCase().includes(searchVal.toLowerCase()))
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * limit;
  const indexOfFirstItem = indexOfLastItem - limit;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / limit);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-2 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {editingId ? "Edit Coupon" : "Create Coupon"}
      </h1>
      <form className="bg-white p-6" onSubmit={handleSubmit}>
        <div className="gap-6 grid grid-cols-3">
          <label className="font-medium text-gray-700 ">
            Coupon Name<span className="text-red-600"> *</span>
            <input
              value={couponName}
              onChange={(e) => setCouponName(e.target.value)}
              placeholder="Enter Coupon Name"
                     className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="font-medium text-gray-700 ">
            Discount Percentage<span className="text-red-600"> *</span>
            <input
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter Discount Percentage"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="font-medium text-gray-700 ">
            Coupon Code<span className="text-red-600"> *</span>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code"
                      className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="font-medium text-gray-700 ">
            Coupon Details<span className="text-red-600"> *</span>
            <input
              value={couponDetails}
              onChange={(e) => setCouponDetails(e.target.value)}
              placeholder="Enter Coupon Details"
                      className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="font-medium text-gray-700 ">
            Start Date<span className="text-red-600"> *</span>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
                      className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label>

          <label className="font-medium text-gray-700 ">
            Expiry Date:
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <input
            type="submit"
            value={editingId ? "Update" : "Submit"}
            className="cursor-pointer bg-yellow-500 text-white font-semibold  px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
          />
        </div>
      </form>

      <div className="m-4">
        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {/* <div className="my-4">
          <input
            placeholder="Search"
            className="px-4 py-2 border-2 rounded-md w-[30%]"
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div> */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {filteredData.length > 0 ? (
            <table className="min-w-full table-auto border-collapse text-sm">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-2 text-left cursor-pointer">SI No.</th>
                  <th className="px-4 py-2 text-left cursor-pointer">
                    Coupon Name
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer">
                    Coupon Code
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer">
                    Coupon Details
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer">
                    Start Date
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer">
                    Expiry Date
                  </th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, idx) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold">
                      {indexOfFirstItem + idx + 1}
                    </td>
                    <td className="px-4 py-2">{item.couponName}</td>
                    <td className="px-4 py-2">{item.couponCode}</td>
                    <td className="px-4 py-2 w-[25%]">{item.couponDetails}</td>
                    <td className="px-4 py-2">
                      {new Date(item.startDate).toLocaleDateString("en-CA")}
                    </td>
                    <td className="px-4 py-2">
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("en-CA")
                        : "__"}
                    </td>
                    <td className=" py-2 w-[10%]">
                      <div className="flex justify-center gap-2">
                        <button
                          className="text-gray-600 hover:text-gray-800 transition"
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition"
                          onClick={() => handleDelete(item._id)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && (
              <p className="text-center text-gray-500">No coupons found.</p>
            )
          )}
        </div>

        {filteredData.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CouponCreations;
