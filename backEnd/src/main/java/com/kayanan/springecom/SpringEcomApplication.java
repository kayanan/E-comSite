package com.kayanan.springecom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringEcomApplication {

	public static void main(String[] args) {
        try {
            SpringApplication.run(SpringEcomApplication.class, args);

            Parent obj1= new Child();
            obj1.show(1);
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
        }

	}

}

class Parent {
    void show(int a) {
        System.out.println("Parent int");
    }
}

class Child extends Parent {
    void show(int a) {
        System.out.println("Child int");
    }
    void play() {
        System.out.println("Child Playing");
    }
}
