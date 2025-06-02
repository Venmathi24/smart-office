import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";

const statusOptions = ["ACTIVE", "INACTIVE", "ON_LEAVE"];

function CreateUserPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:8080/user/add-employee", data);
      setMessage("Employee created successfully ✅");
      setIsError(false);
      reset();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create employee ❌");
      setIsError(true);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Create Employee
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role"
                {...register("empRole", { required: "Role is required" })}
                error={!!errors.empRole}
                helperText={errors.empRole?.message}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                {...register("department")}
              />
            </Grid>

            {/* Designation */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                {...register("designation")}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                defaultValue={statusOptions[0]}
                {...register("status")}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>

        {message && (
          <Alert severity={isError ? "error" : "success"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default CreateUserPage;
