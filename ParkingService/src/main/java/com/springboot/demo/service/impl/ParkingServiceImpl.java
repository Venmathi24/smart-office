package com.springboot.demo.service.impl;

import com.springboot.demo.entity.ParkingSlots;
import com.springboot.demo.repository.ParkingSlotRepository;
import com.springboot.demo.service.ParkingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService{

    private final ParkingSlotRepository parkingSlotRepository;


    @Override
    public List<ParkingSlots> getAllSlots() {
        return parkingSlotRepository.findAll();
    }

    @Override
    public List<ParkingSlots> getSlotsByOccupationStatus(boolean isOccupied) {
        return parkingSlotRepository.findByIsOccupied(isOccupied);
    }

    @Override
    public ParkingSlots addSlot(ParkingSlots parkingSlot) {
        return parkingSlotRepository.save(parkingSlot);
    }

    @Override
    public ParkingSlots updateSlot(Long id, ParkingSlots updatedSlot) {
        ParkingSlots slot = parkingSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking slot not found"));

        slot.setSlotNumber(updatedSlot.getSlotNumber());
        slot.setLocation(updatedSlot.getLocation());
        slot.setVehicleTypeCompatibility(updatedSlot.getVehicleTypeCompatibility());
        slot.setOccupied(updatedSlot.isOccupied());
        slot.setOccupiedByEmployeeCode(updatedSlot.getOccupiedByEmployeeCode());
        slot.setOccupationStartTime(updatedSlot.getOccupationStartTime());

        return parkingSlotRepository.save(slot);
    }

    @Override
    public void deleteSlot(Long id) {
        parkingSlotRepository.deleteById(id);
    }
}