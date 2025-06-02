package com.springboot.demo.repository;

import com.springboot.demo.entity.ParkingSlots;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends JpaRepository<ParkingSlots, Long> {
    List<ParkingSlots> findByIsOccupied(boolean isOccupied);
}