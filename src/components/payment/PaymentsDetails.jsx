import { useState } from "react";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";

const PaymentsDetails = () => {
  const [searchVal, setSearchVal] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={handleBackClick} className="text-xl">
            <IoArrowBack />
          </button>
          <h2 className="text-2xl font-bold">Payments Details</h2>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-md"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-3 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">SI No.</th>
              <th className="px-4 py-2 text-left">Booking Date</th>
              <th className="px-4 py-2 text-left">Booking Id</th>
              <th className="px-4 py-2 text-left">Customer Name</th>
              <th className="px-4 py-2 text-left">Total Amt.</th>
              <th className="px-4 py-2 text-left">Paid Amt.</th>
              <th className="px-4 py-2 text-left">Due Amt.</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">01</td>
              <td className="px-4 py-2">
                {new Date().toLocaleDateString()}
              </td>{" "}

              <td className="px-4 py-2">BKG-123456</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2 ">
                <div className="flex items-center">
                  <MdOutlineCurrencyRupee />
                  2000
                </div>
              </td>{" "}

              <td className="px-4 py-2 ">
                <div className="flex items-center">
                  <MdOutlineCurrencyRupee />
                  1000
                </div>
              </td>{" "}
              <td className="px-4 py-2">
                <div className="flex items-center">
                  <MdOutlineCurrencyRupee />
                  1000
                </div>
              </td>
              <td className="px-4 py-2 text-white font-medium bg-yellow-500">
                Partially Paid
              </td>

              <td className="px-4 py-2">
                <div className="flex justify-center gap-2 items-center">
                  <button className="text-blue-600 hover:text-gray-800 transition">
                    <IoEyeSharp size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 transition" onClick={()=>setShowModal(true)}>
                    <FaRegEdit size={18} />
                  </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Update Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount Paid</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                >
                  <option value="">Select Mode</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  console.log({ paymentDate, paidAmount, paymentMode });
                  setShowModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsDetails;

