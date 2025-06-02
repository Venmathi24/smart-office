package com.springboot.demo.repository;

import com.springboot.demo.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeCodeAndDate(Long employeeId, LocalDate date);
    Attendance save(Attendance attendance);
    List<Attendance> findAll();
}
