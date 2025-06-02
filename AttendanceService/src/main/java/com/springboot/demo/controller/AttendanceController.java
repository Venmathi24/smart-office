package com.springboot.demo.controller;

import com.springboot.demo.dto.AttendanceRequest;
import com.springboot.demo.dto.AttendanceResponse;
import com.springboot.demo.entity.Attendance;
import com.springboot.demo.entity.AttendanceStatus;
import com.springboot.demo.entity.CheckInMethod;
import com.springboot.demo.entity.TransportMode;
import com.springboot.demo.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponse> markAttendance(@RequestBody AttendanceRequest request) {
        AttendanceResponse response = attendanceService.markAttendance(request);
        return ResponseEntity.ok(response);
    }

//    @GetMapping("/{employeeCode}")
//    public ResponseEntity<List<Attendance>> getAttendanceHistory(
//            @PathVariable Long employeeCode) {
//        return ResponseEntity.ok(attendanceService.getAttendanceHistory(employeeCode));
//    }

    @GetMapping("/history/{empCode}")
    public ResponseEntity<List<Attendance>> getAttendanceHistory(
            @PathVariable Long empCode) {
        return ResponseEntity.ok(attendanceService.getAttendanceHistory(empCode));
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getStatuses() {
        return ResponseEntity.ok(attendanceService.getStatuses().stream().map(AttendanceStatus::getLabel).collect(Collectors.toList()));
    }

    @GetMapping("/transport-modes")
    public ResponseEntity<List<String>> getTransportModes() {
        return ResponseEntity.ok(attendanceService.getTransportModes().stream().map(TransportMode::getLabel).collect(Collectors.toList()));
    }

    @GetMapping("/checkin-methods")
    public ResponseEntity<List<String>> getCheckinMethods() {
        return ResponseEntity.ok(attendanceService.getCheckinMethods().stream().map(CheckInMethod::getLabel).collect(Collectors.toList()));
    }
}

