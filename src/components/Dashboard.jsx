import React, { useState } from 'react';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, getAxios } from '../utils/api';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [serviceCount, setServiceCount] = useState();
  const [userCount, setUserCount] = useState();
  const [orderCount, setOrderCount] = useState();

  const [serviceError, setServiceError] = useState("");
  const [userError, setUserError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setLoading(true);

    const fetchServiceCount = async () => {
      try {
        const res = await getAxios().get("https://api.lavisheventzz.com/api/services/getCount");
        console.log("ServiceCount", res.data);
        setServiceCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching service count:", error);
        setServiceError("Failed to fetch service count");
      }
    };

    const fetchUserCount = async () => {
      try {
        const res = await getAxios().get("https://api.lavisheventzz.com/api/admin/users/getCount");
        console.log("UserCount", res.data);
        setUserCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setUserError("Failed to fetch user count");
      }
    };

    const fetchOrderCount = async () => {
      try {
        const res = await getAxios().get("https://api.lavisheventzz.com/api/orders/getCount");
        console.log("OrderCount", res.data);
        setOrderCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching order count:", error);
        setOrderError("Failed to fetch order count");
      }
    };

    // Run all fetches in parallel, wait for all to complete before stopping loading
    Promise.allSettled([
      fetchServiceCount(),
      fetchUserCount(),
      fetchOrderCount(),
    ]).then(() => {
      setLoading(false);
    });
  }, []);


  // const totalProducts = 150;
  // const totalOrders = 120;
  // const totalUsers = 200;
  const totalEarnings = "50,00,000";
  const monthlyEarnings = "2,00,000";

  // Sample Data for Bar Chart (monthly sales for products)
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Products Sold',
        data: [30, 50, 70, 90, 110, 130],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for Bar Chart
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Products Sold',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-100 ">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {loading && <p className="text-blue-600 text-center my-4">Loading...</p>}

      {serviceError && <p className="text-red-500 text-center">{serviceError}</p>}
      {userError && <p className="text-red-500 text-center">{userError}</p>}
      {orderError && <p className="text-red-500 text-center">{orderError}</p>}
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {/* Total Products Card */}
        <div className="bg-white p-2 py-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{serviceCount}</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-2 py-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{orderCount}</p>
        </div>

        {/* Total Users Card */}
        <div className="bg-white p-2 py-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{userCount}</p>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white p-2 py-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Total Earnings</h3>
          <p className="text-2xl font-bold text-gray-900">Rs {totalEarnings}</p>
        </div>
        <div className="bg-white p-2 py-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">Monthly Earnings</h3>
          <p className="text-2xl font-bold text-gray-900">Rs {monthlyEarnings}</p>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white p-2 py-4 rounded-lg shadow-md">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;
