package com.kayanan.springecom.controller;

import jakarta.servlet.http.Cookie;
import com.kayanan.springecom.service.auth.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.kayanan.springecom.model.User;
import com.kayanan.springecom.service.auth.UserService;

import javax.naming.AuthenticationException;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    AuthenticationManager authenticationManager;

    @PostMapping("register")
    public User register(@RequestBody User user) {

        return service.saveUser(user);
    }

    @PostMapping("login")
    public ResponseEntity<String> login(@RequestBody User user, HttpServletResponse response) {
    try{
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        String token = jwtService.generateToken(user.getUsername());
        Cookie cookie = new Cookie("TOKEN", token);

        cookie.setPath("/");
        cookie.setMaxAge(60 * 60);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        response.addCookie(cookie);
        return ResponseEntity.ok(token);
    }
    catch (Exception e){
        return ResponseEntity.status(404).body(e.getMessage());
    }






    }

}
