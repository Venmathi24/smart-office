package com.springboot.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Time;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRoomRequest {
    private String location;
    private Integer floor;
    private String roomName;
    private Date date;
    private Time startTime;
    private Time endTime;
    private String employeeName;
}
