package com.kayanan.springecom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.List;

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


