package com.springboot.demo.repository;

import com.springboot.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeCode(Long employeeCode);
    Optional<Employee> findByName(String username);
    List<Employee> findByNameContaining(String username);
}
