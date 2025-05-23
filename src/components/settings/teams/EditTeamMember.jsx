import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Define available tabs and their labels
const availableTabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "User Details" },
  { key: "enquiry", label: "Enquiry" },
  { key: "banner", label: "Banner" },
  { key: "add_category", label: "Add Category" },
  { key: "add_subcategory", label: "Add Sub Category" },
  { key: "add_sub_subcategory", label: "Add Sub Sub Category" },
  { key: "add_theme", label: "Add Theme" },
  { key: "add_balloonColor", label: "Add Balloons Color" },
  { key: "service_list", label: "Add Service" },
  { key: "addons_list", label: "Add-ons" },
  { key: "coupon", label: "Coupons" },
  { key: "booking_details", label: "Booking Details" },
  { key: "cancelled_bookings", label: "Cancelled Bookings" },
  { key: "rescheduled_bookings", label: "Rescheduled Bookings" },
  { key: "completed_bookings", label: "Completed Bookings" },
  { key: "payment_details", label: "Payment Details" },
  { key: "report", label: "Reports" },
  { key: "teams", label: "Teams" },
];

const EditTeamMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    name: '',
    mobile: '',
    email: '',
    profileImage: null,
    accessTabs: [],
  });
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/auth/getAdminById/${id}`);
      const memberData = response.data.admin;
      setMember({
        name: memberData.name,
        mobile: memberData.mobile,
        email: memberData.email,
        accessTabs: memberData.accessTabs,
      });
      setSelectAll(memberData.accessTabs.length === availableTabs.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching member details:", error);
      alert("Failed to fetch member details");
      navigate("/teams");
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setMember({ ...member, accessTabs: [] });
    } else {
      setMember({ ...member, accessTabs: availableTabs.map(tab => tab.key) });
    }
    setSelectAll(!selectAll);
  };

  // Handle "Clear All" button
  const handleClearAll = () => {
    setMember({ ...member, accessTabs: [] });
    setSelectAll(false);
  };

  // Handle individual tab checkbox change
  const handleCheckboxChange = (tabKey) => {
    const updatedTabs = member.accessTabs.includes(tabKey)
      ? member.accessTabs.filter((key) => key !== tabKey)
      : [...member.accessTabs, tabKey];

    setMember({ ...member, accessTabs: updatedTabs });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  const handleFileChange = (e) => {
    setMember({ ...member, profileImage: e.target.files[0] });
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', member.name);
    formData.append('email', member.email);
    formData.append('mobile', member.mobile);
    formData.append('accessTabs', JSON.stringify(member.accessTabs));

    if (member.profileImage) {
      formData.append('profileImage', member.profileImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/admin/auth/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Team member updated successfully!");
      navigate("/settings/teams");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update team member");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <form onSubmit={handleUpdateMember} encType="multipart/form-data" className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Team Member</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={member.mobile}
            onChange={handleInputChange}
            maxLength={10}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={member.email}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Profile Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Tab Access</label>
        
        {/* Select All / Clear All Buttons */}
        <div className="flex items-center mb-4 justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <span className="text-gray-600">Select All</span>
          </label>
          {member.accessTabs.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="ml-4 text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Tab checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableTabs.map((tab) => (
            <label key={tab.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={member.accessTabs.includes(tab.key)}
                onChange={() => handleCheckboxChange(tab.key)}
              />
              <span className="text-gray-600">{tab.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate("/settings/teams")}
          className="bg-gray-500 hover:bg-gray-600 transition-colors text-white font-medium px-6 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-6 py-2 rounded"
        >
          Update Member
        </button>
      </div>
    </form>
  );
};

export default EditTeamMember; 