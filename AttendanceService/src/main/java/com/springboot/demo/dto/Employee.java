package com.springboot.demo.dto;

import lombok.Data;

@Data
public class Employee {
    private Long employeeCode;
    private String name;
    private String email;
    private String empRole;
    private String password;
    private String department;
    private String designation;
    private String status;
}
