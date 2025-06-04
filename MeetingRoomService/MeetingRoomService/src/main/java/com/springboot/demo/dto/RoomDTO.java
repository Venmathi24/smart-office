package com.springboot.demo.dto;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDTO
{
    private String name;
    private int capacity;
    private int floor;
    private String location;
    private String createdBy;
    private String updatedBy;
}
