import { useState } from "react";
import { orderData } from "../json/data"
import Pagination from "./Pagination";
import { MdOutlineCurrencyRupee } from "react-icons/md";

const Orderdetails = () => {

    const [searchVal, setSearchVal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Handle search
    const filteredData = orderData.filter(item => {
        if (searchVal.trim() === "") {
            return true;
        }

        return (
            (item.customerName && item.customerName.toLowerCase().includes(searchVal.toLowerCase())) ||
            (item.orderId && item.orderId.toLowerCase().includes(searchVal.toLowerCase())) ||
            (item.email && item.email.toLowerCase().includes(searchVal.toLowerCase()))
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
        <div className="m-4">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className='my-4'>
                <input
                    type="text"
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
                                Order Id
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                            >
                                Customer name
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                            >
                                Order Date
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                            >
                                Total Amount
                            </th>
                            <th
                                className="px-4 py-2 text-left cursor-pointer"
                            >
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, idx) => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2 font-bold">{indexOfFirstItem + idx + 1}
                                </td>
                                <td className="px-4 py-2">{item.orderId}</td>
                                <td className="px-4 py-2">{item.customerName}</td>
                                <td className="px-4 py-2">{new Date(item.orderDate).toLocaleDateString('en-CA')}</td>
                                <td className="px-4 py-2 flex items-center "><MdOutlineCurrencyRupee /> {item.totalAmount}</td>
                                <td className="px-4 py-2">{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </div>
        </div>
    )
}

export default Orderdetails