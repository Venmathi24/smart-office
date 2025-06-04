package com.springboot.demo.dto;

import lombok.*;

import java.sql.Date;
import java.sql.Time;


public class ConflictResponseDTO
{
    private Date date;
    private Time startTime;
    private Time endTime;

    public ConflictResponseDTO(Date date, Time startTime, Time endTime) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }
}
