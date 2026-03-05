package com.kayanan.springecom.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.kayanan.springecom.repo.UserRepo;
import com.kayanan.springecom.model.User;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;
    private BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

    public User saveUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        System.out.println("=====================================");
        System.out.println(user.getPassword());
        System.out.println(user);
        return repo.save(user) ;

    }
}
