package com.springboot.demo.repository;

import com.springboot.demo.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<MeetingRoom,Integer> {

    @Query("""
            select r from MeetingRoom r where r.id not in 
            (select b.meetingRoom.id from Bookings b where b.date = :date and
            not(b.endTime <= :startTime or b.startTime >= :endTime))
            """)
    public List<MeetingRoom> findAllAvailaleRooms(@Param("date") Date date, @Param("startTime") Time startTime , @Param("endTime") Time endDate);


    @Query("""
            select r from MeetingRoom r where r.capacity >= :capacity and r.id not in 
            (select b.meetingRoom.id from Bookings b where b.date = :date and
            not(b.endTime <= :startTime or b.startTime >= :endTime)) 
            """)
    public List<MeetingRoom> findAllAvailaleRoomsWithCapacity(@Param("date") Date date, @Param("startTime") Time startTime , @Param("endTime") Time endDate , @Param("capacity") int capacity);


}
