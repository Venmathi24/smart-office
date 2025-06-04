package com.springboot.demo.service;

import com.springboot.demo.dto.EmployeeRequestDto;
import com.springboot.demo.entity.Employee;

import java.util.List;

public interface EmployeeService {
    Employee createEmployee(EmployeeRequestDto dto);
    Employee getByCode(Long code);
    Employee getEmpByName(String name);
    List<Employee> getAllEmployees();
    List<Employee> findByNameContaining(String name);

}
