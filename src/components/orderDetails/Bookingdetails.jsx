// import { useEffect, useState } from "react";
// import { orderData } from "../json/data"
// import Pagination from "./Pagination";
// import { MdOutlineCurrencyRupee } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";

// const Orderdetails = () => {
//     const [orderData, setOrderData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [searchVal, setSearchVal] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);

//     const limit = 5;
//     const navigate = useNavigate();

//     const handleRowClick = (orderid) => {
//         navigate(`/order/${orderid}`);
//     };

//     const fectchbySearch = async () => {
//         setLoading(true);
//         setError("");
//         try {
//             const response = await axios.get("http://localhost:5000/api/admin/orders/paginated", {
//                 params: {
//                     search: searchVal
//                 }
//             })
//             console.log(response.data.data);
//             setOrderData(response.data.data.orders);
//             setTotalPages(response.data.data.pagination.totalPages);
//         } catch (error) {
//             console.log(error);
//             setError(error.message);

//         } finally {
//             setLoading(false)
//         }
//     }
//     const fetchData = async () => {
//         setLoading(true);
//         setError("");
//         try {
//             // const response = await axios.get(`http://localhost:5000/api/admin/orders/`);
//             const response = await axios.get(`http://localhost:5000/api/admin/orders/paginated`, {
//                 params: {
//                     page: currentPage,
//                     limit: limit,
//                     search: searchVal
//                 }
//             });
//             console.log(response.data.data);
//             setOrderData(response.data.data.orders);
//             setTotalPages(response.data.data.pagination.totalPages);
//         } catch (error) {
//             setError(error.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         fetchData();
//     }, [currentPage, limit]);

