package com.springboot.demo.entity;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.sql.Date;
import java.sql.Time;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Bookings
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Long empId;

    private String title;

    private Date date;

    private Time startTime;

    private Time endTime;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private MeetingRoom meetingRoom;
}
