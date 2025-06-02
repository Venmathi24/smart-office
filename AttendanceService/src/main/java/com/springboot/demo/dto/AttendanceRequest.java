package com.springboot.demo.dto;

import com.springboot.demo.entity.AttendanceStatus;
import com.springboot.demo.entity.CheckInMethod;
import com.springboot.demo.entity.TransportMode;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AttendanceRequest {
    private Long employeeCode;
    private String status;
    private String transportMode;
    private boolean autoCheckIn;
    private String checkInMethod;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
}