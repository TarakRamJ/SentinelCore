package com.service.asserts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AssertsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssertsApplication.class, args);
	}

}
