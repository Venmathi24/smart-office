import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";

const MarkAttendancePage = () => {
  const { handleSubmit, control, reset, setValue, watch, formState } = useForm({
    defaultValues: {
      employeeId: "",
      employeeName: "",
      status: "",
      autoCheckIn: false,
      transportMode: "",
      checkInMethod: "",
      checkInTime: "",
      checkOutTime: "",
    },
    mode: "onChange",
  });
  const [peakDayInfo, setPeakDayInfo] = useState(null);
  const fetchPeakDay = async () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((day + 6) % 7)); // Get Monday of this week

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Sunday

  const formatDate = (d) => d.toISOString().split('T')[0];

  try {
    const res = await axios.get(
  `http://localhost:8081/attendance/peak-day`,
  {
    params: {
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
    }
  }
);
    setPeakDayInfo(res.data);
  } catch (err) {
    console.error("Failed to fetch peak day info:", err);
  }
};
useEffect(() => {
  fetchPeakDay();
}, []);
  const { errors } = formState; // Retrieve validation errors

  const employeeName = watch("employeeName");
  const status = watch("status");
  const autoCheckIn = watch("autoCheckIn");

  const [employeeList, setEmployeeList] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [transportModes, setTransportModes] = useState([]);
  const [checkInMethods, setCheckInMethods] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState("");

  const isOffice = status === "In Office";
  const showCheckInMethod = isOffice && autoCheckIn;
  const showCheckTimes = isOffice && !autoCheckIn;

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    // Fetch dropdown options
    const fetchOptions = async () => {
      try {
        const [statusRes, transportRes, checkInRes] = await Promise.all([
          axios.get("http://localhost:8081/attendance/statuses"),
          axios.get("http://localhost:8081/attendance/transport-modes"),
          axios.get("http://localhost:8081/attendance/checkin-methods"),
        ]);
        setStatuses(statusRes.data);
        setTransportModes(transportRes.data);
        setCheckInMethods(checkInRes.data);
      } catch (err) {
        console.error("Error loading dropdowns:", err);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username"); // Get username from localStorage

  setUserRole(role);

  if (role !== "admin" && username) {
    setValue("employeeName", username); // Pre-fill for non-admin users
  }
}, [setValue]);


  // Fetch employee names and IDs based on user input
  useEffect(() => {
    if (employeeName.length > 2) { // Fetch only after 3+ characters entered
      axios.get(`http://localhost:8080/user/employees/${employeeName}`)
        .then((res) => {
          const formattedEmployees = res.data.map(emp => ({
            name: emp.name,
            employeeCode: emp.employeeCode,
          }));
          setEmployeeList(formattedEmployees);
        })
        .catch((err) => console.error("Error fetching employees:", err));
    }
  }, [employeeName]);

  // const autocompleteRef = React.useRef(null);
  const onSubmit = async (data) => {
    try {
      const employeeCodeToSend =
      userRole === "admin" ? data.employeeId : localStorage.getItem("employeeCode");
      await axios.post("http://localhost:8081/attendance/mark", {
        employeeCode: employeeCodeToSend,
        employeeName: employeeName,  // Persist ID
        status: data.status,
        autoCheckIn: data.autoCheckIn,
        transportMode: data.transportMode,
        checkInMethod: data.checkInMethod,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
      });

      setSuccessMsg("Attendance marked successfully.");
      setErrorMsg("");

      // Conditional reset based on user role
      reset({
        employeeId: "",
        employeeName: userRole === "admin" ? "" : localStorage.getItem("username"),
        status: "",
        autoCheckIn: false,
        transportMode: "",
        checkInMethod: "",
        checkInTime: "",
        checkOutTime: "",
      });
// setValue("employeeName", "");
      // autocompleteRef.current?.setValue("");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      setErrorMsg("Failed to mark attendance or already marked for today");
      setTimeout(() => setErrorMsg(""), 5000);
    }
};


  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "rgb(223 238 245)", 
          p: 4,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
          borderRadius: 3,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Mark Attendance
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Employee Name Field with Auto-Suggestions */}
         {userRole === "admin" ? (
  <Controller
  name="employeeName"
  control={control}
  rules={{ required: "Employee Name is required" }}
  render={({ field }) => (
    <Autocomplete
      freeSolo
      options={employeeList.map(emp => emp.name)}
      value={field.value || ""} // Bind to form value
      onChange={(event, newValue) => {
        setValue("employeeName", newValue || "");
        const selectedEmployee = employeeList.find(emp =>
          emp.name.toLowerCase() === newValue?.toLowerCase()
        );
        setValue("employeeId", selectedEmployee?.employeeCode || "");
      }}
      inputValue={field.value || ""}
      onInputChange={(event, newInputValue) => {
        setValue("employeeName", newInputValue || "");
        const selectedEmployee = employeeList.find(emp =>
          emp.name.toLowerCase() === newInputValue.toLowerCase()
        );
        setValue("employeeId", selectedEmployee?.employeeCode || "");
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Employee Name"
          fullWidth
          margin="normal"
          sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
          error={!!errors.employeeName}
          helperText={errors.employeeName?.message}
        />
      )}
    />
  )}
/>
) : (
  <Controller
    name="employeeName"
    control={control}
    rules={{ required: "Employee Name is required" }}
    render={({ field }) => (
      <TextField
        label="Employee Name"
        fullWidth
        margin="normal"
        sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
        InputProps={{ readOnly: true }}
        {...field}
        error={!!errors.employeeName}
        helperText={errors.employeeName?.message}
      />
    )}
  />
)}


          {/* Show Status Dropdown Only When Employee Name is Filled */}
          {employeeName && (
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <TextField
                  select
                  label="Status"
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
                  {...field}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  {statuses.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}

          {/* Transport Mode (Only for "In Office") */}
          {isOffice && (
            <Controller
              name="transportMode"
              control={control}
              rules={{ required: "Transport Mode is required for 'In Office'" }}
              render={({ field }) => (
                <TextField
                  select
                  label="Transport Mode"
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
                  {...field}
                  error={!!errors.transportMode}
                  helperText={errors.transportMode?.message}
                >
                  {transportModes.map((mode, index) => (
                    <MenuItem key={index} value={mode}>
                      {mode}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}
          {isOffice && (
  <Controller
    name="autoCheckIn"
    control={control}
    render={({ field }) => (
      <FormControlLabel
        control={<Checkbox {...field} checked={!!field.value} />}
        label="Auto Check-In"
      />
    )}
  />
)}

{showCheckInMethod && (
  <Controller
    name="checkInMethod"
    control={control}
    rules={{ required: "Check-In Method is required when Auto Check-In is enabled" }}
    render={({ field }) => (
      <TextField
        select
        label="Check-In Method"
        fullWidth
        margin="normal"
        sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
        {...field}
        error={!!errors.checkInMethod}
        helperText={errors.checkInMethod?.message}
      >
        {checkInMethods.map((method, index) => (
          <MenuItem key={index} value={method}>
            {method}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
)}

{showCheckTimes && (
  <>
    <Controller
      name="checkInTime"
      control={control}
      rules={{ required: "Check-In Time is required when Auto Check-In is disabled" }}
      render={({ field }) => (
        <TextField
          label="Check-In Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
          {...field}
          error={!!errors.checkInTime}
          helperText={errors.checkInTime?.message}
        />
      )}
    />

    <Controller
      name="checkOutTime"
      control={control}
      rules={{ required: "Check-Out Time is required when Auto Check-In is disabled" }}
      render={({ field }) => (
        <TextField
          label="Check-Out Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{ bgcolor: "#F5F5F5", borderRadius: 1 }}
          {...field}
          error={!!errors.checkOutTime}
          helperText={errors.checkOutTime?.message}
        />
      )}
    />
  </>
)}




          {/* Submit Button (Disabled if Status is Empty) */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2, bgcolor: "#1E88E5", "&:hover": { bgcolor: "#1565C0" } }}
            disabled={!status} 
          >
            Submit
          </Button>

          {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mt: 2 }}>{errorMsg}</Alert>}
        </form>
        {peakDayInfo && (
  <Alert severity="info" sx={{ mb: 2 ,  mt: 2}}>
    Peak attendance this week is on <strong>{peakDayInfo.peakDay}</strong> with{" "}
    <strong>{peakDayInfo.totalCount}</strong> check-ins. 
    You may choose a different day to avoid crowding.
  </Alert>
)}
      </Box>
      
    </Container>
  );
};

export default MarkAttendancePage;
