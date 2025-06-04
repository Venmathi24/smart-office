package com.springboot.demo.controller;

import com.springboot.demo.dto.*;
import com.springboot.demo.entity.Bookings;
import com.springboot.demo.entity.MeetingRoomBookings;
import com.springboot.demo.service.MeetingRoomService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/Book-Meeting")
@CrossOrigin(origins = "*")
public class MeetingRoomController
{
    @Autowired
    private MeetingRoomService meetingRoomService;

    /* ADMIN */

    @GetMapping("/existing-rooms")
    public ResponseEntity getAllExistingRooms()
    {
        return meetingRoomService.getAllExistingRooms();
    }

    @PostMapping("/admin/add")
    public ResponseEntity addMeetingRoom(@RequestBody RoomDTO roomDTO)
    {
        return meetingRoomService.addRoom(roomDTO);
    }

    @PutMapping("/admin/update-room")
    public ResponseEntity updateMeetingRoom(@RequestParam("id") int roomId ,@RequestBody RoomDTO roomDTO)
    {
        return meetingRoomService.updateRoom(roomId,roomDTO);
    }

    @DeleteMapping("/admin/delete-room")
    public ResponseEntity deleteRoom(@RequestParam("id")int roomId)
    {
        return meetingRoomService.deleteRoom(roomId);
    }



    /* BOOKING MEETING ROOM */

    @PostMapping("/booking-meeting/available-rooms")
    public ResponseEntity getAvailableRoomsBasedOnLocAndFloor(@RequestBody BookingRoomRequest bookingRoomRequest)
    {
        return meetingRoomService.getAvailableRoomsBasedOnLocAndFloor(bookingRoomRequest);
    }

    @PostMapping("/booking-meeting/save")
    public ResponseEntity bookRoom(@RequestBody MeetingRoomBookings meetingRoomBookings)
    {
        return meetingRoomService.bookMeetingRoom(meetingRoomBookings);
    }

    @GetMapping("/booking-meeting/bookings")
    public ResponseEntity getBookings(@RequestParam Integer roomId, @RequestParam String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        return meetingRoomService.getBookingsByRoomId(roomId, parsedDate);
    }

    @DeleteMapping("/booking-meeting/cancel/{id}")
    public ResponseEntity<Boolean> cancelBooking(@PathVariable Integer id) {
        return  meetingRoomService.cancelBookingById(id);
    }








    @PostMapping("/all")
    public ResponseEntity getAllAvailableRooms(@RequestBody RoomRequestDTO roomRequestDTO)
    {
         return meetingRoomService.getAllAvailableRooms(roomRequestDTO);
    }

    @GetMapping("/booked-slots")
    public ResponseEntity getBookedSlots(@RequestParam("id") int roomId , @RequestParam("date")Date date)
    {
        return meetingRoomService.getBookedSlots(roomId, date);
    }

    @PostMapping("/book-recurring")
    public ResponseEntity bookRecurringMeeting(@RequestBody RecurringRequestDTO recurringRequestDTO)
    {
         return meetingRoomService.bookRecurringRequest(recurringRequestDTO);
    }

    @PostMapping("/Bookings")
    public ResponseEntity bookRoom(@RequestBody BookingRequestDTO bookingRequestDTO)
    {
        return meetingRoomService.bookRoom(bookingRequestDTO);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/by-room")
    public ResponseEntity getBookingsByRoomFromDate(@RequestParam int roomId
    ) {
        return ResponseEntity.ok(meetingRoomService.getAllExistingMeetings(roomId));
    }




    /*
     delete booking by admin or user
    */
    @DeleteMapping("/cancelBooking")
    public ResponseEntity deleteBooking(@RequestParam("id") int bookingId)
    {
        return meetingRoomService.deleteBooking(bookingId);
    }



}

