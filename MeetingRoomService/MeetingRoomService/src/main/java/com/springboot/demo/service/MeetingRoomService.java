package com.springboot.demo.service;

import com.springboot.demo.dto.*;
import com.springboot.demo.entity.MeetingRoomBookings;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.time.LocalDate;

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

    /* MEETING ROOM BOOKING */
    ResponseEntity getAvailableRoomsBasedOnLocAndFloor(BookingRoomRequest bookingRoomRequest);

    ResponseEntity bookMeetingRoom(MeetingRoomBookings meetingRoomBookings);

    ResponseEntity getBookingsByRoomId(Integer roomId, LocalDate date);

    ResponseEntity cancelBookingById(Integer id);



}
