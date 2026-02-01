package com.kayanan.springecom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringEcomApplication {

	public static void main(String[] args) {
        try {
            SpringApplication.run(SpringEcomApplication.class, args);
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }

	}

}
