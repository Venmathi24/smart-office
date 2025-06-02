package com.springboot.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.springboot.demo.repository")
@EnableCaching
public class MeetingRoomServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(MeetingRoomServiceApplication.class, args);
	}
}
