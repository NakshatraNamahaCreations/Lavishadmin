import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { getAxios } from "../../utils/api";

const BigCalendar = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const localizer = momentLocalizer(moment);

   useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const status = "created"; // You can also make this dynamic via props or state
        const response = await getAxios().get(`/orders/`, {
          params: { status },
        });
        console.log("Fetched Orders:", response.data);
        setBookingData(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
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
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Loading...</span>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default BigCalendar;
