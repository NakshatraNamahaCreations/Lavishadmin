import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderData } from "../json/data";
import axios from "axios";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { getAxios } from "../utils/api";

const OrderDetailsCard = () => {
    const { _id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchOrder = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await getAxios().get(`https://api.lavisheventzz.com/api/admin/orders/order/${_id}`)
            console.log("response: ", response.data.order)
            setOrder(response.data.order)
        } catch (error) {
            console.log("error:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [_id])

    if (order === null) {
        return (
            <div className="bg-gray-100 flex items-center justify-center p-5">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 text-center">
                    <p className="text-lg text-gray-700">Order not found</p>
                </div>
            </div>
        );
    }

   
    return (
        <div className="bg-gray-100 flex items-center justify-center p-5">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
                {/* Header Section */}
                <div className="flex items-center gap-5 mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">Order ID: {order?.orderId}</h1>
                        <td className=" ">{order?.customerId?.firstName} {order?.customerId?.lastName}</td>
                        <p className="text-gray-500">{order?.customerId?.email}</p>
                    </div>
                </div>

                {/* Order Details Section */}
                <div className="grid grid-cols-2 text-gray-700">
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Shipping Address:</p>
                        <p className="text-gray-600">{order?.address1}, {order?.address2}</p>
                        <p className="text-gray-600">{order?.city} {order?.state}</p>
                        <p className="text-gray-600">{order?.country}, {order?.pincode}</p>
                  
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Order Date:</p>
                        <p className="text-gray-600">{new Date(order?.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Order Status:</p>
                        <p className="text-gray-600">{order?.status}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Payment Method:</p>
                        <p className="text-gray-600">{order?.paymentMethod}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Payment Status:</p>
                        <p className="text-gray-600">{order?.paymentStatus}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Mobile No:</p>
                        <p className="text-gray-600">{order?.customerId?.mobile}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Total Amount:</p>
                        <p className=" flex items-center  font-bold text-green-600"><MdOutlineCurrencyRupee /> {order?.totalPrice}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Products:</p>
                        <ul className="text-gray-600">
                            {/* {order?.products.map((productId, index) => (
                                <li key={index}>Product ID: {productId}</li>
                            ))} */}
                            <li>Product ID: 56464654</li>
                            <li>Product ID: 56464654</li>
                        </ul>
                    </div>
                </div>

                {/* Action Section */}
                {/* <div className="mt-6 flex justify-center gap-4">
                 
                    <button className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300">
                        Cancel Order
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default OrderDetailsCard;
