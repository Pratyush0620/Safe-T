package com.example.nirmandemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NirmanDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(NirmanDemoApplication.class, args);
    }

}
