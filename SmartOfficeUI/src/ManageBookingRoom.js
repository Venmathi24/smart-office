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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const ManageBookingRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [roomDTO, setRoomDTO] = useState({
    name: "",
    capacity: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);

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

  const handleAddOrUpdateRoom = async () => {
    try {
      if (isEdit && editRoomId != null) {
        await axios.put(
          `http://localhost:8083/api/Book-Meeting/admin/update-room?id=${editRoomId}`,
          roomDTO
        );
        alert("Room updated successfully");
      } else {
        await axios.post(
          "http://localhost:8083/api/Book-Meeting/admin/add",
          roomDTO
        );
        alert("Room added successfully");
      }
      setRoomDTO({ name: "", capacity: "" });
      setIsEdit(false);
      setEditRoomId(null);
      fetchRooms();
    } catch (error) {
      alert("Operation failed");
      console.error(error);
    }
  };

  const handleEditClick = (room) => {
    setRoomDTO({
      name: room.name,
      capacity: room.capacity,
    });
    setIsEdit(true);
    setEditRoomId(room.id);
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(
        `http://localhost:8083/api/Book-Meeting/admin/delete-room?id=${roomId}`
      );
      alert("Room deleted successfully");
      fetchRooms();
    } catch (error) {
      alert("Delete failed");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Manage Meeting Rooms
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? "Update Room" : "Add New Room"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Room Name"
              fullWidth
              value={roomDTO.name}
              onChange={(e) => setRoomDTO({ ...roomDTO, name: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Capacity"
              type="number"
              fullWidth
              value={roomDTO.capacity}
              onChange={(e) =>
                setRoomDTO({ ...roomDTO, capacity: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12}>
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

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Existing Rooms
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.id}</TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(room)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {rooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
