import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import axios from "axios";

const ParkingSlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchSlots();
  }, [filter]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8082/parking-slots/all/parking-slots";
      if (filter === "used") url += "?occupied=true";
      else if (filter === "unused") url += "?occupied=false";
      const res = await axios.get(url);
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to fetch slots", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (slot = null) => {
    setEditingSlot(
      slot || {
        slotNumber: "",
        location: "",
        vehicleTypeCompatibility: "",
        occupied: false,
        occupiedByEmployeeCode: "",
        occupationStartTime: "",
      }
    );
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingSlot(null);
  };

  const handleSave = async () => {
    try {
      if (editingSlot.id) {
        await axios.put(
          `http://localhost:8082/parking-slots/${editingSlot.id}`,
          editingSlot
        );
      } else {
        await axios.post(
          "http://localhost:8082/parking-slots/add/parking-slots",
          editingSlot
        );
      }
      fetchSlots();
      handleDialogClose();
    } catch (err) {
      console.error("Error saving slot", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await axios.delete(`http://localhost:8082/parking-slots/${id}`);
      fetchSlots();
    } catch (err) {
      console.error("Error deleting slot", err);
    }
  };

  const handleChange = (field, value) => {
    setEditingSlot({ ...editingSlot, [field]: value });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{ mt: 4, mb: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h5">Parking Slots</Typography>
        {userRole === "admin" && (
          <Button variant="contained" onClick={() => handleDialogOpen()}>
            Add Slot
          </Button>
        )}
      </Box>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(e, val) => val && setFilter(val)}
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="used">Used</ToggleButton>
        <ToggleButton value="unused">Unused</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Slot Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Occupied By</TableCell>
              <TableCell>Occupation Time</TableCell>
              {userRole === "admin" && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.slotNumber}</TableCell>
                <TableCell>{slot.location}</TableCell>
                <TableCell>{slot.vehicleTypeCompatibility}</TableCell>
                <TableCell>
                  {slot.occupied ? slot.occupiedByEmployeeCode : "-"}
                </TableCell>
                <TableCell>
                  {slot.occupied ? slot.occupationStartTime : "-"}
                </TableCell>
                {userRole === "admin" && (
                  <TableCell>
                    <Button size="small" onClick={() => handleDialogOpen(slot)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(slot.id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingSlot?.id ? "Edit Slot" : "Add Slot"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Slot Number"
            value={editingSlot?.slotNumber || ""}
            onChange={(e) => handleChange("slotNumber", e.target.value)}
          />
          <TextField
            label="Location"
            value={editingSlot?.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
          />

          <TextField
            select
            label="Vehicle Type Compatibility"
            value={editingSlot?.vehicleTypeCompatibility || ""}
            onChange={(e) =>
              handleChange("vehicleTypeCompatibility", e.target.value)
            }
          >
            <MenuItem value="Two Wheeler">Two Wheeler</MenuItem>
            <MenuItem value="Four Wheeler">Four Wheeler</MenuItem>
          </TextField>

          <TextField
            select
            label="Occupied"
            value={editingSlot?.occupied.toString() || "false"}
            onChange={(e) =>
              handleChange("occupied", e.target.value === "true")
            }
          >
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </TextField>

          {editingSlot?.occupied && (
            <>
              <TextField
                label="Occupied By Employee Code"
                value={editingSlot?.occupiedByEmployeeCode || ""}
                onChange={(e) =>
                  handleChange("occupiedByEmployeeCode", e.target.value)
                }
              />
              <TextField
                label="Occupation Start Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={editingSlot?.occupationStartTime || ""}
                onChange={(e) =>
                  handleChange("occupationStartTime", e.target.value)
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ParkingSlotsPage;
