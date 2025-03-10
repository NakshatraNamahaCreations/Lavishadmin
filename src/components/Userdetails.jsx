// import React, { useState } from 'react';
// import { userData } from "../json/UserData"

// const Userdetails = () => {
//     // Sample data for the table
//     const [data, setData] = useState(userData);
//     const [searchVal, setSearchVal] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [rowsPerPage, setRowsPerPage] = useState(8);
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

//     const handleDelete = (id) => {
//         const updatedData = data.filter((item) => item.id !== id);
//         setData(updatedData);
//     };

//     const handleBlock = (id) => {
//         alert(`User with ID: ${id} has been blocked.`);
//     };

//     // Sorting function
//     const sortedData = React.useMemo(() => {
//         let sortableItems = [...data];
//         if (sortConfig.key !== null) {
//             sortableItems.sort((a, b) => {
//                 if (a[sortConfig.key] < b[sortConfig.key]) {
//                     return sortConfig.direction === 'ascending' ? -1 : 1;
//                 }
//                 if (a[sortConfig.key] > b[sortConfig.key]) {
//                     return sortConfig.direction === 'ascending' ? 1 : -1;
//                 }
//                 return 0;
//             });
//         }
//         return sortableItems;
//     }, [data, sortConfig]);

//     // Handle sort
//     const handleSort = (column) => {
//         let direction = 'ascending';
//         if (sortConfig.key === column && sortConfig.direction === 'ascending') {
//             direction = 'descending';
//         }
//         setSortConfig({ key: column, direction });
//     };

//     // Handle search
//     const filteredData = sortedData.filter(item => {
//         return (
//             item.firstName.toLowerCase().includes(searchVal.toLowerCase()) ||
//             item.lastName.toLowerCase().includes(searchVal.toLowerCase()) ||
//             item.email.toLowerCase().includes(searchVal.toLowerCase()) ||
//             item.mobileNo.includes(searchVal) ||
//             item.city.toLowerCase().includes(searchVal.toLowerCase()) ||
//             item.pincode.includes(searchVal)
//         );
//     });

//     // Pagination logic
//     const indexOfLastItem = currentPage * rowsPerPage;
//     const indexOfFirstItem = indexOfLastItem - rowsPerPage;
//     const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//     // Handle page change
//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     return (
//         <div>
//             <h2 className="text-2xl font-bold mb-4">User Data Table</h2>
//             <div className='my-4'>
//                 <input
//                     placeholder='Search'
//                     className='px-4 py-2 border-2 rounded-md w-[30%]'
//                     onChange={(e) => setSearchVal(e.target.value)}
//                 />
//             </div>
//             <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
//                 <table className="min-w-full table-auto border-collapse">
//                     <thead>
//                         <tr className="border-b bg-gray-100">
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('id')}
//                             >
//                                 SI No.
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('firstName')}
//                             >
//                                 First Name
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('lastName')}
//                             >
//                                 Last Name
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('email')}
//                             >
//                                 Email
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('mobileNo')}
//                             >
//                                 Mobile No
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('city')}
//                             >
//                                 City
//                             </th>
//                             <th
//                                 className="px-4 py-2 text-left cursor-pointer"
//                                 onClick={() => handleSort('pincode')}
//                             >
//                                 Pincode
//                             </th>
//                             <th className="px-4 py-2 text-left">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {currentData.map((item) => (
//                             <tr key={item.id} className="border-b hover:bg-gray-50">
//                                 <td className="px-4 py-2 font-bold">{item.id}</td>
//                                 <td className="px-4 py-2">{item.firstName}</td>
//                                 <td className="px-4 py-2">{item.lastName}</td>
//                                 <td className="px-4 py-2">{item.email}</td>
//                                 <td className="px-4 py-2">{item.mobileNo}</td>
//                                 <td className="px-4 py-2">{item.city}</td>
//                                 <td className="px-4 py-2">{item.pincode}</td>
//                                 <td className="px-4 py-2">
//                                     <div className="flex space-x-2">
//                                         {/* Block Button */}
//                                         <button
//                                             onClick={() => handleBlock(item.id)}
//                                             className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
//                                         >
//                                             Block
//                                         </button>
//                                         {/* Delete Button */}
//                                         <button
//                                             onClick={() => handleDelete(item.id)}
//                                             className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-700"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//             {/* Pagination Controls */}
//             <div className="mt-4 flex justify-between items-center">
//                 <div className="mt-4 flex justify-center items-center space-x-2">
//                     {/* Previous Button */}
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className={`${currentPage === 1 ?" bg-gray-300 ": "bg-blue-300"} px-4 py-2 rounded-md hover:bg-gray-400`}
//                     >
//                         Previous
//                     </button>

