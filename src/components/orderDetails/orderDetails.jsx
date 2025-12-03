import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getAuthAxios, getAxios } from "../../utils/api";
import dayjs from "dayjs";

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false); // New state for completion modal
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [rescheduleVenue, setRescheduleVenue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // "cash" or "online"
  const [remainingAmount, setRemainingAmount] = useState(0);
  
  // Check if we're on the specific route that allows status changes
  const isStatusEditable = location.pathname === `/orderdetails/details/${id}`;
  const authAxios = getAuthAxios();

  // Helper to check if event date is past
  const isEventPast = orderDetails?.eventDate
    ? dayjs(orderDetails.eventDate).isBefore(dayjs(), "day")
    : false;

  // Calculate payment status
  const calculatePaymentStatus = () => {
    if (!orderDetails) return null;
    
    const paidAmount = parseFloat(orderDetails.paidAmount) || 0;
    const grandTotal = parseFloat(orderDetails.grandTotal) || 0;
    const dueAmount = parseFloat(orderDetails.dueAmount) || 0;
    
    const remaining = dueAmount > 0 ? dueAmount : grandTotal - paidAmount;
    setRemainingAmount(remaining);
    
    if (paidAmount >= grandTotal) {
      return "fully_paid";
    } else if (paidAmount >= grandTotal * 0.5) {
      return "half_paid";
    } else {
      return "less_than_half";
    }
  };

  // Handler for dropdown change
  const handleStatusDropdownChange = (e) => {
    const newStatus = e.target.value;
    
    // Check if trying to change to completed
    if (newStatus === "completed") {
      const paymentStatus = calculatePaymentStatus();
      
      if (paymentStatus === "fully_paid") {
        // If fully paid, proceed directly
        handleStatusChange("completed");
      } else if (paymentStatus === "half_paid") {
        // If half paid, show completion modal
        setShowCompletionModal(true);
      } else {
        // If less than half paid, show error
        alert(`Cannot mark as completed. Only ₹${orderDetails?.paidAmount || 0} paid out of ₹${orderDetails?.grandTotal || 0}. At least 50% payment required.`);
        // Reset dropdown to current status
        e.target.value = orderDetails?.orderStatus || "created";
        return;
      }
    } else if (newStatus === "cancelled") {
      setShowCancelModal(true);
    } else if (newStatus === "rescheduled") {
      setShowRescheduleModal(true);
    } else {
      handleStatusChange(newStatus);
    }
  };

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

  const handleStatusChange = async (newStatus, paymentMethod = null) => {
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
      const payload = {
        status: newStatus,
      };

      // Add reason for cancellation
      if (newStatus === "cancelled") {
        payload.reason = reason;
      }

      // Add payment method for completion with half payment
      if (newStatus === "completed" && paymentMethod) {
        payload.paymentMethod = paymentMethod;
      }

      const response = await authAxios.put(
        `/orders/updateOrderStatus/${orderDetails._id}`,
        payload
      );

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
      setShowCompletionModal(false);
      setPaymentMethod("");
    }
  };

  const handleCompleteOrder = () => {
    if (!paymentMethod) {
      alert("Please select a payment method for the remaining amount.");
      return;
    }

    const confirmed = window.confirm(
      `Mark order as completed and record remaining payment of ₹${remainingAmount} via ${paymentMethod}?`
    );
    
    if (confirmed) {
      handleStatusChange("completed", paymentMethod);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Cancellation reason is required.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;

    setModalLoading(true);
    try {
      const response = await authAxios.put(
        `/orders/updateOrderStatus/${orderDetails._id}`,
        {
          status: "cancelled",
          reason: cancelReason.trim(),
        }
      );

      if (response.data.success) {
        setOrderDetails((prev) => ({
          ...prev,
          orderStatus: "cancelled",
          reason: cancelReason.trim(),
        }));
        setShowCancelModal(false);
        setCancelReason("");
        alert("Order cancelled successfully.");
      } else {
        alert("Failed to cancel order.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while cancelling the order.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleRescheduleOrder = async () => {
    if (!rescheduleReason.trim() || (!rescheduleDate && !rescheduleVenue)) {
      alert("Reason and at least one of Date, Time, or Venue are required.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reschedule this order?"
    );
    if (!confirmed) return;

    const payload = {
      status: "rescheduled",
      reason: rescheduleReason.trim(),
    };
    if (rescheduleDate) payload.rescheduledEventDate = rescheduleDate;
    if (rescheduleVenue) payload.rescheduledAddress = rescheduleVenue;

    setModalLoading(true);
    try {
      const response = await authAxios.put(
        `/orders/updateOrderStatus/${orderDetails._id}`,
        payload
      );

      if (response.data.success) {
        setOrderDetails((prev) => ({
          ...prev,
          orderStatus: "rescheduled",
          reason: rescheduleReason.trim(),
          rescheduledEventDate: rescheduleDate || prev.rescheduledEventDate,
          rescheduledAddress: rescheduleVenue || prev.rescheduledAddress,
        }));
        setShowRescheduleModal(false);
        setRescheduleReason("");
        setRescheduleDate("");
        setRescheduleVenue("");
        alert("Order rescheduled successfully.");
      } else {
        alert("Failed to reschedule order.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while rescheduling the order.");
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (orderDetails?.orderStatus) {
      case "cancelled":
        return "bg-red-100 text-red-700 font-bold px-2 py-1 rounded";
      case "rescheduled":
        return "bg-purple-300 text-purple-700 font-bold px-2 py-1 rounded";
      case "completed":
        return "bg-green-100 text-green-700 font-bold px-2 py-1 rounded";
      default:
        return "bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded";
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!orderDetails)
    return <div className="text-center mt-10">No order data available.</div>;

  // Calculate payment status for UI
  const paymentStatus = calculatePaymentStatus();
  const paidPercentage = orderDetails?.grandTotal 
    ? Math.round((orderDetails.paidAmount / orderDetails.grandTotal) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-gray-100 to-slate-200 shadow-xl rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-purple-900 mb-6 border-b pb-2">
          Order Summary
        </h2>

        <Link to={`/invoice/${orderDetails._id}`}>
          <button className="bg-primary text-white px-4 py-2 rounded-md">
            Generate Invoice
          </button>
        </Link>
      </div>

      {/* Payment Status Summary */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">💰 Payment Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Grand Total:</span>
            <span className="font-bold">₹{orderDetails.grandTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid Amount:</span>
            <span className="font-bold text-green-600">₹{orderDetails.paidAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Due Amount:</span>
            <span className="font-bold text-red-600">₹{orderDetails.dueAmount || (orderDetails.grandTotal - orderDetails.paidAmount)}</span>
          </div>
          <div className="pt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Payment Progress</span>
              <span className="text-sm font-bold">{paidPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${paidPercentage}%` }}
              ></div>
            </div>
          </div>
          {paymentStatus === "half_paid" && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 font-medium">
                ⚠️ 50% payment received. Collect remaining ₹{remainingAmount} before marking as completed.
              </p>
            </div>
          )}
          {paymentStatus === "less_than_half" && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">
                ❌ Less than 50% payment received. Cannot mark as completed.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
        <div className="space-y-2">
          <p>
            <strong>Order ID:</strong> {orderDetails.orderId}
          </p>
          <div className="flex items-center gap-3">
            <label className="font-semibold">Status:</label>
            {isStatusEditable ? (
              <select
                value={orderDetails.orderStatus}
                onChange={handleStatusDropdownChange}
                disabled={updatingStatus}
                className={`border px-2 py-1 rounded ${getStatusColor()}`}
              >
                <option value="created">Created</option>
                {!isEventPast && <option value="created">Created</option>}
                {!isEventPast && (
                  <option value="rescheduled">Rescheduled</option>
                )}
                {!isEventPast && <option value="cancelled">Cancelled</option>}
                {isEventPast && <option value="completed">Completed</option>}
              </select>
            ) : (
              <span className={`ml-2 ${getStatusColor()}`}>
                {orderDetails.orderStatus
                  ? orderDetails.orderStatus.charAt(0).toUpperCase() +
                    orderDetails.orderStatus.slice(1)
                  : ""}
              </span>
            )}
          </div>
          <p>
            <strong>Event Date:</strong> {orderDetails.eventDate}
          </p>
          {orderDetails.rescheduledEventDate && (
            <p>
              <strong>Rescheduled Date:</strong>{" "}
              {orderDetails.rescheduledEventDate}
            </p>
          )}
          <p>
            <strong>Event Time:</strong> {orderDetails.eventTime}
          </p>
          {orderDetails.reason && (
            <p>
              <strong>Reason:</strong> {orderDetails.reason}
            </p>
          )}
          {orderDetails.balloonsColor?.length > 0 && (
            <p>
              <strong>Balloons Color:</strong>{" "}
              {orderDetails.balloonsColor.join(", ")}
            </p>
          )}

          <p>
            <strong>How did you come to know about Lavish Eventzz:</strong>{" "}
            {orderDetails.source}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <strong>Customer Name:</strong> {orderDetails.customerName || "—"}
          </p>
          <p>
            <strong>Customer Number:</strong> {orderDetails.customerId?.mobile}
          </p>
          <p>
            <strong>Alternative Number:</strong>{" "}
            {orderDetails.customerId?.alternateMobile}
          </p>

          <p>
            <strong>Address:</strong> {orderDetails.address}
          </p>
          {orderDetails.rescheduledAddress && (
            <p>
              <strong>Rescheduled Address:</strong>{" "}
              {orderDetails.rescheduledAddress}
            </p>
          )}
          <p>
            <strong>Pincode:</strong> {orderDetails.pincode}
          </p>
          <p>
            <strong>Occasion:</strong> {orderDetails.occasion}
          </p>
          {orderDetails.otherOccasion && (
            <p>
              <strong>Other Occasion:</strong> {orderDetails.otherOccasion}
            </p>
          )}
          <p>
            <strong>Decor Location:</strong> {orderDetails.decorLocation}
          </p>
          {orderDetails.otherDecorLocation && (
            <p>
              <strong>Other Decor Location:</strong>{" "}
              {orderDetails.otherDecorLocation}
            </p>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-purple-900 mb-4">
        🛍️ Ordered Items
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderDetails.items?.length > 0 ? (
          orderDetails.items.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm space-y-2"
            >
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
                  <p className="font-semibold text-purple-700">
                    🎯 Addon / Custom Inputs:
                  </p>
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
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
          💳 Billing Summary
        </h3>
        <div className="divide-y divide-gray-200 text-lg">
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>₹{orderDetails.subTotal}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Coupon Discount</span>
            <span className="text-green-600">
              − ₹{orderDetails.couponDiscount}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>Delivery Charges</span>
            <span>₹{orderDetails.deliveryCharges}</span>
          </div>
          <div className="flex justify-between py-2 font-medium">
            <span>Paid Amount</span>
            <span className="text-green-700">₹{orderDetails.paidAmount}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Due Amount</span>
            <span className="text-red-600">₹{orderDetails.dueAmount || (orderDetails.grandTotal - orderDetails.paidAmount)}</span>
          </div>
          <div className="flex justify-between py-3 text-xl font-bold border-t mt-2 pt-3">
            <span>Grand Total</span>
            <span className="text-purple-700">₹{orderDetails.grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
            <label className="block mb-2 font-medium">
              Reason for cancellation
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason..."
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                disabled={modalLoading}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleCancelOrder}
                disabled={modalLoading}
              >
                {modalLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Reschedule Event</h2>
            <label className="block mb-2 font-medium">
              Reason for rescheduling <span className="text-red-600">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
              rows={3}
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="Enter reason..."
            />
            <label className="block mb-2 font-medium">New Event Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
              value={rescheduleDate}
              min={dayjs().format("YYYY-MM-DD")}
              onChange={(e) => setRescheduleDate(e.target.value)}
            />
            <label className="block mb-2 font-medium">New Event Venue</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
              value={rescheduleVenue || ""}
              onChange={(e) => setRescheduleVenue(e.target.value)}
              placeholder="Enter new venue address..."
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowRescheduleModal(false);
                  setRescheduleReason("");
                  setRescheduleDate("");
                  setRescheduleVenue("");
                }}
                disabled={modalLoading}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={handleRescheduleOrder}
                disabled={
                  modalLoading ||
                  !rescheduleReason.trim() ||
                  (!rescheduleDate && !rescheduleVenue)
                }
              >
                {modalLoading ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal for 50% payment */}
      {showCompletionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Complete Order</h2>
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 font-medium">
                ⚠️ 50% payment received. Remaining amount to collect: 
                <span className="font-bold text-lg ml-2">₹{remainingAmount}</span>
              </p>
            </div>
            
            <label className="block mb-2 font-medium">
              Select payment method for remaining amount:
            </label>
            <div className="space-y-2 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span>💵 Cash</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span>🏦 Online (UPI/Bank Transfer)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => {
                  setShowCompletionModal(false);
                  setPaymentMethod("");
                }}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleCompleteOrder}
                disabled={modalLoading || !paymentMethod}
              >
                {modalLoading ? "Completing..." : "Mark as Completed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
// import React, { useEffect, useState } from "react";
// import { useParams, Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import { getAuthAxios, getAxios } from "../../utils/api";
// import dayjs from "dayjs";

// const OrderDetails = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState("");
//   const [rescheduleReason, setRescheduleReason] = useState("");
//   const [rescheduleDate, setRescheduleDate] = useState("");
//   const [modalLoading, setModalLoading] = useState(false);
//   const [rescheduleVenue, setRescheduleVenue] = useState("");
//   // Check if we're on the specific route that allows status changes
//   const isStatusEditable = location.pathname === `/orderdetails/details/${id}`;
//   const authAxios = getAuthAxios();

//   // Helper to check if event date is past
//   const isEventPast = orderDetails?.eventDate
//     ? dayjs(orderDetails.eventDate).isBefore(dayjs(), "day")
//     : false;

//   // Handler for dropdown change
//   const handleStatusDropdownChange = (e) => {
//     const newStatus = e.target.value;
//     if (newStatus === "cancelled") {
//       setShowCancelModal(true);
//     } else if (newStatus === "rescheduled") {
//       setShowRescheduleModal(true);
//     } else {
//       handleStatusChange(newStatus);
//     }
//   };

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await getAxios().get(`/orders/orderDetails/${id}`);
//         if (response.data) {
//           setOrderDetails(response.data.data);
//         } else {
//           setError("No order data returned from server.");
//         }
//       } catch (err) {
//         setError("Failed to fetch order.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchOrder();
//     } else {
//       setError("Invalid order ID.");
//       setLoading(false);
//     }
//   }, [id]);

//   const handleStatusChange = async (newStatus) => {
//     if (!orderDetails) return;

//     if (newStatus === orderDetails.orderStatus) return;

//     let reason = "";

//     if (newStatus === "cancelled") {
//       reason = prompt("Please enter a reason for cancellation:");
//       if (!reason) {
//         alert("Cancellation reason is required.");
//         return;
//       }
//     }

//     setUpdatingStatus(true);

//     try {
//       const response = await authAxios.put(
//         `/orders/updateOrderStatus/${orderDetails._id}`,
//         {
//           status: newStatus,
//           reason: newStatus === "cancelled" ? reason : undefined,
//         }
//       );

//       if (response.data.success) {
//         setOrderDetails((prev) => ({
//           ...prev,
//           orderStatus: newStatus,
//           reason: newStatus === "cancelled" ? reason : prev.reason,
//         }));
//         alert("Order status updated successfully.");
//       } else {
//         alert("Failed to update status.");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("An error occurred while updating the order status.");
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleCancelOrder = async () => {
//     if (!cancelReason.trim()) {
//       alert("Cancellation reason is required.");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to cancel this order?"
//     );
//     if (!confirmed) return;

//     setModalLoading(true);
//     try {
//       const response = await authAxios.put(
//         `/orders/updateOrderStatus/${orderDetails._id}`,
//         {
//           status: "cancelled",
//           reason: cancelReason.trim(),
//         }
//       );

//       if (response.data.success) {
//         setOrderDetails((prev) => ({
//           ...prev,
//           orderStatus: "cancelled",
//           reason: cancelReason.trim(),
//         }));
//         setShowCancelModal(false);
//         setCancelReason("");
//         alert("Order cancelled successfully.");
//       } else {
//         alert("Failed to cancel order.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("An error occurred while cancelling the order.");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const handleRescheduleOrder = async () => {
//     if (!rescheduleReason.trim() || (!rescheduleDate && !rescheduleVenue)) {
//       alert("Reason and at least one of Date, Time, or Venue are required.");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to reschedule this order?"
//     );
//     if (!confirmed) return;

//     const payload = {
//       status: "rescheduled",
//       reason: rescheduleReason.trim(),
//     };
//     if (rescheduleDate) payload.rescheduledEventDate = rescheduleDate;
//     // if (rescheduleTime) payload.rescheduledEventTime = rescheduleTime;
//     if (rescheduleVenue) payload.rescheduledAddress = rescheduleVenue;

//     setModalLoading(true);
//     try {
//       const response = await authAxios.put(
//         `/orders/updateOrderStatus/${orderDetails._id}`,
//         payload
//       );

//       if (response.data.success) {
//         setOrderDetails((prev) => ({
//           ...prev,
//           orderStatus: "rescheduled",
//           reason: rescheduleReason.trim(),
//           rescheduledEventDate: rescheduleDate || prev.rescheduledEventDate,
//           // rescheduledEventTime: rescheduleTime || prev.rescheduledEventTime,
//           rescheduledAddress: rescheduleVenue || prev.rescheduledAddress,
//         }));
//         setShowRescheduleModal(false);
//         setRescheduleReason("");
//         setRescheduleDate("");
//         // setRescheduleTime("");
//         setRescheduleVenue("");
//         alert("Order rescheduled successfully.");
//       } else {
//         alert("Failed to reschedule order.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("An error occurred while rescheduling the order.");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const getStatusColor = () => {
//     switch (orderDetails?.orderStatus) {
//       case "cancelled":
//         return "bg-red-100 text-red-700 font-bold px-2 py-1 rounded";
//       case "rescheduled":
//         return "bg-purple-300 text-purple-700 font-bold px-2 py-1 rounded";
//       case "completed":
//         return "bg-green-100 text-green-700 font-bold px-2 py-1 rounded";
//       default:
//         return "bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded";
//     }
//   };

//   if (loading) return <div className="text-center mt-10">Loading...</div>;
//   if (error)
//     return <div className="text-center text-red-600 mt-10">{error}</div>;
//   if (!orderDetails)
//     return <div className="text-center mt-10">No order data available.</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-gray-100 to-slate-200 shadow-xl rounded-lg">
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-extrabold text-purple-900 mb-6 border-b pb-2">
//           Order Summary
//         </h2>

//         <Link to={`/invoice/${orderDetails._id}`}>
//           <button className="bg-primary text-white px-4 py-2 rounded-md">
//             Generate Invoice
//           </button>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700">
//         <div className="space-y-2">
//           <p>
//             <strong>Order ID:</strong> {orderDetails.orderId}
//           </p>
//           <div className="flex items-center gap-3">
//             <label className="font-semibold">Status:</label>
//             {isStatusEditable ? (
//               <select
//                 value={orderDetails.orderStatus}
//                 onChange={handleStatusDropdownChange}
//                 disabled={updatingStatus}
//                 className={`border px-2 py-1 rounded ${getStatusColor()}`}
//               >
//                 <option value="created">Created</option>
//                 {!isEventPast && <option value="created">Created</option>}
//                 {!isEventPast && (
//                   <option value="rescheduled">Rescheduled</option>
//                 )}
//                 {!isEventPast && <option value="cancelled">Cancelled</option>}
//                 {isEventPast && <option value="completed">Completed</option>}
//               </select>
//             ) : (
//               <span className={`ml-2 ${getStatusColor()}`}>
//                 {orderDetails.orderStatus
//                   ? orderDetails.orderStatus.charAt(0).toUpperCase() +
//                     orderDetails.orderStatus.slice(1)
//                   : ""}
//               </span>
//             )}
//           </div>
//           <p>
//             <strong>Event Date:</strong> {orderDetails.eventDate}
//           </p>
//           {orderDetails.rescheduledEventDate && (
//             <p>
//               <strong>Rescheduled Date:</strong>{" "}
//               {orderDetails.rescheduledEventDate}
//             </p>
//           )}
//           <p>
//             <strong>Event Time:</strong> {orderDetails.eventTime}
//           </p>
//           {orderDetails.reason && (
//             <p>
//               <strong>Reason:</strong> {orderDetails.reason}
//             </p>
//           )}
//           {orderDetails.balloonsColor?.length > 0 && (
//             <p>
//               <strong>Balloons Color:</strong>{" "}
//               {orderDetails.balloonsColor.join(", ")}
//             </p>
//           )}

//           <p>
//             <strong>How did you come to know about Lavish Eventzz:</strong>{" "}
//             {orderDetails.source}
//           </p>
//         </div>
//         <div className="space-y-2">
//           <p>
//             <strong>Customer Name:</strong> {orderDetails.customerName || "—"}
//           </p>
//           <p>
//             <strong>Customer Number:</strong> {orderDetails.customerId?.mobile}
//           </p>
//           <p>
//             <strong>Alternative Number:</strong>{" "}
//             {orderDetails.customerId?.alternateMobile}
//           </p>

//           <p>
//             <strong>Address:</strong> {orderDetails.address}
//           </p>
//           {orderDetails.rescheduledAddress && (
//             <p>
//               <strong>Rescheduled Address:</strong>{" "}
//               {orderDetails.rescheduledAddress}
//             </p>
//           )}
//           <p>
//             <strong>Pincode:</strong> {orderDetails.pincode}
//           </p>
//           <p>
//             <strong>Occasion:</strong> {orderDetails.occasion}
//           </p>
//           {orderDetails.otherOccasion && (
//             <p>
//               <strong>Other Occasion:</strong> {orderDetails.otherOccasion}
//             </p>
//           )}
//           <p>
//             <strong>Decor Location:</strong> {orderDetails.decorLocation}
//           </p>
//           {orderDetails.otherDecorLocation && (
//             <p>
//               <strong>Other Decor Location:</strong>{" "}
//               {orderDetails.otherDecorLocation}
//             </p>
//           )}
//         </div>
//       </div>

//       <h3 className="text-xl font-bold text-purple-900 mb-4">
//         🛍️ Ordered Items
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {orderDetails.items?.length > 0 ? (
//           orderDetails.items.map((item, idx) => (
//             <div
//               key={idx}
//               className="border border-gray-200 bg-white p-4 rounded-lg shadow-sm space-y-2"
//             >
//               {/* Main service */}
//               <div className="flex">
//                 <img
//                   src={`${item?.image}`}
//                   alt={item.serviceName}
//                   className="w-24 h-24 object-cover rounded-md mr-4"
//                 />
//                 <div>
//                   <p className="font-semibold text-lg">{item.serviceName}</p>
//                   <p>Category: {item.categoryType}</p>
//                   <p>Quantity: {item.quantity}</p>
//                   <p>Price: ₹{item.price}</p>
//                   <p className="text-sm text-gray-500 line-through">
//                     Original: ₹{item.originalPrice}
//                   </p>
//                 </div>
//               </div>

//               {/* Addon services / customized inputs */}
//               {item.customizedInputs && item.customizedInputs.length > 0 && (
//                 <div className="ml-6 mt-3 border-l-2 border-purple-300 pl-4 space-y-2">
//                   <p className="font-semibold text-purple-700">
//                     🎯 Addon / Custom Inputs:
//                   </p>
//                   {item.customizedInputs.map((addon, addonIdx) => (
//                     <div key={addonIdx}>
//                       <p className="text-sm">
//                         <strong>{addon.label}:</strong>{" "}
//                         {Array.isArray(addon.value)
//                           ? addon.value.join(", ")
//                           : addon.value}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p>No items found in this order.</p>
//         )}
//       </div>

//       <div className="bg-white p-6 rounded shadow-sm my-10">
//         <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
//           💳 Billing Summary
//         </h3>
//         <div className="divide-y divide-gray-200 text-lg">
//           <div className="flex justify-between py-2">
//             <span>Subtotal</span>
//             <span>₹{orderDetails.subTotal}</span>
//           </div>
//           <div className="flex justify-between py-2">
//             <span>Coupon Discount</span>
//             <span className="text-green-600">
//               − ₹{orderDetails.couponDiscount}
//             </span>
//           </div>
//           {/* <div className="flex justify-between py-2">
//                         <span>GST</span>
//                         <span>₹{orderDetails.gstAmount}</span>
//                     </div> */}
//           <div className="flex justify-between py-2">
//             <span>Delivery Charges</span>
//             <span>₹{orderDetails.deliveryCharges}</span>
//           </div>
//           <div className="flex justify-between py-2 font-medium">
//             <span>Paid Amount</span>
//             <span className="text-green-700">₹{orderDetails.paidAmount}</span>
//           </div>
//           {/* <div className="flex justify-between py-2">
//                         <span>Due Amount</span>
//                         <span className="text-red-600">₹{orderDetails.dueAmount}</span>
//                     </div> */}
//           <div className="flex justify-between py-3 text-xl font-bold border-t mt-2 pt-3">
//             <span>Grand Total</span>
//             <span className="text-purple-700">₹{orderDetails.grandTotal}</span>
//           </div>
//         </div>
//       </div>

//       {/* Cancel Modal */}
//       {showCancelModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
//             <label className="block mb-2 font-medium">
//               Reason for cancellation
//             </label>
//             <textarea
//               className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
//               rows={3}
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               placeholder="Enter reason..."
//             />
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//                 onClick={() => {
//                   setShowCancelModal(false);
//                   setCancelReason("");
//                 }}
//                 disabled={modalLoading}
//               >
//                 Close
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                 onClick={handleCancelOrder}
//                 disabled={modalLoading}
//               >
//                 {modalLoading ? "Cancelling..." : "Confirm Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Reschedule Modal */}
//       {showRescheduleModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Reschedule Event</h2>
//             <label className="block mb-2 font-medium">
//               Reason for rescheduling <span className="text-red-600">*</span>
//             </label>
//             <textarea
//               className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
//               rows={3}
//               value={rescheduleReason}
//               onChange={(e) => setRescheduleReason(e.target.value)}
//               placeholder="Enter reason..."
//             />
//             <label className="block mb-2 font-medium">New Event Date</label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
//               value={rescheduleDate}
//               min={dayjs().format("YYYY-MM-DD")}
//               onChange={(e) => setRescheduleDate(e.target.value)}
//             />
//             <label className="block mb-2 font-medium">New Event Venue</label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
//               value={rescheduleVenue || ""}
//               onChange={(e) => setRescheduleVenue(e.target.value)}
//               placeholder="Enter new venue address..."
//             />

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//                 onClick={() => {
//                   setShowRescheduleModal(false);
//                   setRescheduleReason("");
//                   setRescheduleDate("");
//                   setRescheduleVenue("");
//                 }}
//                 disabled={modalLoading}
//               >
//                 Close
//               </button>
//               <button
//                 className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//                 onClick={handleRescheduleOrder}
//                 disabled={
//                   modalLoading ||
//                   !rescheduleReason.trim() ||
//                   (!rescheduleDate && !rescheduleVenue)
//                 }
//               >
//                 {modalLoading ? "Rescheduling..." : "Confirm Reschedule"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetails;
