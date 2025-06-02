package com.springboot.demo.service.impl;

import com.springboot.demo.dto.EmployeeRequestDto;
import com.springboot.demo.entity.Employee;
import com.springboot.demo.enums.EmployeeStatus;
import com.springboot.demo.exception.EmployeeNotFoundException;
import com.springboot.demo.repository.EmployeeRepository;
import com.springboot.demo.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Employee createEmployee(EmployeeRequestDto dto) {
        Employee emp = new Employee();
        emp.setName(dto.getName());
        emp.setEmail(dto.getEmail());
        emp.setDepartment(dto.getDepartment());
        emp.setDesignation(dto.getDesignation());
        emp.setEmpRole(dto.getEmpRole());
        emp.setPassword(dto.getPassword());
        emp.setPassword(passwordEncoder.encode(emp.getPassword()));
        emp.setStatus(dto.getStatus());
        return employeeRepository.save(emp);
    }

    public Employee getByCode(Long code) {
        return employeeRepository.findByEmployeeCode(code)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));
    }

    public Employee getEmpByName(String name) {
        return employeeRepository.findByName(name)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found"));
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
