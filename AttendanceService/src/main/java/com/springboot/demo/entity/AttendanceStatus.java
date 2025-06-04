package com.springboot.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "attendance_status")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    private String label;

    public AttendanceStatus(String code, String label){
        this.code = code;
        this.label = label;
    }


}
