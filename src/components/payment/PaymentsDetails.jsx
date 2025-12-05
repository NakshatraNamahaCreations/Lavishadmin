// import { useState, useEffect } from "react";
// import { MdOutlineCurrencyRupee } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { IoArrowBack } from "react-icons/io5";
// import Pagination from "../Pagination"; // Adjust path if needed
// import { getAxios } from "../../utils/api";

// const PaymentsDetails = () => {
//   const [searchVal, setSearchVal] = useState("");
//   const [paymentDate, setPaymentDate] = useState("");
//   const [payments, setPayments] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const limit = 10;
//   const navigate = useNavigate();

//   // Fetch payments based on current page, search value, and booking date
//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const res = await getAxios().get("/payment", {
//         params: {
//           page: currentPage,
//           limit,
//           search: searchVal,
//           bookingDate: paymentDate,
//         },
//       });
//       // Adapt to your backend response structure
//       setPayments(res.data.data || []);
//       setTotalPages(
//         res.data.pagination
//           ? res.data.pagination.pages
//           : Math.ceil((res.data.pagination?.total || 0) / limit)
//       );
//     } catch (err) {
//       console.error("Failed to fetch payments:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch on mount, page, search, or date change
//   useEffect(() => {
//     fetchPayments();
//     // eslint-disable-next-line
//   }, [currentPage, searchVal, paymentDate]);

//   // Search handler
//   const handleSearch = () => {
//     setCurrentPage(1);
//     fetchPayments();
//   };

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
//             placeholder="Search by Order ID, Name, or Amount"
//             className="px-4 py-2 border border-gray-300 rounded-md"
//             value={searchVal}
//             onChange={(e) => setSearchVal(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           />
//           <input
//             type="date"
//             className="px-4 py-2 border border-gray-300 rounded-md"
//             value={paymentDate}
//             onChange={(e) => {
//               setPaymentDate(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//           {/* <button
//             className="bg-yellow-500 text-white px-4 py-2 rounded-md"
//             onClick={handleSearch}
//           >
//             Search
//           </button> */}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
//         {loading ? (
//           <div className="flex justify-center items-center my-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-2 text-blue-600">Loading...</span>
//           </div>
//         ) : payments.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <p className="text-lg">No payments found.</p>
//           </div>
//         ) : (
//           <table className="min-w-full table-auto border-collapse text-sm">
//             <thead>
//               <tr className="border-b bg-gray-100">
//                 <th className="px-4 py-2 text-left">SI No.</th>
//                 <th className="px-4 py-2 text-left">Booking Date</th>
//                 <th className="px-4 py-2 text-left">Order Id</th>
//                 <th className="px-4 py-2 text-left">Customer Name</th>
//                 <th className="px-4 py-2 text-left">Total Amt.</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {payments.map((payment, idx) => (
//                 <tr key={payment._id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-2">
//                     {(currentPage - 1) * limit + idx + 1}
//                   </td>
//                   <td className="px-4 py-2">
//                     {payment.createdAt
//                       ? (() => {
//                           const d = new Date(payment.createdAt);
//                           const day = String(d.getDate()).padStart(2, "0");
//                           const month = String(d.getMonth() + 1).padStart(
//                             2,
//                             "0"
//                           );
//                           const year = d.getFullYear();
//                           return `${day}-${month}-${year}`;
//                         })()
//                       : "-"}
//                   </td>
//                   <td className="px-4 py-2">{payment.orderId || "-"}</td>
//                   <td className="px-4 py-2">
//                     {payment?.orderDetails?.customerName}
//                   </td>
//                   <td className="px-4 py-2">
//                     <div className="flex items-center">
//                       <MdOutlineCurrencyRupee />
//                       {payment.amount || "-"}
//                     </div>
//                   </td>
//                   <td
//                     className={`px-4 py-2 font-medium ${
//                       payment.status === "CANCELLED"
//                         ? "text-red-700"
//                         : "text-green-500 "
//                     }`}
//                   >
//                     {payment.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={(newPage) => setCurrentPage(newPage)}
//       />
//     </div>
//   );
// };

// export default PaymentsDetails;


import { useState, useEffect } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";
import { getAxios } from "../../utils/api";

const PaymentsDetails = () => {
  const [searchVal, setSearchVal] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // FULL / HALF
  const [paymentMode, setPaymentMode] = useState(""); // ONLINE / CASH
  const [payments, setPayments] = useState([]);
  const [paymentDate, setPaymentDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 10;
  const navigate = useNavigate();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await getAxios().get("/payment", {
        params: {
          page: currentPage,
          limit,
          search: searchVal,
          paymentMethod,
          paymentMode,
          bookingDate: paymentDate,
        },
      });

      setPayments(res.data.data || []);
      setTotalPages(res.data.pagination.pages || 1);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchVal, paymentMethod, paymentMode, paymentDate]);

  const handleBackClick = () => navigate(-1);

  return (
    <div className="">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={handleBackClick} className="text-xl">
            <IoArrowBack />
          </button>
          <h2 className="text-2xl font-bold">Payments Details</h2>
        </div>

        <div className="flex gap-2">

          {/* SEARCH BAR */}
          <input
            placeholder="Search: Order ID, Customer Name, Txn ID"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* PAYMENT METHOD FILTER */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Payment Method</option>
            <option value="FULL">FULL</option>
            <option value="HALF">HALF</option>
          </select>

          {/* PAYMENT MODE FILTER */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={paymentMode}
            onChange={(e) => {
              setPaymentMode(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Payment Mode</option>
            <option value="ONLINE">ONLINE</option>
            <option value="CASH">CASH</option>
          </select>

          {/* DATE FILTER */}
          {/* <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={paymentDate}
            onChange={(e) => {
              setPaymentDate(e.target.value);
              setCurrentPage(1);
            }}
          /> */}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No payments found.
          </div>
        ) : (
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">SL</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Grand Total</th>
                <th className="px-4 py-2 text-left">Paid</th>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Mode</th>
                <th className="px-4 py-2 text-left">Txn ID</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{(currentPage - 1) * limit + idx + 1}</td>

                  <td className="px-4 py-2">
                    {new Date(p.date).toLocaleDateString("en-IN")}
                  </td>

                  <td className="px-4 py-2">{p.orderId}</td>

                  <td className="px-4 py-2">{p.customerName}</td>

                  <td className="px-4 py-2">
                    <MdOutlineCurrencyRupee className="inline" /> {p.grandTotal}
                  </td>

                  <td className="px-4 py-2 text-green-600 font-semibold">
                    <MdOutlineCurrencyRupee className="inline" /> {p.paidAmount}
                  </td>

                  <td className="px-4 py-2">{p.paymentMethod}</td>

                  <td className="px-4 py-2">{p.paymentMode}</td>

                  <td className="px-4 py-2 text-xs">{p.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default PaymentsDetails;