//     // Handle page change
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     const handleSearch = (e) => {
//         setSearchVal(e.target.value);
//         setCurrentPage(1);
//     };
//     return (
//         <div className="m-4">
//             <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//             <div className='my-4 flex gap-2'>
//                 <input
//                     placeholder='Search'
//                     className='px-4 py-2 border-2 rounded-md w-[30%]'
//                     value={searchVal}
//                     onChange={handleSearch}
//                 />
//                 <button className='bg-yellow-500 text-white px-4 py-2 rounded-md' onClick={fectchbySearch}>Search</button>
//             </div>
//             <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
//                 <table className="min-w-full table-auto border-collapse">
//                     <thead>
//                         <tr className="border-b bg-gray-100">
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                             >
//                                 SI No.
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                             >
//                                 Order Id
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                             >
//                                 Customer name
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                             >
//                                 Order Date
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                             >
//                                 Total Amount
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                             >
//                                 Status
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {orderData.map((item, idx) => (
//                             <tr key={item._id} className="border-b hover:bg-gray-50" onClick={() => handleRowClick(item?._id)}>
//                                 <td className="px-4 py-2 font-bold">{idx + 1} </td>
//                                 <td className="px-4 py-2">{item?.orderId}</td>
//                                 <td className="px-4 py-2">{item?.customerId?.firstName} {item?.customerId?.lastName}</td>
//                                 <td className="px-4 py-2">{new Date(item?.createdAt).toLocaleDateString('en-CA')}</td>
//                                 <td className="px-4 py-2 flex items-center "><MdOutlineCurrencyRupee /> {item?.totalPrice}</td>
//                                 <td className="px-4 py-2">{item?.status}</td>
//                             </tr>
//                         ))}

//                         {!loading && orderData.length === 0 && (
//                             <tr>
//                                 <td colSpan="8" className="text-center py-4">
//                                     No data found
//                                 </td>
//                             </tr>
//                         )}

//                     </tbody>
//                 </table>

//                 <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
//             </div>
//         </div>
//     )
// }

// export default Orderdetails;

// import { useEffect, useState } from "react";
// import { MdOutlineCurrencyRupee } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { IoArrowBack,IoEyeSharp } from "react-icons/io5"; 
// import axios from "axios";

// const Bookingdetails = () => {
//   const [orderData, setOrderData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [searchVal, setSearchVal] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   const limit = 5;
//   const navigate = useNavigate();

//   // Handle page change
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSearch = (e) => {
//     setSearchVal(e.target.value);
//     setCurrentPage(1);
//   };

//   // Handle back button click
//   const handleBackClick = () => {
//     navigate(-1); // Navigate back to the previous route
//   };

//   return (
//     <div className="">
//       {/* Back Button */}
//       <div className="flex items-center mb-4">
//         <button
//           onClick={handleBackClick}
//           className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-300 px-2 py-1 rounded-xl"
//         >
//           <IoArrowBack size={20} />
//           Back
//         </button>
//       </div>
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold mb-4">Order Details</h2>
//         <div className="my-4 flex gap-2">
//           <input
//             placeholder="Search"
//             className="px-4 py-2 border-2 rounded-md "
//             value={searchVal}
//             // onChange={handleSearch}
//           />
//           <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
//             Search
//           </button>
//         </div>
//       </div>
//       <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
//         <table className="min-w-full table-auto border-collapse text-sm">
//           <thead>
//             <tr className="border-b bg-gray-100">
//               <th className="px-4 py-2 text-left cursor-pointer">SI No.</th>
//               <th className="px-4 py-2 text-left cursor-pointer">Order Id</th>
//               <th className="px-4 py-2 text-left cursor-pointer">
//                 Cust. name
//               </th>
//               <th className="px-4 py-2 text-left cursor-pointer">Order Date</th>
//               <th className="px-4 py-2 text-left cursor-pointer">Event Date</th>
//               {/* <th className="px-4 py-2 text-left cursor-pointer">Service Ordered</th> */}
//               <th className="px-4 py-2 text-left cursor-pointer">
//                 Total Amount
//               </th>
//               <th className="px-4 py-2 text-left cursor-pointer">Status</th>
//               <th className="px-4 py-2 text-left cursor-pointer">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="border-b hover:bg-gray-50">
//               <td className="px-4 py-2 font-bold">01 </td>
//               <td className="px-4 py-2">2434242</td>
//               <td className="px-4 py-2">Sonali Keshri</td>
//               <td className="px-4 py-2">05-05-2025</td>
//               <td className="px-4 py-2">20-05-2025</td>
//               {/* <td className="px-4 py-2">Unicorn mermaid Theme decor</td> */}
//               <td className="px-4 py-2 flex items-center ">
//                 <MdOutlineCurrencyRupee />
//                 2999
//               </td>
//               <td className="px-4 py-2">Shipped</td>
//               <td className="px-4 py-2">
//                 <IoEyeSharp size={18} />
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Bookingdetails;

import { useEffect, useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import Pagination from "../Pagination";

const Bookingdetails = () => {
  const { date } = useParams(); // Extract date from URL params
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [searchInput, setSearchInput] = useState(""); // For typing
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 5; // Number of orders per page
  const navigate = useNavigate();

  // Fetch orders based on the date, search term, and pagination
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/getordersbystatus/`, {
          params: {
            eventDate: date,
            search: searchVal, // <-- This only updates when button is clicked
            page: currentPage,
            limit: limit,
            status: "created"
          },
        });

        setOrderData(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [date, searchVal, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page
  };


  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous route
  };

  return (
    <div className="">
      {/* Back Button */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleBackClick}
          className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-300 px-2 py-1 rounded-xl"
        >
          <IoArrowBack size={20} />
          Back
        </button>
      </div>
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold mb-4">Order Details for {date}</h2>
        <div className="my-4 flex gap-2 ">
          <input
            placeholder="Search by order Id or customer name"
            className="px-4 py-2 border-2 rounded-md min-w-[300px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} 
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setSearchVal(searchInput);
              setCurrentPage(1);     
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Display Order Data */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left cursor-pointer">SI No.</th>
              <th className="px-4 py-2 text-left cursor-pointer">Order Id</th>
              <th className="px-4 py-2 text-left cursor-pointer">Cust. name</th>
              <th className="px-4 py-2 text-left cursor-pointer">Event Date</th>
              <th className="px-4 py-2 text-left cursor-pointer">Total Amount</th>
              <th className="px-4 py-2 text-left cursor-pointer">Status</th>
              <th className="px-4 py-2 text-left cursor-pointer">Action</th>
            </tr>
          </thead>
          <tbody>
            {orderData && orderData.length > 0 ? (
              orderData.map((order, index) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">{index + 1}</td>
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.eventDate}</td>
                  <td className="px-4 py-2 flex items-center">
                    <MdOutlineCurrencyRupee />
                    {order.grandTotal}
                  </td>
                  <td className="px-4 py-2">{order.orderStatus}</td>
                  <td className="px-4 py-2">
                    <Link to={`/orderdetails/details/${order._id}`}>  <IoEyeSharp size={18} /></Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-4 py-2">
                  No orders found for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />}

    </div>
  );
};

export default Bookingdetails;
