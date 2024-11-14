package com.example.AMSS.controller;

import com.example.AMSS.model.User;
import com.example.AMSS.repository.UserRepository;
import com.example.AMSS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User userRequest) throws ExecutionException, InterruptedException {
        User newUser = new User();
        newUser.setName(userRequest.getName());
//        User savedUser = userService.createUser(newUser);
        String createdTime = userService.createUser(newUser);
        return ResponseEntity.ok(createdTime);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() throws ExecutionException, InterruptedException {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}

