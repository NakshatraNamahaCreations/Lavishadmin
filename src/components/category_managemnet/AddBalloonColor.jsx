import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import axios from "axios";
import { getAuthAxios, getAuthToken, getAxios } from "../../utils/api";

const AddBalloonColor = () => {
  const [balloons, setBalloons] = useState([]);
  const [balloonColor, setBalloonColor] = useState("");
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBalloonId, setCurrentBalloonId] = useState(null);

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!balloonColor.trim() || !qty) {
      alert("All fields should be filled");
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      const authAxios = getAuthAxios();

      if (!token) {
        setError("You must be logged in to manage Balloons");
        setLoading(false);
        return;
      }

      const obj = { balloonColor, qty };

      if (editMode && currentBalloonId) {
        await authAxios.put(`/balloons/update/${currentBalloonId}`, obj);
      } else {
        await authAxios.post("/balloons/create", obj);
      }

      resetForm();
      fetchBalloons();
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBalloonColor("");
    setQty("");
    setEditMode(false);
    setCurrentBalloonId(null);
  };

  const fetchBalloons = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAxios().get("/balloons/");
      if (res.status !== 200) {
        throw new Error("something went wrong");
      }
      setBalloons(res.data.data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentBalloonId(item?._id);
    setBalloonColor(item?.balloonColor);
    setQty(item?.qty);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      const authAxios = getAuthAxios();
      const token = getAuthToken();

      if (!token) {
        setError("You must be logged in to delete categories");
        return;
      }

      const response = await authAxios.delete(`/balloons/delete/${id}`);
      fetchBalloons();

      console.log("res", response);
    } catch (error) {
      console.log("err", error.message);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchBalloons();
  }, []);

  return (
    <div className="min-h-screen shadow-lg  rounded-lg bg-white p-6 lg:p-2">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editMode ? "Update Balloon" : "Add Balloon Color"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleFormSubmit}>
          <div className="max-w-xl flex flex-col sm:flex-row gap-4 mb-8">
            <input
              type="text"
              value={balloonColor}
              onChange={(e) => setBalloonColor(toTitleCase(e.target.value))}
              placeholder="Enter category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="Number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Enter Qty of packets"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <div className="flex gap-2">
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
                type="submit"
              >
                {loading ? "Processing..." : editMode ? "Update" : "Add"}
              </button>
              {editMode && (
                <button
                  onClick={resetForm}
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 ml-3 rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="p-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Balloons Color
          </h3>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead className="sticky top-0 bg-gray-200 z-10">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Balloons Color
                  </th>
                  <th className="text-center border border-gray-300 px-4 py-2 ">
                    Qty in packet
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {balloons.length !== 0 ? (
                  balloons.map((balloon) => (
                    <tr className="hover:bg-gray-50 " key={balloon?._id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {balloon?.balloonColor}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {balloon?.qty} packets
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(balloon)}
                            className="text-gray-600 hover:text-gray-800 transition"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(balloon._id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-500 py-4">
                      No Balloons to display.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBalloonColor;
