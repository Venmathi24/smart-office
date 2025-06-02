package com.springboot.demo.repository;

import com.springboot.demo.entity.TransportMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransportModeRepository extends JpaRepository<TransportMode, Long> {
    Optional<TransportMode> findByCode(String code);
}