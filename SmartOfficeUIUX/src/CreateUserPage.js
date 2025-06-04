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

const statusOptions = ["ACTIVE", "INACTIVE"];
const departmentOptions = [
  "Software Development",
  "Infrastructure & Networking",
  "Cybersecurity",
  "Data Analytics & Business Intelligence",
  "IT Support & Help Desk",
  "Cloud Computing & DevOps",
  "Database Administration",
  "IT Governance & Compliance",
  "Product Management",
  "Quality Assurance & Testing",
];

 const roleOptions = ["admin", "non-admin"];

 const designationOptions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Tech Lead",
  "Project Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Security Analyst",
  "System Administrator",
  "Business Analyst",
];

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
    <Container
      maxWidth="md"
      sx={{
        mt: 5,
        pb: 4,
        backgroundColor: "rgb(223 238 245)", 
        borderRadius: 2,
        boxShadow: 3,
        minHeight: "70vh",
        p: 4,
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          Create Employee
        </Typography>
      </Box>

      <Box sx={{ bgcolor: "white", borderRadius: 2, p: 3, boxShadow: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
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
                variant="outlined"
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
    select
    label="Role"
    variant="outlined"
    defaultValue={roleOptions[1]} // Default to NON-ADMIN
    {...register("empRole", { required: "Role is required" })}
    error={!!errors.empRole}
    helperText={errors.empRole?.message}
  >
    {roleOptions.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
</Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    select
    label="Department"
    variant="outlined"
    defaultValue={departmentOptions[0]} // Default to first department
    {...register("department", { required: "Department is required" })}
    error={!!errors.department}
    helperText={errors.department?.message}
  >
    {departmentOptions.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
</Grid>;

            {/* Designation */}
           <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    select
    label="Designation"
    variant="outlined"
    defaultValue={designationOptions[0]} // Default to first option
    {...register("designation", { required: "Designation is required" })}
    error={!!errors.designation}
    helperText={errors.designation?.message}
  >
    {designationOptions.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
</Grid>;

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                variant="outlined"
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
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>

        {message && (
          <Alert severity={isError ? "error" : "success"} sx={{ mt: 3 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default CreateUserPage;
