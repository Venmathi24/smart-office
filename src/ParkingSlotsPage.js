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
  Paper,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

const ParkingSlotsPage = () => {
  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
    fetchSlots();
  }, [filter]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8082/parking-slots/all/parking-slots";
      if (filter === "used") url += "?occupied=true";
      if (filter === "unused") url += "?occupied=false";
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
      slot ?? {
        slotNumber: "",
        location: "",
        vehicleTypeCompatibility: "",
        isOccupied: false,
        occupiedByEmployeeName: "",
        occupationStartTime: "",
      }
    );
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingSlot(null);
    setEmployeeList([]);
  };

  const handleSave = async () => {
    if (
      !editingSlot.slotNumber ||
      !editingSlot.location ||
      !editingSlot.vehicleTypeCompatibility
    ) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    if (editingSlot.isOccupied) {
      if (
        !editingSlot.occupiedByEmployeeName ||
        editingSlot.occupiedByEmployeeName.trim() === ""
      ) {
        alert("Please select an employee.");
        return;
      }
      if (!editingSlot.occupationStartTime) {
        alert("Please provide occupation start time.");
        return;
      }
    }

    // Prepare payload with correct formats
    let payload = { ...editingSlot };

    if (!payload.isOccupied) {
      payload.occupiedByEmployeeName = "";
      payload.occupationStartTime = "";
    } else {
      // Normalize occupationStartTime to ISO string if possible
      if (payload.occupationStartTime) {
        let dt = new Date(payload.occupationStartTime);
        if (!isNaN(dt.getTime())) {
          payload.occupationStartTime = dt.toISOString();
        } else {
          payload.occupationStartTime = "";
        }
      }

      // Ensure occupiedByEmployeeName is string
      if (
        typeof payload.occupiedByEmployeeName === "object" &&
        payload.occupiedByEmployeeName !== null
      ) {
        payload.occupiedByEmployeeName = payload.occupiedByEmployeeName.label || "";
      }
    }

    try {
      if (payload.id) {
        await axios.put(`http://localhost:8082/parking-slots/${payload.id}`, payload);
      } else {
        await axios.post("http://localhost:8082/parking-slots/add/parking-slots", payload);
      }
      fetchSlots();
      handleDialogClose();
    } catch (err) {
      console.error("Error saving slot", err.response || err);
      alert("Failed to save the parking slot.");
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

  const handleChange = (field, value) =>
    setEditingSlot({ ...editingSlot, [field]: value });

  useEffect(() => {
    const term = editingSlot?.occupiedByEmployeeName ?? "";
    if (term.length > 2) {
      axios
        .get(`http://localhost:8080/user/employees/${term}`)
        .then((res) =>
          setEmployeeList(res.data.map((emp) => ({ label: emp.name })))
        )
        .catch((err) => console.error("Error fetching employees:", err));
    } else {
      setEmployeeList([]);
    }
  }, [editingSlot?.occupiedByEmployeeName]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        pb: 4,
         backgroundColor: "rgb(223 238 245)", 
        borderRadius: 2,
        boxShadow: 3,
        minHeight: "80vh",
        p: 3,
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          Parking Slots
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => val && setFilter(val)}
          sx={{ bgcolor: "white", borderRadius: 2, p: 1 }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="used">Used</ToggleButton>
          <ToggleButton value="unused">Unused</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {userRole === "admin" && (
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button variant="contained" onClick={() => handleDialogOpen()}>
            Add Slot
          </Button>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflowX: "auto", p: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Slot Number
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Location
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Vehicle Type
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Occupied By
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Occupation Time
                </TableCell>
                {userRole === "admin" && (
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.slotNumber}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell>{s.vehicleTypeCompatibility}</TableCell>
                  <TableCell>{s.isOccupied ? s.occupiedByEmployeeName : "-"}</TableCell>
                  <TableCell>
                    {s.isOccupied && s.occupationStartTime
                      ? new Date(s.occupationStartTime).toLocaleString()
                      : "-"}
                  </TableCell>
                  {userRole === "admin" && (
                    <TableCell>
                      <Button size="small" onClick={() => handleDialogOpen(s)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingSlot?.id ? "Edit Slot" : "Add Slot"}</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Slot Number"
            value={editingSlot?.slotNumber || ""}
            onChange={(e) => handleChange("slotNumber", e.target.value)}
            fullWidth
          />
          <TextField
            label="Location"
            value={editingSlot?.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Vehicle Type Compatibility"
            value={editingSlot?.vehicleTypeCompatibility || ""}
            onChange={(e) => handleChange("vehicleTypeCompatibility", e.target.value)}
            fullWidth
          >
            <MenuItem value="Two Wheeler">Two Wheeler</MenuItem>
            <MenuItem value="Four Wheeler">Four Wheeler</MenuItem>
          </TextField>
          <TextField
  select
  label="Occupied"
  value={editingSlot?.isOccupied ? "true" : "false"}  // string for select control
  onChange={(e) => {
    const val = e.target.value === "true"; // convert string to boolean
    handleChange("isOccupied", val);
  }}
  fullWidth
>
  <MenuItem value="false">No</MenuItem>
  <MenuItem value="true">Yes</MenuItem>
</TextField>

          {editingSlot?.isOccupied && (
            <>
              <Autocomplete
                options={employeeList}
                getOptionLabel={(option) => option.label || ""}
                value={
                  employeeList.find(
                    (emp) => emp.label === editingSlot?.occupiedByEmployeeName
                  ) ||
                  (editingSlot?.occupiedByEmployeeName
                    ? { label: editingSlot.occupiedByEmployeeName }
                    : null)
                }
                onInputChange={(event, newInputValue) => {
                  handleChange("occupiedByEmployeeName", newInputValue);
                }}
                onChange={(event, newValue) => {
                  handleChange("occupiedByEmployeeName", newValue?.label || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Occupied By (Employee Name)" fullWidth />
                )}
                freeSolo
              />

              <TextField
                label="Occupation Start Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={
                  editingSlot?.occupationStartTime
                    ? new Date(editingSlot.occupationStartTime)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) => handleChange("occupationStartTime", e.target.value)}
                fullWidth
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
