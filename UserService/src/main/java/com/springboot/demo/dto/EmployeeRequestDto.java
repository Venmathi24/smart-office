package com.springboot.demo.dto;

import lombok.Data;

@Data
public class EmployeeRequestDto {
    private String employeeCode;
    private String name;
    private String email;
    private String empRole;
    private String department;
    private String designation;
    private String password;
    private String status;
}
