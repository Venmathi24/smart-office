import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid 
} from "@mui/material";
import axios from "axios";
const locations = ["Chennai", "Pune"];

 

const initialBookings = [
  { id: 1, roomId: 1, date: "2025-06-04", startTime: "10:00", endTime: "11:00", bookedBy: "User1" },
  { id: 2, roomId: 2, date: "2025-06-04", startTime: "12:00", endTime: "13:00", bookedBy: "User2" },
];

// Function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Function to get current time and end time (next 30 min)
const getDefaultTimes = () => {
  const now = new Date();
  const startHours = now.getHours();
  const startMinutes = now.getMinutes();

  const startTime = `${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`;

  const endTime = new Date(now.getTime() + 30 * 60000);
  const endHours = endTime.getHours();
  const endMinutes = endTime.getMinutes();

  const formattedEndTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;

  return { startTime, endTime: formattedEndTime };
};

const MeetingRoomBookingPage = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [location, setLocation] = useState("");
  const [floor, setFloor] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [startTime, setStartTime] = useState(getDefaultTimes().startTime);
  const [endTime, setEndTime] = useState(getDefaultTimes().endTime);
  const [user, setUser] = useState("");

  

  const [meetingRooms, setMeetingRooms] = useState([]); 
  const roomDetails = meetingRooms.find((room) => room.id === selectedRoom);// ✅ Move inside the component

  const fetchMeetingRooms = async (location, floor) => {
  try {
    const response = await axios.post("http://localhost:8083/api/Book-Meeting/booking-meeting/available-rooms", {
      location,
      floor: floor || 0 // If floor is empty or 0, send 0
    });
    return response.data; // Return fetched rooms
  } catch (error) {
    console.error("Error fetching meeting rooms:", error);
    return [];
  }
};

const fetchBookings = async (roomId, date) => {
  try {
    const response = await axios.get(`http://localhost:8083/api/Book-Meeting/booking-meeting/bookings`, {
      params: { roomId, date }
    });
    return response.data; // Return fetched bookings
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};


  useEffect(() => {
    const getRooms = async () => {
      if (location) {
        const rooms = await fetchMeetingRooms(location, floor);
        setMeetingRooms(rooms);
         if (rooms.length === 0) {
        setBookings([]); // Clears bookings
      } else {
        const roomBookings = await fetchBookings(rooms[0].id, date);
        setBookings(roomBookings);
      }
      }
    };
    getRooms();
  }, [location, floor]);
useEffect(() => {
  const getBookings = async () => {
    if (selectedRoom) {
      const roomBookings = await fetchBookings(selectedRoom, date);
      setBookings(roomBookings);
    } else {
      setBookings([]); // Clear bookings if no room is selected
    }
  };

  getBookings();
}, [selectedRoom]);
  useEffect(() => {
  const getBookings = async () => {
    if (selectedRoom) {
      const roomBookings = await fetchBookings(selectedRoom, date);
      setBookings(roomBookings);
    } else {
      setBookings([]); // Clear bookings if no room is selected
    }
  };

  getBookings();
}, [selectedRoom]);

  const handleRoomChange = (event) => {
    const selected = event.target.value;
    setSelectedRoom(selected);
  
  };

  const handleBooking = () => {
    if (!selectedRoom || !date || !startTime || !endTime || !user) {
      alert("Please fill all fields!");
      return;
    }

    const conflict = bookings.some(
      (booking) =>
        booking.roomId === selectedRoom &&
        booking.date === date &&
        !(
          endTime <= booking.startTime || 
          startTime >= booking.endTime
        )
    );

    if (conflict) {
      alert("Booking conflict detected! Choose a different time slot.");
      return;
    }

    setBookings([...bookings, { id: Date.now(), roomId: selectedRoom, date, startTime, endTime, bookedBy: user }]);
  };

  const handleCancel = async (id) => {
  try {
    await axios.delete(`http://localhost:8083/api/Book-Meeting/booking-meeting/cancel/${id}`);
    alert("Booking canceled successfully!");
    setBookings(bookings.filter((booking) => booking.id !== id)); // Remove from UI
  } catch (error) {
    console.error("Error canceling booking:", error);
    alert("Failed to cancel booking. Try again later.");
  }
};

  const saveBooking = async () => {
if (!selectedRoom) {
    alert("Please select a room before booking!");
    return;
  }

  let user = localStorage.getItem("username"); // ✅ Use `let`, so it can be reassigned later
  
  if (!selectedRoom || !date || !startTime || !endTime) {
    alert("Please fill all fields!");
    return;
  }

  const bookingData = {
    roomId: selectedRoom,
    roomName,
    location,
    floor,
    date,
    startTime,
    endTime,
    bookedBy: user
  };

  try {
    const response = await axios.post("http://localhost:8083/api/Book-Meeting/booking-meeting/save", bookingData);
    alert("Booking saved successfully!");
    setBookings([...bookings, response.data]); // Updating UI after saving
  } catch (error) {
    console.error("Error saving booking:", error);
    alert("Failed to save booking. Try again later.");
  }
};

  return (
  <Container sx={{ padding: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
    <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5", mb: 2 }}>
      Meeting Room Booking
    </Typography>

<FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel>Select Location</InputLabel>
  <Select value={location} onChange={(e) => setLocation(e.target.value)}>
    {locations.map((loc) => (
      <MenuItem key={loc} value={loc}>
        {loc}
      </MenuItem>
    ))}
  </Select>
</FormControl>
    <TextField type="number"  fullWidth label="Floor" value={floor} onChange={(e) => setFloor(e.target.value)} sx={{ mb: 2 }} />
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Select Room</InputLabel>
      <Select value={selectedRoom} onChange={handleRoomChange}>
        {meetingRooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            {room.name} (Capacity: {room.capacity})
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    
    <TextField fullWidth label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} sx={{ mb: 2 }} />
    <TextField fullWidth label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} sx={{ mb: 2 }} />

    <Button 
  variant="contained" 
  onClick={saveBooking} 
  sx={{ mt: 2, backgroundColor: "#3f51b5", "&:hover": { backgroundColor: "#303f9f" } }}
  disabled={meetingRooms.length === 0} // Disable if no rooms available
>
  Book Room
</Button>

    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#3f51b5", mt: 3 }}>
      Existing Bookings
    </Typography>
    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
            <TableCell>Room</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Booked By</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
       <TableBody>
  {bookings.length === 0 ? (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No bookings found for this room.
      </TableCell>
    </TableRow>
  ) : (
    bookings.map((booking) => (
      <TableRow key={booking.id}>
        <TableCell>{roomDetails?.name}</TableCell>
        <TableCell>{booking.date}</TableCell>
        <TableCell>{booking.startTime}</TableCell>
        <TableCell>{booking.endTime}</TableCell>
        <TableCell>{booking.bookedBy}</TableCell>
        <TableCell>
      {booking.bookedBy === localStorage.getItem("username") && (
        <Button 
          variant="outlined" 
          color="error" 
          onClick={() => handleCancel(booking.id)} 
          sx={{ "&:hover": { backgroundColor: "#f8d7da" } }}
        >
          Cancel
        </Button>
      )}
    </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
      </Table>
    </TableContainer>
  </Container>
);
};

export default MeetingRoomBookingPage;
