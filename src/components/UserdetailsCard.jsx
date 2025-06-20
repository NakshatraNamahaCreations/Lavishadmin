import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userData } from "../json/data";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuthAxios, getAxios } from "../utils/api";

const UserdetailsCard = () => {
    const { userid } = useParams();
    const [data, setData] = useState(null);
    const navigate = useNavigate();
    const authAxios = getAuthAxios()

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this user?')) {
            const response = await authAxios.delete(`/admin/users/user/${id}`);
            navigate("/users");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAxios().get(`/admin/users/${userid}`);
            console.log("User Details", response.data)
            setData(response.data.data);
        };
        fetchData();
    }, [userid]);

    // Conditional Rendering
    if (data === null) {
        return (
            <div className="bg-gray-100 flex items-center justify-center p-5">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 text-center">
                    <p className="text-lg text-gray-700">User not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 flex items-center justify-center p-5">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
                {/* Header Section */}
                <div className="flex items-center gap-5 mb-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
                        alt="User Profile"
                        className="w-24 h-24 rounded-full border-2 border-gray-300"
                    />
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-800">{data?.firstName} {data?.lastName}</h1>
                        <p className="text-gray-500">{data?.email}</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="text-gray-700">
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Mobile No:</p>
                        <p className="text-gray-600">{data?.mobile}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Alternate No:</p>
                        <p className="text-gray-600">{data?.alternateMobile}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Address:</p>
                        <p className="text-gray-600">{data?.addressLine1} {data?.addressLine2}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Landmark:</p>
                        <p className="text-gray-600">{data?.landmark}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-lg font-semibold">Pin Code:</p>
                        <p className="text-gray-600">{data?.pincode}</p>
                    </div>
                </div>

                {/* Action Section */}
                <div className="mt-6 flex justify-center gap-4">
                    <button className="bg-red-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-700 transition duration-300" onClick={(e) => handleDelete(data?._id, e)}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserdetailsCard;
