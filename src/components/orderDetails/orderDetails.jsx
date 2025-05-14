import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/getOrderDetails/${id}`);
                if (response.data) {
                    setOrderDetails(response.data);
                } else {
                    setError("No order data returned from server.");
                }
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Failed to fetch order.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        } else {
            setError("Invalid order ID.");
            setLoading(false);
        }
    }, [id]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
    if (!orderDetails) return <div className="text-center mt-10">No order data available.</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-gray-100 to-slate-200 shadow-xl rounded-lg">
            <h2 className="text-3xl font-extrabold text-purple-900 mb-6 border-b pb-2">Order Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
                <div className="space-y-2">
                    <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                    <p><strong>Status:</strong> {orderDetails.orderStatus}</p>
                    <p><strong>Event Date:</strong> {orderDetails.eventDate}</p>
                    {orderDetails.rescheduledEventDate && (
                        <p><strong>Rescheduled Date:</strong> {orderDetails.rescheduledEventDate}</p>
                    )}
                    <p><strong>Event Time:</strong> {orderDetails.eventTime}</p>
                    {orderDetails.reason && (
                        <p><strong>Reason:</strong> {orderDetails.reason}</p>
                    )}
                    {orderDetails.balloonsColor?.length > 0 && (
                        <p><strong>Balloons Color:</strong> {orderDetails.balloonsColor.join(", ")}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <p><strong>Customer Name:</strong> {orderDetails.customerName || "—"}</p>
                    <p><strong>Address:</strong> {orderDetails.address}</p>
                    {orderDetails.rescheduledAddress && (
                        <p><strong>Rescheduled Address:</strong> {orderDetails.rescheduledAddress}</p>
                    )}
                    <p><strong>Pincode:</strong> {orderDetails.pincode}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white p-4 rounded shadow-sm mb-8">
                <p><strong>Subtotal:</strong> ₹{orderDetails.subTotal}</p>
                <p><strong>Coupon Discount:</strong> ₹{orderDetails.couponDiscount}</p>
                <p><strong>GST:</strong> ₹{orderDetails.gstAmount}</p>
                <p><strong>Delivery Charges:</strong> ₹{orderDetails.deliveryCharges}</p>
                <p><strong>Paid Amount:</strong> ₹{orderDetails.paidAmount}</p>
                <p><strong>Due Amount:</strong> ₹{orderDetails.dueAmount}</p>
                <p><strong>Grand Total:</strong> ₹{orderDetails.grandTotal}</p>
            </div>

            <h3 className="text-xl font-bold text-purple-900 mb-4">🛍️ Ordered Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orderDetails.items?.length > 0 ? (
                    orderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex border border-gray-200 bg-white p-4 rounded-lg shadow-sm">
                            <img
                                src={item.image || "https://via.placeholder.com/100"}
                                alt={item.serviceName}
                                className="w-24 h-24 object-cover rounded-md mr-4"
                            />
                            <div className="flex flex-col justify-between">
                                <p className="font-semibold">{item.serviceName}</p>
                                <p>Category: {item.categoryType}</p>
                                <p>Qty: {item.quantity}</p>
                                <p>{item.categoryType === "service" ? "Price" : "Total Price "} : ₹{item.price}</p>
                                <p className={`text-sm text-gray-500 ${item.categoryType === "service" && "line-through"}`}>{item.categoryType === "service" ? "Original" : "Price per Addons "}: ₹{item.originalPrice}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items found in this order.</p>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
