package com.springboot.demo.repository;

import com.springboot.demo.Projection.BookedSlots;
import com.springboot.demo.entity.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Bookings,Integer> {

    @Query("""
            select b.meetingRoom.id from Bookings b where b.date = :date 
            and not(b.endTime <= :startTime or b.startTime >= :endTime)
            """)
    public List<Integer> findRoomIdsBetweenStartDateAndEndDate(@Param("date")Date date
            , @Param("startTime") Time startTime , @Param("endTime") Time endTime);

    @Query("""
            select b.startTime , b.endTime from Bookings b where b.meetingRoom.id = :id
            and b.date = :date
            """)
    public List<BookedSlots> findByDateAndId(@Param("date") Date date , @Param("id") int roomId);

    List<Bookings> findByMeetingRoomId(int roomId);

}
