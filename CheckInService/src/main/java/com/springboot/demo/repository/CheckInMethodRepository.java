package com.springboot.demo.repository;

import com.springboot.demo.entity.CheckInMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CheckInMethodRepository extends JpaRepository<CheckInMethod, Long> {
    Optional<CheckInMethod> findByCode(String code);
}
