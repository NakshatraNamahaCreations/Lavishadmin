import React, { useState } from 'react';
import axios from 'axios';

// Define available tabs and their labels
const availableTabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "User Details" },
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

const AddTeamMember = () => {
  const [newMember, setNewMember] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    profileImage: null,
    accessTabs: [],
  });

  const [selectAll, setSelectAll] = useState(false);

  // Handle "Select All" checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      // Unselect all if "Select All" is checked
      setNewMember({ ...newMember, accessTabs: [] });
    } else {
      // Select all tabs
      setNewMember({ ...newMember, accessTabs: availableTabs.map(tab => tab.key) });
    }
    setSelectAll(!selectAll);
  };

  // Handle "Clear All" button
  const handleClearAll = () => {
    setNewMember({ ...newMember, accessTabs: [] });
    setSelectAll(false);
  };

  // Handle individual tab checkbox change
  const handleCheckboxChange = (tabKey) => {
    const updatedTabs = newMember.accessTabs.includes(tabKey)
      ? newMember.accessTabs.filter((key) => key !== tabKey)
      : [...newMember.accessTabs, tabKey];

    setNewMember({ ...newMember, accessTabs: updatedTabs });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', newMember.name);
    formData.append('email', newMember.email);
    formData.append('mobile', newMember.mobile);
    formData.append('password', newMember.password);

    // Attach image file if provided
    if (newMember.profileImage) {
      formData.append('profileImage', newMember.profileImage);
    }

    // Convert accessTabs array to JSON string
    formData.append('accessTabs', JSON.stringify(newMember.accessTabs));

    try {
      const res = await axios.post('http://localhost:5000/api/admin/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Team member added successfully!");
      console.log("Created Admin:", res.data.admin);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add team member");
    }

    setNewMember({
      name: '',
      mobile: '',
      email: '',
      password: '',
      profileImage: null,
      accessTabs: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewMember({ ...newMember, profileImage: e.target.files[0] });
  };

  return (
    <form onSubmit={handleAddMember} encType="multipart/form-data" className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Team Member</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={newMember.name}
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
            value={newMember.mobile}
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
            value={newMember.email}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={newMember.password}
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
          {newMember.accessTabs.length > 0 && (
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
                checked={newMember.accessTabs.includes(tab.key)}
                onChange={() => handleCheckboxChange(tab.key)}
              />
              <span className="text-gray-600">{tab.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-gray-600 hover:bg-gray-700 transition-colors text-white font-medium px-6 py-2 rounded"
        >
          Add Member
        </button>
      </div>
    </form>
  );
};

export default AddTeamMember;
