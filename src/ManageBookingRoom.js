import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,MenuItem ,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useForm } from "react-hook-form";


const ManageBookingRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomDTO, setRoomDTO] = useState({
  name: "",
  capacity: "",
  location: "",
  floor: "",
});

// const { register, handleSubmit, formState: { errors }, reset } = useForm();
const { register, handleSubmit, formState: { errors }, reset } = useForm({
  mode: "onBlur",
});
  const [isEdit, setIsEdit] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const locationOptions = ["Chennai", "Pune"];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8083/api/Book-Meeting/existing-rooms"
      );
      const data = Array.isArray(response.data) ? response.data : [];
      setRooms(data);

      // If no rooms, reset form to "Add" mode
      if (data.length === 0) {
        setIsEdit(false);
        setEditRoomId(null);
        setRoomDTO({ name: "", capacity: "" });
      }
    } catch (error) {
      console.error("Failed to fetch rooms", error);
      setRooms([]);
      setIsEdit(false);
      setEditRoomId(null);
      setRoomDTO({ name: "", capacity: "" });
    }
  };

  const handleEditClick = (room) => {
  setRoomDTO({
    name: room.name,
    capacity: room.capacity,
    location: room.location,  // Ensure location is captured
    floor: room.floor,        // Ensure floor is captured
  });
  setIsEdit(true);
  setEditRoomId(room.id);
};


const handleDelete = async (roomId) => {
  if (!window.confirm("Are you sure you want to delete this room?")) return; // Confirmation check

  try {
    await axios.delete(
      `http://localhost:8083/api/Book-Meeting/admin/delete-room?id=${roomId}`
    );
    alert("Room deleted successfully");
    fetchRooms(); // Refresh room list after deletion
  } catch (error) {
    alert("Delete operation failed");
    console.error("Error deleting room:", error);
  }
};

 const handleAddOrUpdateRoom = async () => {
  // Check if there are errors before proceeding
  const hasErrors = errors.name || errors.capacity || errors.floor;
  if (hasErrors) {
    alert("Please fill all required fields before submitting.");
    return; // Stop function execution
  }

  try {
    const user = localStorage.getItem("username") || "Unknown User";

    const updatedRoomDTO = {
      ...roomDTO,
      createdBy: isEdit ? roomDTO.createdBy : user, // Preserve original createdBy on update
      updatedBy: user, // Always update the updatedBy field
    };

    if (isEdit && editRoomId != null) {
      await axios.put(
        `http://localhost:8083/api/Book-Meeting/admin/update-room?id=${editRoomId}`,
        updatedRoomDTO
      );
      alert("Room updated successfully");
    } else {
      await axios.post(
        "http://localhost:8083/api/Book-Meeting/admin/add",
        updatedRoomDTO
      );
      alert("Room added successfully");
    }
    
    // Reset form
    setRoomDTO({ name: "", capacity: "", location: locationOptions[0], floor: "" });
    setIsEdit(false);
    setEditRoomId(null);
    fetchRooms();
  } catch (error) {
    alert("Operation failed");
    console.error(error);
  }
};





  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 5,
        pb: 4,
        backgroundColor: "rgb(223 238 245)", 
        borderRadius: 2,
        boxShadow: 3,
        minHeight: "80vh",
        p: 4,
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Meeting Rooms
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Update Room" : "Add New Room"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
  <TextField
    label="Room Name"
    fullWidth
    variant="outlined"
    {...register("name", { required: "Room Name is required" })}
    error={!!errors.name}
    helperText={errors.name?.message}
    value={roomDTO.name}
    onChange={(e) => setRoomDTO({ ...roomDTO, name: e.target.value })}
  />
</Grid>

         <Grid item xs={12} sm={6}>
  <TextField
    label="Capacity"
    type="number"
    fullWidth
    variant="outlined"
    {...register("capacity", { required: "Capacity is required", min: 1 })}
    error={!!errors.capacity}
    helperText={errors.capacity?.message}
    value={roomDTO.capacity}
    onChange={(e) => setRoomDTO({ ...roomDTO, capacity: e.target.value })}
  />
</Grid>
       <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    select
    label="Location"
    variant="outlined"
    value={roomDTO.location}
    onChange={(e) => setRoomDTO({ ...roomDTO, location: e.target.value })}
  >
    {locationOptions.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
</Grid>

<Grid item xs={12} sm={6}>
  <TextField
    label="Floor"
    type="number"
    fullWidth
    variant="outlined"
    {...register("floor", { required: "Floor is required", min: 1 })}
    error={!!errors.floor}
    helperText={errors.floor?.message}
    value={roomDTO.floor}
    onChange={(e) => setRoomDTO({ ...roomDTO, floor: e.target.value })}
  />
</Grid>

          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              color={isEdit ? "warning" : "primary"}
              onClick={handleAddOrUpdateRoom}
              disabled={isEdit && rooms.length === 0}
            >
              {isEdit ? "Update Room" : "Add Room"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>
          Existing Rooms
        </Typography>
        <TableContainer sx={{ maxHeight: "400px", overflowY: "auto" }}>
  <Table stickyHeader>
    <TableHead sx={{ bgcolor: "primary.main" }}>
      <TableRow>
        {["ID", "Name", "Capacity", "Location", "Floor", "Created By", "Updated By", "Actions"].map((col) => (
          <TableCell key={col} sx={{ color: "white", fontWeight: "bold" }}>
            {col}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {rooms.map((room) => (
        <TableRow key={room.id} hover>
          <TableCell>{room.id}</TableCell>
          <TableCell>{room.name}</TableCell>
          <TableCell>{room.capacity}</TableCell>
          <TableCell>{room.location}</TableCell>
          <TableCell>{room.floor}</TableCell>
          <TableCell>{room.createdBy}</TableCell>
          <TableCell>{room.updatedBy}</TableCell>
          <TableCell>
            <IconButton color="primary" onClick={() => handleEditClick(room)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(room.id)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
      {rooms.length === 0 && (
        <TableRow>
          <TableCell colSpan={8} align="center">
            No rooms available.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      </Paper>
    </Container>
  );
};

export default ManageBookingRoom;
