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
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // Track the coupon being edited

  const limit = 5; // Items per page

  // Fetch coupons from the backend
  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAxios().get("/coupons/getcoupons", {
        params: { page: currentPage, limit, search: searchVal },
      });
      setData(response.data.coupons || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError("Failed to fetch coupons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentPage]);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await getAuthAxios().delete(`/coupons/delete/${id}`);
      fetchCoupons(); // Refresh the data
    } catch (error) {
      console.error("Error deleting coupon:", error);
      setError("Failed to delete coupon. Please try again later.");
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
      // endDate,
    };

    try {
      if (editingId) {
        // Update existing coupon
        await getAuthAxios().put(`/coupons/update/${editingId}`, newCoupon);
        setEditingId(null); // Reset editing state
      } else {
        // Create new coupon
        await getAuthAxios().post("/coupons/create", newCoupon);
      }

      // Reset form fields
      setCouponName("");
      setCouponCode("");
      setCouponDetails("");
      setDiscount("");
      setStartDate("");
      // setEndDate("");
      
      // Refresh the data
      fetchCoupons();
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
    setEditingId(coupon._id);
    setCouponName(coupon.couponName);
    setCouponCode(coupon.couponCode);
    setCouponDetails(coupon.couponDetails);
    setDiscount(coupon.discount);
    setStartDate(new Date(coupon.startDate).toISOString().split("T")[0]);
    // setEndDate(
    //   coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : ""
    // );
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="py-2 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {editingId ? "Edit Coupon" : "Create Coupon"}
      </h1>
      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
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

          {/* <label className="font-medium text-gray-700 ">
            Expiry Date:
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
                    className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </label> */}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <input
            type="submit"
            value={loading ? "Processing..." : editingId ? "Update" : "Submit"}
            className="cursor-pointer bg-yellow-500 text-white font-semibold  px-3 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
          />
        </div>
      </form>

      <div className="m-4">
        <div className="my-4 flex gap-2">
          <input
            placeholder="Search"
            className="px-4 py-2 border-2 rounded-md w-[30%]"
            value={searchVal}
            onChange={handleSearch}
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={fetchCoupons}
          >
            Search
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <div className="flex justify-center items-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600">Loading...</span>
            </div>
          ) : data.length > 0 ? (
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
                  {/* <th className="px-4 py-2 text-left cursor-pointer">
                    Expiry Date
                  </th> */}
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold">
                      {(currentPage - 1) * limit + idx + 1}
                    </td>
                    <td className="px-4 py-2">{item.couponName}</td>
                    <td className="px-4 py-2">{item.couponCode}</td>
                    <td className="px-4 py-2 w-[25%]">{item.couponDetails}</td>
                    <td className="px-4 py-2">
                      {new Date(item.startDate).toLocaleDateString("en-CA")}
                    </td>
                    {/* <td className="px-4 py-2">
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString("en-CA")
                        : "__"}
                    </td> */}
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
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No coupons found.</p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
};

export default CouponCreations;
