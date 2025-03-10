// import { useState } from "react";
// import { service } from "../json/services";

// const ServiceManagement = () => {
//     const [serviceName, setServiceName] = useState("");

//     return (
//         <div>
//             <h1 className="text-3xl font-bold mb-6">Service Management</h1>
//             <form className="bg-white p-4 flex flex-col">
//                 <label className="font-bold ">
//                     Service Name:
//                     <select onChange={(e) => setServiceName(e.target.value)} value={serviceName}  className="font-normal mx-4 outline-none px-4 py-2 rounded-md border-2">
//                         {
//                             service.map(item => {
//                                 return <option key={item.serviceName} value={item.serviceName}>{item.serviceName}</option>;  // Add return statement
//                             })
//                         }
//                     </select>
//                 </label>

//                 <label className="font-bold ">
//                     Price:
//                     <input placeholder="Enter Amount" className="font-normal p-2 outline-none w-[400px] border-2 rounded-md m-4" />
//                 </label>

//                 <div className="flex gap-2">
//                     <label className="font-bold ">
//                         Description:
//                     </label>
//                     <textarea
//                         placeholder="Enter Description"
//                         className="p-2 outline-none border-2 rounded-md w-[600px]"
//                         rows={5}
//                     />
//                 </div>

//                 <input value="Submit" type="submit" className="float-end mt-6 w-[120px] cursor-pointer bg-yellow-500 p-3 text-white font-bold text-xl rounded-lg" />
//             </form>
//         </div>
//     );
// };

// export default ServiceManagement;


import { useState } from "react";
import { service } from "../json/services";
import { servicedata } from "../json/data"
import Pagination from "./Pagination";

const ServiceManagement = () => {
    const [serviceName, setServiceName] = useState("");
    const [data, setData] = useState(servicedata);
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
            item.serviceName.toLowerCase().includes(searchVal.toLowerCase())
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * 3;
    const indexOfFirstItem = indexOfLastItem - 3;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / 3);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="py-2 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Service Management</h1>
            <form className="bg-white p-6 flex flex-col gap-6 ">
                {/* Service Name */}
                <label className="font-semibold text-lg">
                    Service Name:
                    <select
                        onChange={(e) => setServiceName(e.target.value)}
                        value={serviceName}
                        className="mt-2 block w-full px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        {service.map((item) => {
                            return (
                                <option key={item.serviceName} value={item.serviceName}>
                                    {item.serviceName}
                                </option>
                            );
                        })}
                    </select>
                </label>

                {/* Price */}
                <label className="font-semibold text-lg">
                    Price:
                    <input
                        placeholder="Enter Amount"
                        className="mt-2 block w-full px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </label>

                {/* Description */}
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-lg">
                        Description:
                    </label>
                    <textarea
                        placeholder="Enter Description"
                        className="mt-2 w-full p-4 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300"
                        rows={5}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                    <input
                        value="Submit"
                        type="submit"
                        className="cursor-pointer bg-yellow-500 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300"
                    />
                </div>
            </form>

            <div className="m-4">
                <div className='my-4'>
                    <input
                        placeholder='Search'
                        className='px-4 py-2 border-2 rounded-md w-[30%]'
                        onChange={(e) => setSearchVal(e.target.value)}
                    />
                </div>
                <div className=" bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-100">
                                <th className="px-4 py-2 text-left cursor-pointer">
                                    SI No.
                                </th>
                                <th className="px-4 py-2 text-left cursor-pointer">
                                    Service Name
                                </th>
                                <th className="px-4 py-2 text-left cursor-pointer">
                                    Price
                                </th>
                                <th className="px-4 py-2 text-left cursor-pointer">
                                    Description
                                </th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 font-bold">{indexOfFirstItem  + idx + 1}</td>
                                    <td className="px-4 py-2">{item.serviceName}</td>
                                    <td className="px-4 py-2">{item.price}</td>
                                    <td className="px-4 py-2">{item.description}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleBlock(item.id)}
                                                className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-800"
                                            >
                                                Edit
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


                <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
           
           
            </div>
        </div>
    );
};

export default ServiceManagement;
