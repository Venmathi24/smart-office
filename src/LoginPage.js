import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import styled from "@emotion/styled";
import Background from "./images/Background.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CenteredBox = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: `url(${Background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const StyledPaper = styled(Paper)({
  padding: "2.5rem 2rem",
  borderRadius: "1.5rem",
  boxShadow: "0 8px 32px rgba(31, 41, 55, 0.15)",
  minWidth: 340,
  maxWidth: 400,
  width: "100%",
});

const StyledButton = styled(Button)({
  marginTop: "1.5rem",
  borderRadius: "2rem",
  fontWeight: 600,
  textTransform: "none",
  background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
  color: "#fff",
  "&:hover": {
    background: "linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)",
  },
});

export default function LognPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    let newErrors = { username: "", password: "" };

    // Username: required, min 6, max 10
    if (!username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (username.length < 6) {
      newErrors.username = "Username must be at least 6 characters";
      valid = false;
    } else if (username.length > 10) {
      newErrors.username = "Username must be at most 10 characters";
      valid = false;
    }

    // Password: required, min 8, max 12
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (password.length > 12) {
      newErrors.password = "Password must be at most 12 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validate()) return;

    // Send as { name, password } to match backend DTO
    const data = { name: username, password };

    try {
      const response = await axios.post(
        "http://localhost:8080/user/login",
        data
      );
      if (response.status === 200) {
        navigate("/menu");
        localStorage.setItem("role", response.data.empRole);
        localStorage.setItem("employeeCode", response.data.employeeCode);
        localStorage.setItem("token", "sample-token");
        localStorage.setItem("username", username);
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
    <CenteredBox>
      <StyledPaper elevation={4}>
        <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
          Smart Office Login
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            inputProps={{ maxLength: 12 }}
          />
          {errorMessage && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <StyledButton type="submit" fullWidth variant="contained">
            Login
          </StyledButton>
        </Box>
      </StyledPaper>
    </CenteredBox>
  );
}