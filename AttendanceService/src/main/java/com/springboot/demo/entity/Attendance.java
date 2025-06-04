package com.springboot.demo.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"employee_code", "date"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code")
    private Long employeeCode;

    @Column
    private String employeeName;

    @Column
    private LocalDate date;

    @ManyToOne
    private AttendanceStatus status;

    @ManyToOne
    private TransportMode transportMode;

    @ManyToOne
    private CheckInMethod checkInMethod;

    @Column
    private boolean autoCheckIn;

    @Column
    private LocalDateTime checkInTime;

    @Column
    private LocalDateTime checkOutTime;
}
