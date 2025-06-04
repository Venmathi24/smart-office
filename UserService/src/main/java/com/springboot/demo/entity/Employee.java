package com.springboot.demo.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "employees")
@Data
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeCode;
//    @Column
//            (unique = true, nullable = false)
//    private String employeeCode;
    @Column(nullable = false)
    private String name;
    @Column
//            (unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String empRole;
    @Column
    private String password;
    @Column
    private String department;
    @Column
    private String designation;
    @Column
    private String status;
}
