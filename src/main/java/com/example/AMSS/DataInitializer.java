package com.example.AMSS;

import com.example.AMSS.model.User;
import com.example.AMSS.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {

        if (userRepository.count() == 0) {

            User user1 = new User();
            user1.setName("Alice");
            User user2 = new User();
            user2.setName("Bob");
            User user3 = new User();
            user3.setName("Eve");

            userRepository.saveAll(Arrays.asList(user1, user2, user3));
            System.out.println("Sample users added to the database.");
        }
    }
}
