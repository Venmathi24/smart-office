package com.springboot.demo.controller;

import com.springboot.demo.entity.AutoCheckInEvent;
import com.springboot.demo.repository.AutoCheckInEventRepository;
import com.springboot.demo.service.AttendanceService;
import com.springboot.demo.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auto-checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;
    private final AutoCheckInEventRepository autoCheckInEventRepository;

    @PostMapping("/log")
    public ResponseEntity<Void> logCheckIn(@RequestBody AutoCheckInEvent event) {
        event.setCheckInTime(LocalDateTime.now());
        event.setLastSeenTime(LocalDateTime.now());
        event.setActive(true);
        autoCheckInEventRepository.save(event);
        checkInService.autoCheckIn(event.getEmployeeCode(), event.getMethod());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-last-seen/{id}")
    public ResponseEntity<Void> updateLastSeen(@PathVariable Long id) {
        AutoCheckInEvent event = autoCheckInEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        event.setLastSeenTime(LocalDateTime.now());
        autoCheckInEventRepository.save(event);
        return ResponseEntity.ok().build();
    }
}
