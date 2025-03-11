
import { useState } from "react";
import { coupons } from "../json/data";
import Pagination from "./Pagination";

const CouponCreations = () => {
    // State for coupon form inputs
    const [couponName, setCouponName] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponDetails, setCouponDetails] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State for filtered coupons, search, and pagination
    const [data, setData] = useState(coupons);
    const [searchVal, setSearchVal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Handle delete
    const handleDelete = (id) => {
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
    };

    // Handle search
    const filteredData = data.filter(item => {
        return (
            (item.couponName && item.couponName.toLowerCase().includes(searchVal.toLowerCase())) ||
            (item.couponCode && item.couponCode.toLowerCase().includes(searchVal.toLowerCase()))
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * 5;
    const indexOfFirstItem = indexOfLastItem - 5;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / 5);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
       
        const newCoupon = {
            id: Date.now().toString(),
            couponName,
            couponCode,
            couponDetails,
            discount,
            startDate,
            endDate,
        };

        setData([...data, newCoupon]);

        setCouponName("");
        setCouponCode("");
        setCouponDetails("");
        setDiscount("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="py-2 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Coupon</h1>
            <form className="bg-white p-6" onSubmit={handleSubmit}>
                <div className="gap-6 grid grid-cols-3">
                    <label className="font-semibold text-lg">
                        Coupon Name:
                        <input
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                            placeholder="Enter Coupon Name"
                            className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                        />
                    </label>

                    <label className="font-semibold text-lg">
                        Discount Percentage:
                        <input
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="Enter Discount Percentage"
                            className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                        />
                    </label>

                    <label className="font-semibold text-lg">
                        Coupon Code:
                        <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter Coupon Code"
                            className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                        />
                    </label>

                    <label className="font-semibold text-lg">
                        Coupon Details:
                        <input
                            value={couponDetails}
                            onChange={(e) => setCouponDetails(e.target.value)}
                            placeholder="Enter Coupon Details"
                            className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                        />
                    </label>

                    <label className="font-semibold text-lg">
                        Start Date:
                        <input
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            type="date"
                            className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                        />
                    </label>

                    <label className="font-semibold text-lg">
                        End Date:
                        <input
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            type="date"
                            className="mt-2 block px-4 py-2 border-2 rounded-md outline-none focus:ring-2 focus:ring-blue-300 font-normal"
                        />
                    </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-10">
                    <input
                        type="submit"
                        value="Submit"
                        className="cursor-pointer bg-yellow-500 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-yellow-600 transition duration-300"
                    />
                </div>
            </form>

            <div className="m-4">
                <div className="my-4">
                    <input
                        placeholder="Search"
                        className="px-4 py-2 border-2 rounded-md w-[30%]"
                        onChange={(e) => setSearchVal(e.target.value)}
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-100">
                                <th className="px-4 py-2 text-left cursor-pointer">SI No.</th>
                                <th className="px-4 py-2 text-left cursor-pointer">Coupon Name</th>
                                <th className="px-4 py-2 text-left cursor-pointer">Coupon Code</th>
                                <th className="px-4 py-2 text-left cursor-pointer">Status</th>
                                <th className="px-4 py-2 text-left cursor-pointer">Start Date</th>
                                <th className="px-4 py-2 text-left cursor-pointer">End Date</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 font-bold">{indexOfFirstItem + idx + 1}</td>
                                    <td className="px-4 py-2">{item.couponName}</td>
                                    <td className="px-4 py-2">{item.couponCode}</td>
                                    <td className={`px-4 py-2 ${item.status === "Active" ? "text-green-600":"text-red-600"} font-medium`}>{item.status}</td>
                                    <td className="px-4 py-2">{new Date(item.startDate).toLocaleDateString('en-CA')}</td>
                                    <td className="px-4 py-2">{new Date(item.endDate).toLocaleDateString('en-CA')}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex space-x-2">
                                        <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-green-600 text-white py-1 px-4 rounded-lg hover:bg-green-700"
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

export default CouponCreations;
