package com.springboot.demo.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceResponse {
    private String message;
    private LocalDate date;
}