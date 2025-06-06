import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { IoEyeSharp } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';
import { getAuthAxios, getAxios } from "../../../utils/api";

const Teams = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const authAxios = getAuthAxios()

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await getAxios().get("/admin/auth/teamMembers");
      setTeamMembers(response.data.admins);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleAddMember = () => {
    navigate("/teams/add-member");
  };

  const handleEditMember = (memberId) => {
    navigate(`/teams/edit-member/${memberId}`);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await authAxios.delete(`/admin/auth/delete/${memberId}`);
        alert("Team member deleted successfully!");
        // Refresh the team members list
        fetchTeamMembers();
      } catch (error) {
        console.error("Error deleting team member:", error);
        alert(error.response?.data?.message || "Failed to delete team member");
      }
    }
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
                      src={`${member?.profileImage}`}
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
                    <button
                      onClick={() => handleEditMember(member._id)}
                      className="text-gray-600 hover:text-gray-800 transition"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member._id)}
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
