import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { IoEyeSharp } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';

const Teams = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);


  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/auth/teamMembers");
        setTeamMembers(response.data.admins); // Assuming the response contains the 'admins' array
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleAddMember = () => {
    navigate("/teams/add-member");
  };

  return (
    <div className="team-profile-container">
      <h1 className="text-2xl font-bold mb-6 text-center">Team Members</h1>

      {/* Button to open Add Member modal */}
      <div className="mb-4" onClick={handleAddMember}>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">
          Add Team Member
        </button>
      </div>

      {/* Table displaying team members */}
    {/* Table displaying team members */}
<table className="min-w-full table-auto border-collapse text-sm">
  <thead>
    <tr className="bg-gray-100 border-b">
      <th className="px-4 py-2 text-left">#</th>
      <th className="px-4 py-2 text-left">Name</th>
      <th className="px-4 py-2 text-left">Mobile</th>
      <th className="px-4 py-2 text-left">Email</th>
      <th className="px-4 py-2 text-left">Profile Image</th>
      <th className="px-4 py-2 text-left">Access Tabs</th>
      <th className="px-4 py-2 text-left">Actions</th>
    </tr>
  </thead>
  <tbody>
    {teamMembers.length > 0 ? (
      teamMembers.map((member, index) => (
        <tr key={member._id} className="border-b hover:bg-gray-50">
          <td className="px-4 py-2">{index + 1}</td>
          <td className="px-4 py-2">{member.name}</td>
          <td className="px-4 py-2">{member.mobile}</td>
          <td className="px-4 py-2">{member.email}</td>
          <td className="px-4 py-2 text-gray-500">
            {member.profileImage ? (
              <img
                src={`http://localhost:5000/images/${member.profileImage}`}
                alt="Profile"
                className="w-14 h-14 object-cover rounded-full"
              />
            ) : (
              <FaUserCircle size={54} />
            )}
          </td>
          <td className="px-4 py-2">
            <div className="flex flex-wrap gap-1">
              {member.accessTabs.map((tab, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tab}
                </span>
              ))}
            </div>
          </td>
          <td className="py-2">
            <div className="flex justify-center gap-2">
              {/* <button className="text-blue-600 hover:text-gray-800 transition">
                <IoEyeSharp size={18} />
              </button> */}
              <button className="text-gray-600 hover:text-gray-800 transition">
                <FiEdit size={16} />
              </button>
              <button className="text-red-600 hover:text-red-800 transition">
                <FiTrash2 size={16} />
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="text-center py-4">
          No team members found.
        </td>
      </tr>
    )}
  </tbody>
</table>

    </div>
  );
};

export default Teams;
