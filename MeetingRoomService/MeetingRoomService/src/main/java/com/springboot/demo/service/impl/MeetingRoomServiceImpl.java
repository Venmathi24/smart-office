package com.springboot.demo.service.impl;

import com.springboot.demo.Projection.BookedSlots;
import com.springboot.demo.dto.*;
import com.springboot.demo.entity.Bookings;
import com.springboot.demo.entity.MeetingRoom;
import com.springboot.demo.entity.MeetingRoomBookings;
import com.springboot.demo.repository.BookingRepo;
import com.springboot.demo.repository.MeetingRoomBookingsRepository;
import com.springboot.demo.repository.RoomRepo;
import com.springboot.demo.service.MeetingRoomService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class MeetingRoomServiceImpl implements MeetingRoomService {
    private RoomRepo roomRepo;

    private BookingRepo bookingRepo;

    private ModelMapper modelMapper;

    private MeetingRoomBookingsRepository meetingRoomBookingsRepository;

    public MeetingRoomServiceImpl(BookingRepo bookingRepo, RoomRepo roomRepo, ModelMapper modelMapper, MeetingRoomBookingsRepository meetingRoomBookingsRepository) {
        this.roomRepo = roomRepo;
        this.modelMapper = modelMapper;
        this.bookingRepo = bookingRepo;
        this.meetingRoomBookingsRepository = meetingRoomBookingsRepository;
    }

    @Override
    public ResponseEntity getAllAvailableRooms(RoomRequestDTO roomRequestDTO) {
        List<MeetingRoom> availableRooms = null;
        if (roomRequestDTO.getCapacity() < 0)
            availableRooms = roomRepo.findAllAvailaleRooms(roomRequestDTO.getDate(), roomRequestDTO.getStartTime(), roomRequestDTO.getEndTime());
        else
            availableRooms = roomRepo.findAllAvailaleRoomsWithCapacity(roomRequestDTO.getDate(), roomRequestDTO.getStartTime(), roomRequestDTO.getEndTime(), roomRequestDTO.getCapacity());

        if (availableRooms.size() > 0) {
            List<RoomResponseDTO> responseList = availableRooms.stream().
                    map(room -> modelMapper.map(room, RoomResponseDTO.class)).collect(Collectors.toList());

            return ResponseEntity.ok().body(responseList);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NO Meeting Rooms Available");
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ResponseEntity bookRoom(BookingRequestDTO bookingRequestDTO) {
        MeetingRoom meetingRoom = roomRepo.findById(bookingRequestDTO.getRoomId()).get();
        Bookings bookings = modelMapper.map(bookingRequestDTO, Bookings.class);
        bookings.setMeetingRoom(meetingRoom);
        bookings.setEmpId(bookingRequestDTO.getEmployeeCode());
        bookingRepo.save(bookings);
        return ResponseEntity.ok("Booking done Sucessfully");
    }

    @Override
    public ResponseEntity deleteBooking(int bookingId) {

        bookingRepo.deleteById(bookingId);
        return ResponseEntity.status(HttpStatus.OK).body("Booking Deleted Successfully");
    }

    @Override
    public ResponseEntity bookRecurringRequest(RecurringRequestDTO recurringRequestDTO) {

        Date currentDate = recurringRequestDTO.getStartDate();
        Date endDate = recurringRequestDTO.getEndDate();
        Time startTime = recurringRequestDTO.getStartTime();
        Time endTime = recurringRequestDTO.getEndTime();
        int roomId = recurringRequestDTO.getRoomId();
        RecurringResponseDTO recurringResponseDTO = new RecurringResponseDTO();

        while (!currentDate.after(endDate)) {

            if (!hasConflict(currentDate, startTime, endTime, roomId)) {
                //book the slot and to success DTO
                Bookings bookings = getBookingObjectBySettingValues(roomId, currentDate, startTime, endTime, recurringRequestDTO.getTitle());
                bookingRepo.save(bookings);
                recurringResponseDTO.setSuccessObject(new SuccessResponseDTO(currentDate, startTime, endTime));

            } else {
                //adding to conflicts response dto
                recurringResponseDTO.setConflictObjec(new ConflictResponseDTO(currentDate, startTime, endTime));

            }

            currentDate = Date.valueOf(currentDate.toLocalDate().plusDays(1));
        }


        return ResponseEntity.ok(recurringResponseDTO);

    }

    @Override
    public ResponseEntity addRoom(RoomDTO roomDTO) {

        MeetingRoom meetingRoom = modelMapper.map(roomDTO, MeetingRoom.class);
        try {
            roomRepo.save(meetingRoom);
        } catch (Exception ex) {
            log.error("Exception occured : " + ex.getMessage());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Room record Added in the Database");

    }

    @Override
    public ResponseEntity updateRoom(int roomId, RoomDTO roomDTO) {
        MeetingRoom meetingRoom = roomRepo.findById(roomId).get();
        meetingRoom.setCapacity(roomDTO.getCapacity());
        meetingRoom.setName(roomDTO.getName());
        meetingRoom.setUpdatedBy(roomDTO.getUpdatedBy());
        meetingRoom.setCreatedBy(roomDTO.getCreatedBy());
        meetingRoom.setLocation(roomDTO.getLocation());
        meetingRoom.setFloor(roomDTO.getFloor());
        roomRepo.save(meetingRoom);
        return ResponseEntity.ok("Room Details Updated sucessfully !!");
    }

    @Override
    public ResponseEntity deleteRoom(int roomId) {
        roomRepo.deleteById(roomId);
        return ResponseEntity.status(HttpStatus.OK).body("Room Removed from the Records !!");
    }

    @Override
    public ResponseEntity getBookedSlots(int roomId, Date date) {

        List<BookedSlots> bookedSlots = bookingRepo.findByDateAndId(date, roomId);
        return ResponseEntity.ok(bookedSlots);
    }


    @Override
    public ResponseEntity getAllExistingMeetings(int roomId) {
        return ResponseEntity.ok(bookingRepo.findByMeetingRoomId(roomId));
    }


    private Bookings getBookingObjectBySettingValues(int roomId, Date current, Time startTime, Time endTime, String title) {
        Bookings bookings = new Bookings();
        MeetingRoom meetingRoom = roomRepo.findById(roomId).get();
        bookings.setMeetingRoom(meetingRoom);
        bookings.setDate(current);
        bookings.setTitle(title);
        bookings.setStartTime(startTime);
        bookings.setEndTime(endTime);
        return bookings;
    }

    private boolean hasConflict(Date currentDate, Time startTime, Time endTime, int roomId) {
        List<Integer> roomIds = bookingRepo.findRoomIdsBetweenStartDateAndEndDate(currentDate, startTime, endTime);
        return roomIds.contains(roomId);
    }

    @Override
    public ResponseEntity getAllExistingRooms() {

        List<MeetingRoom> meetingRoom = roomRepo.findAll();
        return ResponseEntity.ok(meetingRoom);
    }

    @Override
    public ResponseEntity getAvailableRoomsBasedOnLocAndFloor(BookingRoomRequest bookingRoomRequest) {
        List<MeetingRoom> meetingRoom = roomRepo.findAvailableRooms(bookingRoomRequest.getLocation(), bookingRoomRequest.getFloor());
        return ResponseEntity.ok(meetingRoom);
    }

    @Override
    public ResponseEntity bookMeetingRoom(MeetingRoomBookings meetingRoomBookings) {
        MeetingRoomBookings response = meetingRoomBookingsRepository.save(meetingRoomBookings);
        MeetingRoom meetingRoom = roomRepo.findById(meetingRoomBookings.getRoomId()).orElse(null);
        if(ObjectUtils.isNotEmpty(meetingRoom)){
            response.setFloor(meetingRoom.getFloor());
            response.setRoomName(meetingRoom.getName());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity getBookingsByRoomId(Integer roomId,LocalDate date) {
        List<MeetingRoomBookings> response = meetingRoomBookingsRepository.findByRoomIdAndDate(roomId, date);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

//    public ResponseEntity cancelBookingById(Long id) {
//        if (meetingRoomBookingsRepository.existsById(id)) {
//            meetingRoomBookingsRepository.deleteById(id);
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(true);
//        }
//        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(false);
//    }

    public ResponseEntity cancelBookingById(Integer id) {
        if (meetingRoomBookingsRepository.existsById(id)) {
            meetingRoomBookingsRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(true);
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(false);
    }


}
