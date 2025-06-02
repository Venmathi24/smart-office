package com.springboot.demo.dto;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


public class RoomResponseDTO {

    private int id;
    private String name;

    private int capacity;

    public RoomResponseDTO(int id, String name, int capacity) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
    }

    public RoomResponseDTO() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
