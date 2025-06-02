import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/user/login",
        data
      );
      if (response.status === 200) {
        navigate("/menu");
        localStorage.setItem("role", response.data.empRole);
        console.log(localStorage.getItem("role"));
        localStorage.setItem("employeeCode", response.data.employeeCode);
        console.log(localStorage.getItem("role"));
        localStorage.setItem("token", "sample-token");
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("name", { required: "Username is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}

export default LoginPage;
