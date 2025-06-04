package com.springboot.demo.controller;

import com.springboot.demo.dto.EmployeeRequestDto;
import com.springboot.demo.dto.LoginRequest;
import com.springboot.demo.entity.Employee;
import com.springboot.demo.exception.LoginFailedException;
import com.springboot.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<Employee> login(@RequestBody LoginRequest loginRequest) {
        try {
            Employee employee = employeeService.getEmpByName(loginRequest.getName());
            var authToken = new UsernamePasswordAuthenticationToken(loginRequest.getName(), loginRequest.getPassword());
            authenticationManager.authenticate(authToken);
            return ResponseEntity.ok(employee);
        } catch (Exception exception) {
            throw new LoginFailedException("Unable to login with the entered credentials");
        }
    }

    @PostMapping("add-employee")
    public ResponseEntity<Employee> addEmployee(@RequestBody EmployeeRequestDto dto) {
        return ResponseEntity.ok(employeeService.createEmployee(dto));
    }

    @GetMapping("/employee/emp-code/{empCode}")
    public ResponseEntity<Employee> getEmpByCode(@PathVariable Long empCode) {
        return ResponseEntity.ok(employeeService.getByCode(empCode));
    }

    @GetMapping("/employee/emp-name/{empName}")
    public ResponseEntity<Employee> getEmpByName(@PathVariable String empName) {
        return ResponseEntity.ok(employeeService.getEmpByName(empName));
    }


    @GetMapping("/employees/{employeeName}")
    public ResponseEntity<List<Employee>> findByNameContaining(@PathVariable String employeeName) {
        return ResponseEntity.ok(employeeService.findByNameContaining(employeeName));
    }

    @GetMapping("/view-all-users")
    public ResponseEntity<List<Employee>> getEmpByName() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }
}

