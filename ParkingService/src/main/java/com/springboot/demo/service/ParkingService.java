package com.springboot.demo.service;


import com.springboot.demo.entity.ParkingSlots;

import java.util.List;

public interface ParkingService {
    List<ParkingSlots> getAllSlots();

    List<ParkingSlots> getSlotsByOccupationStatus(String isOccupied);

    ParkingSlots addSlot(ParkingSlots parkingSlot);

    ParkingSlots updateSlot(Long id, ParkingSlots updatedSlot);

    void deleteSlot(Long id);
}
