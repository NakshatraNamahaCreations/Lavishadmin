// import { useState, useEffect } from "react";
// import { MdOutlineCurrencyRupee } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import { IoEyeSharp } from "react-icons/io5";
// import { FaRegEdit } from "react-icons/fa";
// import axios from "axios"; 
// import { getAxios } from "../../utils/api";

// const PaymentsDetails = () => {
//   const [searchVal, setSearchVal] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [paymentDate, setPaymentDate] = useState("");
//   const [paidAmount, setPaidAmount] = useState("");
//   const [paymentMode, setPaymentMode] = useState("");
//   const [payments, setPayments] = useState([]);
//   const [filteredPayments, setFilteredPayments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch payments data
//     const fetchPayments = async () => {
//       try {
//         const res = await getAxios().get("/payment/");
//         if (res.data.success) {
//           setPayments(res.data.data);
//           setFilteredPayments(res.data.data);
//           console.log("pay", res.data.data)
//         }
//       } catch (err) {
//         console.error("Failed to fetch payments:", err);
//       }
//     };
//     fetchPayments();
//   }, []);

//   // Filter payments by search value
//   useEffect(() => {
//     if (!searchVal) {
//       setFilteredPayments(payments);
//     } else {
//       setFilteredPayments(
//         payments.filter((p) =>
//           (p.bookingId || "").toLowerCase().includes(searchVal.toLowerCase()) ||
//           (p.customerId?.firstName + " " + p.customerId?.lastName)
//             .toLowerCase()
//             .includes(searchVal.toLowerCase())
//         )
//       );
//     }
//   }, [searchVal, payments]);

//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="">
//       {/* Header with back button */}
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-3">
//           <button onClick={handleBackClick} className="text-xl">
//             <IoArrowBack />
//           </button>
//           <h2 className="text-2xl font-bold">Payments Details</h2>
//         </div>
//         <div className="flex gap-2">
//           <input
//             placeholder="Search"
//             className="px-4 py-2 border border-gray-300 rounded-md"
//             value={searchVal}
//             onChange={(e) => setSearchVal(e.target.value)}
//           />
//           <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
//             Search
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
//         <table className="min-w-full table-auto border-collapse text-sm">
//           <thead>
//             <tr className="border-b bg-gray-100">
//               <th className="px-4 py-2 text-left">SI No.</th>
//               <th className="px-4 py-2 text-left">Booking Date</th>
//               <th className="px-4 py-2 text-left">Order Id</th>
//               <th className="px-4 py-2 text-left">Customer Name</th>
//               <th className="px-4 py-2 text-left">Total Amt.</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               {/* <th className="px-4 py-2 text-left">Action</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPayments.length === 0 ? (
//               <tr>
//                 <td colSpan={9} className="text-center py-4">
//                   No payments found.
//                 </td>
//               </tr>
//             ) : (
//               filteredPayments.map((payment, idx) => (
//                 <tr key={payment._id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-2">{String(idx + 1).padStart(2, "0")}</td>
//                   <td className="px-4 py-2">
//                     {payment.createdAt
//                       ? new Date(payment.createdAt).toLocaleDateString()
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-2">{payment.orderId || "-"}</td>
//                   <td className="px-4 py-2">
//                     {payment.customerId
//                       ? `${payment.customerId.firstName} ${payment.customerId.lastName}`
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       <MdOutlineCurrencyRupee />
//                       {payment.amount || "-"}
//                     </div>
//                   </td>
//                   <td className="px-4 py-2 text-white font-medium bg-yellow-500">
//                     {payment.status || "Partially Paid"}
//                   </td>
//                   {/* <td className="px-4 py-2">
//                     <div className="flex justify-center gap-2 items-center">
//                       <button
//                         className="text-blue-600 hover:text-gray-800 transition"
//                         // You can add a handler to view order details using payment.bookingId
//                       >
//                         <IoEyeSharp size={18} />
//                       </button>
//                       <button
//                         className="text-gray-600 hover:text-gray-800 transition"
//                         onClick={() => setShowModal(true)}
//                       >
//                         <FaRegEdit size={18} />
//                       </button>
//                     </div>
//                   </td> */}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ...existing modal code... */}
//       {/* No changes needed for modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Update Payment Details</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Payment Date</label>
//                 <input
//                   type="date"
//                   value={paymentDate}
//                   onChange={(e) => setPaymentDate(e.target.value)}
//                   className="w-full border border-gray-300 px-3 py-2 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Amount Paid</label>
//                 <input
//                   type="number"
//                   value={paidAmount}
//                   onChange={(e) => setPaidAmount(e.target.value)}
//                   className="w-full border border-gray-300 px-3 py-2 rounded-md"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Payment Mode</label>
//                 <select
//                   value={paymentMode}
//                   onChange={(e) => setPaymentMode(e.target.value)}
//                   className="w-full border border-gray-300 px-3 py-2 rounded-md"
//                 >
//                   <option value="">Select Mode</option>
//                   <option value="cash">Cash</option>
//                   <option value="card">Card</option>
//                   <option value="upi">UPI</option>
//                   <option value="bank_transfer">Bank Transfer</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                 onClick={() => {
//                   console.log({ paymentDate, paidAmount, paymentMode });
//                   setShowModal(false);
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentsDetails;



import { useState, useEffect } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { getAxios } from "../../utils/api";
import Pagination from "../Pagination"; // Adjust path if needed

const PaymentsDetails = () => {
  const [searchVal, setSearchVal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [payments, setPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const navigate = useNavigate();

  // Fetch payments based on current page and search value
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAxios().get("/payment", {
        params: {
          page: currentPage,
          limit: limit,
          search: searchVal,
        },
      });
      setPayments(res.data.data.payments || res.data.data); // adapt if your API returns {payments:[],pagination:{}} or just []
      setTotalPages(
        res.data.data.pagination
          ? res.data.data.pagination.totalPages
          : Math.ceil((res.data.data.total || 0) / limit)
      );
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on page or search change
  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [currentPage]);

  // Search handler
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPayments();
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={handleBackClick} className="text-xl">
            <IoArrowBack />
          </button>
          <h2 className="text-2xl font-bold">Payments Details</h2>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No payments found.</p>
          </div>
        ) : (
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2 text-left">SI No.</th>
                <th className="px-4 py-2 text-left">Booking Date</th>
                <th className="px-4 py-2 text-left">Order Id</th>
                <th className="px-4 py-2 text-left">Customer Name</th>
                <th className="px-4 py-2 text-left">Total Amt.</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{(currentPage - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2">
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{payment.orderId || "-"}</td>
                  <td className="px-4 py-2">
                    {payment.customerId
                      ? `${payment.customerId.firstName} ${payment.customerId.lastName}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <MdOutlineCurrencyRupee />
                      {payment.amount || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-white font-medium bg-yellow-500">
                    {payment.status || "Partially Paid"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => setCurrentPage(newPage)}
      />

      {/* ...existing modal code... */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Update Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount Paid</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                >
                  <option value="">Select Mode</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  console.log({ paymentDate, paidAmount, paymentMode });
                  setShowModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDetails;