package com.springboot.demo.controller;

import com.springboot.demo.entity.ParkingSlots;
import com.springboot.demo.service.ParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/parking-slots")
public class ParkingController {
    private final ParkingService parkingSlotService;

    @GetMapping("/all/parking-slots")
    public ResponseEntity<List<ParkingSlots>> getAllSlots(
            @RequestParam(required = false) Boolean occupied) {
        List<ParkingSlots> slots;
        if (occupied == null) {
            slots = parkingSlotService.getAllSlots();
        } else {
            slots = parkingSlotService.getSlotsByOccupationStatus(occupied);
        }
        return ResponseEntity.ok(slots);
    }

    @PostMapping("/add/parking-slots")
    public ResponseEntity<ParkingSlots> addSlot(@RequestBody ParkingSlots parkingSlot) {
        ParkingSlots created = parkingSlotService.addSlot(parkingSlot);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSlots> updateSlot(
            @PathVariable Long id, @RequestBody ParkingSlots parkingSlot) {
        ParkingSlots updated = parkingSlotService.updateSlot(id, parkingSlot);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        parkingSlotService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/used-slots")
    public ResponseEntity<List<ParkingSlots>> getUsedSlots() {
        return ResponseEntity.ok(parkingSlotService.getSlotsByOccupationStatus(true));
    }

    @GetMapping("/unused-slots")
    public ResponseEntity<List<ParkingSlots>> getUnusedSlots() {
        return ResponseEntity.ok(parkingSlotService.getSlotsByOccupationStatus(false));
    }
}

