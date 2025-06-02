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
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";

const MarkAttendancePage = () => {
  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      status: "",
      autoCheckIn: false,
    },
  });

  const status = useWatch({ control, name: "status" });
  const autoCheckIn = useWatch({ control, name: "autoCheckIn" });

  const [statuses, setStatuses] = useState([]);
  const [transportModes, setTransportModes] = useState([]);
  const [checkInMethods, setCheckInMethods] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");

  const isOffice = status === "In Office";
  const showCheckInMethod = isOffice && autoCheckIn;
  const showCheckTimes = isOffice && !autoCheckIn;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const code = localStorage.getItem("employeeCode");

    setUserRole(role);
    setEmployeeCode(code);

    if (role !== "admin" && code) {
      setValue("employeeCode", code);
    }

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
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8081/attendance/mark", data);
      setSuccessMsg("Attendance marked successfully.");
      setErrorMsg("");

      if (userRole === "admin") {
        reset({
          employeeCode: "",
          status: "",
          autoCheckIn: false,
          transportMode: "",
          checkInMethod: "",
          checkInTime: "",
          checkOutTime: "",
        });
      } else {
        reset({
          employeeCode: employeeCode,
          status: "",
          autoCheckIn: false,
          transportMode: "",
          checkInMethod: "",
          checkInTime: "",
          checkOutTime: "",
        });
      }

      // Set employee code back for non-admins
      if (userRole !== "admin") {
        setValue("employeeCode", employeeCode);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to mark attendance or already marked for today");
      setSuccessMsg("");

      // Optional: clear error after 5 seconds
      setTimeout(() => setErrorMsg(""), 5000);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Mark Attendance
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="employeeCode"
            control={control}
            rules={{ required: "Employee Code is required" }}
            render={({ field }) => (
              <TextField
                label="Employee Code"
                type="number"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: userRole !== "admin" }}
                {...field}
              />
            )}
          />

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
                {...field}
              >
                {statuses.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {isOffice && (
            <Controller
              name="transportMode"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Transport Mode"
                  fullWidth
                  margin="normal"
                  {...field}
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
              render={({ field }) => (
                <TextField
                  select
                  label="Check-In Method"
                  fullWidth
                  margin="normal"
                  {...field}
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
                render={({ field }) => (
                  <TextField
                    label="Check-In Time"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    {...field}
                  />
                )}
              />

              <Controller
                name="checkOutTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Check-Out Time"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    {...field}
                  />
                )}
              />
            </>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>

          {successMsg && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
};

export default MarkAttendancePage;
