package com.springboot.demo.repository;

import com.springboot.demo.Projection.BookedSlots;
import com.springboot.demo.entity.Bookings;
import com.springboot.demo.entity.MeetingRoomBookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingRoomBookingsRepository extends JpaRepository<MeetingRoomBookings,Integer> {

    MeetingRoomBookings save(MeetingRoomBookings meetingRoomBookings);
    List<MeetingRoomBookings> findByRoomIdAndDate(Integer roomId, LocalDate date);

}