//                     {/* Page Number Links */}
//                     {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
//                         <button
//                             key={page}
//                             onClick={() => handlePageChange(page)}
//                             className={`px-4 py-2 border-2 rounded-md hover:bg-gray-400 ${currentPage === page ? 'bg-blue-300 ' : 'bg-white'}`}
//                         >
//                             {page}
//                         </button>
//                     ))}

//                     {/* Next Button */}
//                     <button
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className={`${currentPage === totalPages ?" bg-gray-300 ": "bg-blue-300"} px-4 py-2 rounded-md hover:bg-gray-400`}
//                     >
//                         Next
//                     </button>
//                 </div>

//                 {/* <select
//                     value={rowsPerPage}
//                     onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
//                     className="px-4 py-2 border-2 rounded-md"
//                 >
//                     <option value={5}>5 rows</option>
//                     <option value={10}>10 rows</option>
//                     <option value={20}>20 rows</option>
//                 </select> */}
//             </div>
//         </div>
//     );
// };

// export default Userdetails;



import React, { useState } from 'react';
import { userData } from "../json/data"
import Pagination from './Pagination';

const Userdetails = () => {
    // Sample data for the table
    const [data, setData] = useState(userData);
    const [searchVal, setSearchVal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleDelete = (id) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
    };

    const handleBlock = (id) => {
        alert(`User with ID: ${id} has been blocked.`);
    };

    // Handle search
    const filteredData = data.filter(item => {
        return (
            item.firstName.toLowerCase().includes(searchVal.toLowerCase()) ||
            item.lastName.toLowerCase().includes(searchVal.toLowerCase()) ||
            item.email.toLowerCase().includes(searchVal.toLowerCase()) ||
            item.mobileNo.includes(searchVal) ||
            item.city.toLowerCase().includes(searchVal.toLowerCase()) ||
            item.pincode.includes(searchVal)
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * 8;
    const indexOfFirstItem = indexOfLastItem - 8;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / 8);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='md:w-auto w-screen'>
            <h2 className="text-2xl font-bold mb-4">User Data Table</h2>
            <div className='my-4'>
                <input
                    placeholder='Search'
                    className='px-4 py-2 border-2 rounded-md w-[30%]'
                    onChange={(e) => setSearchVal(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-100">
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                            >
                                SI No.
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"

                            >
                                First Name
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"

                            >
                                Last Name
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"

                            >
                                Email
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"

                            >
                                Mobile No
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"

                            >
                                City
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"

                            >
                                Pincode
                            </th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 font-bold">{item.id}</td>
                                <td className="px-4 py-2">{item.firstName}</td>
                                <td className="px-4 py-2">{item.lastName}</td>
                                <td className="px-4 py-2">{item.email}</td>
                                <td className="px-4 py-2">{item.mobileNo}</td>
                                <td className="px-4 py-2">{item.city}</td>
                                <td className="px-4 py-2">{item.pincode}</td>
                                <td className="px-4 py-2">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleBlock(item.id)}
                                            className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
                                        >
                                            Block
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} /> */}
            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <div className="mt-4 flex justify-center items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${currentPage === 1 ?" bg-gray-300 ": "bg-blue-300"} px-4 py-2 rounded-md hover:bg-gray-400`}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 border-2 rounded-md hover:bg-gray-400 ${currentPage === page ? 'bg-blue-300 ' : 'bg-white'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`${currentPage === totalPages ?" bg-gray-300 ": "bg-blue-300"} px-4 py-2 rounded-md hover:bg-gray-400`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Userdetails;
