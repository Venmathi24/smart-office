import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

const MeetingRoomBookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomRequest, setRoomRequest] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const [bookingDetails, setBookingDetails] = useState({
    id: "",
    roomId: "",
    employeeCode: "",
    date: "",
    startTime: "",
    endTime: "",
    title: "",
  });

  const [bookings, setBookings] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    const employeeCode = localStorage.getItem("employeeCode") || "";

    setUserRole(role);
    setBookingDetails((prev) => ({
      ...prev,
      employeeCode: employeeCode,
    }));
  }, []);

  // Fetch available rooms based on date/time search
  const getAvailableRooms = async () => {
    try {
      const formattedRequest = {
        date: roomRequest.date,
        startTime: roomRequest.startTime + ":00",
        endTime: roomRequest.endTime + ":00",
        capacity: 0,
      };

      const response = await axios.post(
        "http://localhost:8083/api/Book-Meeting/all",
        formattedRequest,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
      alert("Failed to fetch rooms. Please check the date/time format.");
    }
  };

  // Fetch bookings filtered by roomId and date
  const fetchBookingsByRoomAndDate = async (roomId, date) => {
    if (!roomId || !date) {
      setBookings([]);
      return;
    }

    try {
      console.log("Fetching bookings for room", roomId, "and date", date);
      const response = await axios.get(
        `http://localhost:8083/api/bookings/by-room?roomId=${roomId}&date=${date}`
      );
      console.log("Bookings fetched:", response.data);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching filtered bookings:", error);
      setBookings([]);
    }
  };

  // Watch changes in bookingDetails.roomId and bookingDetails.date to reload bookings table
  useEffect(() => {
    if (bookingDetails.roomId && bookingDetails.date) {
      fetchBookingsByRoomAndDate(
        parseInt(bookingDetails.roomId, 10),
        bookingDetails.date
      );
    } else {
      setBookings([]);
    }
  }, [bookingDetails.roomId, bookingDetails.date]);

  const bookRoom = async () => {
    try {
      const payload = {
        id: bookingDetails.id ? parseInt(bookingDetails.id) : 0,
        roomId: parseInt(bookingDetails.roomId),
        date: bookingDetails.date,
        startTime: bookingDetails.startTime + ":00",
        endTime: bookingDetails.endTime + ":00",
        title: bookingDetails.title,
        employeeCode: parseInt(bookingDetails.employeeCode),
      };

      if (isEdit) {
        await axios.put(
          `http://localhost:8083/api/Book-Meeting/Bookings`,
          payload
        );
        alert("Booking updated successfully");
        setIsEdit(false);
      } else {
        await axios.post(
          "http://localhost:8083/api/Book-Meeting/Bookings",
          payload
        );
        alert("Booking successful");
      }

      setBookingDetails({
        id: "",
        roomId: "",
        employeeCode: bookingDetails.employeeCode,
        date: "",
        startTime: "",
        endTime: "",
        title: "",
      });

      // Refresh bookings after booking update or create
      if (bookingDetails.roomId && bookingDetails.date) {
        fetchBookingsByRoomAndDate(
          parseInt(bookingDetails.roomId, 10),
          bookingDetails.date
        );
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Booking failed", error);
      alert(
        "Booking action failed: " + (error?.response?.data || "Check console")
      );
    }
  };

  const handleEdit = (booking) => {
    setIsEdit(true);
    setBookingDetails({
      id: booking.id.toString(),
      roomId: booking.roomId || booking.meetingRoom?.id,
      employeeCode: booking.employeeCode.toString(),
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      title: booking.title,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8083/api/Book-Meeting/cancelBooking?id=${id}`
      );
      alert("Booking deleted successfully");

      // Refresh bookings after delete
      if (bookingDetails.roomId && bookingDetails.date) {
        fetchBookingsByRoomAndDate(
          parseInt(bookingDetails.roomId, 10),
          bookingDetails.date
        );
      } else {
        setBookings([]);
      }
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Meeting Room Booking
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Check Available Rooms
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={roomRequest.date}
              onChange={(e) =>
                setRoomRequest({ ...roomRequest, date: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={roomRequest.startTime}
              onChange={(e) =>
                setRoomRequest({ ...roomRequest, startTime: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="End Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={roomRequest.endTime}
              onChange={(e) =>
                setRoomRequest({ ...roomRequest, endTime: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={getAvailableRooms}
            >
              Search Rooms
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Update Booking" : "Book a Room"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Room</InputLabel>
              <Select
                value={bookingDetails.roomId}
                label="Room"
                onChange={(e) => {
                  setBookingDetails({
                    ...bookingDetails,
                    roomId: e.target.value,
                  });
                }}
              >
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Meeting Title"
              fullWidth
              value={bookingDetails.title}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  title: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Employee Code"
              fullWidth
              value={bookingDetails.employeeCode}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookingDetails.date}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, date: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookingDetails.startTime}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  startTime: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={bookingDetails.endTime}
              onChange={(e) =>
                setBookingDetails({
                  ...bookingDetails,
                  endTime: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color={isEdit ? "warning" : "success"}
              onClick={bookRoom}
            >
              {isEdit ? "Update Booking" : "Book Room"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {userRole === "admin" && bookings.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Existing Bookings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Employee Code</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.roomId || b.meetingRoom?.id}</TableCell>
                    <TableCell>{b.title}</TableCell>
                    <TableCell>{b.employeeCode}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>
                      {b.startTime} - {b.endTime}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(b)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(b.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {bookings.length === 0 && (
            <Typography>No bookings found for selected date & room.</Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default MeetingRoomBookingPage;
