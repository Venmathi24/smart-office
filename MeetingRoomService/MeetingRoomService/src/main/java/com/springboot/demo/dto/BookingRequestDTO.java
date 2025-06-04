package com.springboot.demo.dto;

import lombok.*;

import java.sql.Date;
import java.sql.Time;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDTO
{
    int id;
    private Date date;
    private Time startTime;
    private Time endTime;
    private int roomId;
    private String title;
    private Long employeeCode;
}
