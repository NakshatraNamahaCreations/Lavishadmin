import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getAuthAxios, getAxios } from "../../utils/api";

const OrderDetails = () => {
    const { id } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

const authAxios = getAuthAxios()

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getAxios().get(`/orders/orderDetails/${id}`);
                if (response.data) {
                    setOrderDetails(response.data.data);
                } else {
                    setError("No order data returned from server.");
                }
            } catch (err) {
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

    const handleStatusChange = async (newStatus) => {
        if (!orderDetails) return;

        if (newStatus === orderDetails.orderStatus) return;

        let reason = "";

        if (newStatus === "cancelled") {
            reason = prompt("Please enter a reason for cancellation:");
            if (!reason) {
                alert("Cancellation reason is required.");
                return;
            }
        }

        setUpdatingStatus(true);

        try {
            const response = await authAxios.put(`/orders/updateOrderStatus/${orderDetails._id}`, {
                status: newStatus,
                reason: newStatus === "cancelled" ? reason : undefined,
            });

            if (response.data.success) {
                setOrderDetails((prev) => ({
                    ...prev,
                    orderStatus: newStatus,
                    reason: newStatus === "cancelled" ? reason : prev.reason,
                }));
                alert("Order status updated successfully.");
            } else {
                alert("Failed to update status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("An error occurred while updating the order status.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
    if (!orderDetails) return <div className="text-center mt-10">No order data available.</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-gray-100 to-slate-200 shadow-xl rounded-lg">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-purple-900 mb-6 border-b pb-2">Order Summary</h2>

                <Link to={`/invoice/${orderDetails._id}`} >
                    <button className="bg-primary text-white px-4 py-2 rounded-md" >Generate Invoice</button>
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
                <div className="space-y-2">
                    <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                    <div className="flex items-center gap-3">
                        <label className="font-semibold">Status:</label>
                        {orderDetails.orderStatus === "created" || orderDetails.orderStatus === "cancelled" || orderDetails.orderStatus === "completed" ? (
                            <>
                                <select
                                    value={orderDetails.orderStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                    disabled={updatingStatus}
                                >
                                    <option value="created" disabled>created</option>
                                    <option value="completed">completed</option>
                                    <option value="cancelled">cancelled</option>
                                </select>
                                {updatingStatus && <span className="text-sm text-gray-500">Updating...</span>}
                            </>
                        ) : (
                            <span className="px-2 py-1 bg-gray-200 rounded text-gray-800 capitalize">
                                {orderDetails.orderStatus}
                            </span>
                        )}
                    </div>

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
                    <p><strong>Occasion:</strong> {orderDetails.occasion}</p>
                    {orderDetails.otherOccasion && (
                        <p><strong>Other Occasion:</strong> {orderDetails.otherOccasion}</p>
                    )}
                    <p><strong>Decor Location:</strong> {orderDetails.decorLocation}</p>
                    {orderDetails.otherDecorLocation && (
                        <p><strong>Other Decor Location:</strong> {orderDetails.otherDecorLocation}</p>
                    )}
                </div>
            </div>


            <h3 className="text-xl font-bold text-purple-900 mb-4">🛍️ Ordered Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orderDetails.items?.length > 0 ? (
                    orderDetails.items.map((item, idx) => (
                        <div key={idx} className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm space-y-2">
                            {/* Main service */}
                            <div className="flex">
                                <img
                                    src={`${item?.image}`}
                                    alt={item.serviceName}
                                    className="w-24 h-24 object-cover rounded-md mr-4"
                                />
                                <div>
                                    <p className="font-semibold text-lg">{item.serviceName}</p>
                                    <p>Category: {item.categoryType}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ₹{item.price}</p>
                                    <p className="text-sm text-gray-500 line-through">
                                        Original: ₹{item.originalPrice}
                                    </p>
                                </div>
                            </div>

                            {/* Addon services / customized inputs */}
                            {item.customizedInputs && item.customizedInputs.length > 0 && (
                                <div className="ml-6 mt-3 border-l-2 border-purple-300 pl-4 space-y-2">
                                    <p className="font-semibold text-purple-700">🎯 Addon / Custom Inputs:</p>
                                    {item.customizedInputs.map((addon, addonIdx) => (
                                        <div key={addonIdx}>
                                            <p className="text-sm">
                                                <strong>{addon.label}:</strong>{" "}
                                                {Array.isArray(addon.value)
                                                    ? addon.value.join(", ")
                                                    : addon.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No items found in this order.</p>
                )}
            </div>


            <div className="bg-white p-6 rounded shadow-sm my-10">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">💳 Billing Summary</h3>
                <div className="divide-y divide-gray-200 text-lg">
                    <div className="flex justify-between py-2">
                        <span>Subtotal</span>
                        <span>₹{orderDetails.subTotal}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Coupon Discount</span>
                        <span className="text-green-600">− ₹{orderDetails.couponDiscount}</span>
                    </div>
                    {/* <div className="flex justify-between py-2">
                        <span>GST</span>
                        <span>₹{orderDetails.gstAmount}</span>
                    </div> */}
                    <div className="flex justify-between py-2">
                        <span>Delivery Charges</span>
                        <span>₹{orderDetails.deliveryCharges}</span>
                    </div>
                    <div className="flex justify-between py-2 font-medium">
                        <span>Paid Amount</span>
                        <span className="text-green-700">₹{orderDetails.paidAmount}</span>
                    </div>
                    {/* <div className="flex justify-between py-2">
                        <span>Due Amount</span>
                        <span className="text-red-600">₹{orderDetails.dueAmount}</span>
                    </div> */}
                    <div className="flex justify-between py-3 text-xl font-bold border-t mt-2 pt-3">
                        <span>Grand Total</span>
                        <span className="text-purple-700">₹{orderDetails.grandTotal}</span>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default OrderDetails;
