// src/main/java/com/example/AMSS/services/UserService.java
package com.example.AMSS.service;

import com.example.AMSS.model.User;
import com.example.AMSS.repository.GroupRepository;
import com.example.AMSS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
