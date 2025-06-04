package com.springboot.demo.Projection;

import java.sql.Date;
import java.sql.Time;

public class BookedSlots
{
    private Time startTime;
    private Time endTime;

    public BookedSlots() {
    }

    public BookedSlots(Time startTime, Time endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
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
