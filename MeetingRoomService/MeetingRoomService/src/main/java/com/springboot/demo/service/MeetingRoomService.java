package com.springboot.demo.service;

import com.springboot.demo.dto.BookingRequestDTO;
import com.springboot.demo.dto.RecurringRequestDTO;
import com.springboot.demo.dto.RoomDTO;
import com.springboot.demo.dto.RoomRequestDTO;
import org.springframework.http.ResponseEntity;

import java.sql.Date;

public interface MeetingRoomService {
    ResponseEntity getAllAvailableRooms(RoomRequestDTO roomRequestDTO);

    ResponseEntity bookRoom(BookingRequestDTO bookingRequestDTO);

    ResponseEntity getAllExistingMeetings(int roomId);


    ResponseEntity deleteBooking(int bookingId);

    ResponseEntity bookRecurringRequest(RecurringRequestDTO recurringRequestDTO);

    ResponseEntity addRoom(RoomDTO roomDTO);

    ResponseEntity updateRoom(int roomId, RoomDTO roomDTO);

    ResponseEntity deleteRoom(int roomId);

    ResponseEntity getBookedSlots(int roomId, Date date);

    ResponseEntity getAllExistingRooms();

}
