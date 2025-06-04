import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";
import axios from "axios";

function UsersListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8080/user/view-all-users");
        setRows(res.data);
      } catch (err) {
        setError("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 5,
        pb: 4,
        backgroundColor: "rgb(223 238 245)", // Matching theme
        borderRadius: 2,
        boxShadow: 3,
        minHeight: "80vh",
        p: 4,
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold">
          All Employees
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2, overflowX: "auto", p: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                {["ID", "Code", "Name", "Email", "Role", "Department", "Designation", "Status"].map((col) => (
                  <TableCell key={col} sx={{ color: "white", fontWeight: "bold" }}>
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.employeeCode}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.empRole}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}

export default UsersListPage;
