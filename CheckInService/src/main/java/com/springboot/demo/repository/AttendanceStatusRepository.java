package com.springboot.demo.repository;

import com.springboot.demo.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttendanceStatusRepository extends JpaRepository<AttendanceStatus, Long> {
    Optional<AttendanceStatus> findByCode(String code);
}
