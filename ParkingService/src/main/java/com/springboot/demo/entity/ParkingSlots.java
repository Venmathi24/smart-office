package com.springboot.demo.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "parking_slots")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParkingSlots {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_number", nullable = false, unique = true)
    private String slotNumber;

    @Column(name = "location")
    private String location;

    @Column(name = "vehicle_type_compatibility")
    private String vehicleTypeCompatibility;

    @Column(name = "is_occupied", nullable = false)
    private boolean isOccupied = false;

    @Column(name = "occupied_by_employee_code")
    private String occupiedByEmployeeCode;

    @Column(name = "occupation_start_time")
    private LocalDateTime occupationStartTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
