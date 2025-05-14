import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";

const BigCalendar = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);

  const localizer = momentLocalizer(moment);

  // Fetch order data from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const status = "created"; // You can also make this dynamic via props or state
        const response = await fetch(`http://localhost:5000/api/orders?status=${status}`);
        const data = await response.json();
        console.log("Fetched Orders:", data);
        setBookingData(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);


  // Preprocess events to group by eventDate and count bookings
  const processedEvents = bookingData.reduce((acc, order) => {
    const date = moment(order.eventDate).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = { count: 0, date: order.eventDate };
    }
    acc[date].count += 1;
    return acc;
  }, {});

  // Convert grouped events into an array
  const eventCounts = Object.values(processedEvents).map(item => ({
    title: `${item.count} bookings`, // Display the number of bookings on that date
    start: new Date(item.date),
    end: new Date(item.date),
    date: item.date, // Store the date for later use
  }));

  // Handle event click
  const handleEventClick = (event) => {
    const date = event.date; // Get the date from the clicked event
    navigate(`/orderdetails/booking-details/${date}`); // Pass the date in the URL
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Booking Calendar
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={eventCounts}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          defaultView="month"
          views={["month", "week", "day"]}
          popup
          onSelectEvent={handleEventClick} // Trigger the event handler on click
        />
      </div>
    </div>
  );
};

export default BigCalendar;
