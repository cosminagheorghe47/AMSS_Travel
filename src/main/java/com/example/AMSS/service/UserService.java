package com.example.AMSS.service;
import com.example.AMSS.model.User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {
    private final FirebaseService firebaseService;

    public UserService() throws IOException {
        firebaseService = new FirebaseService();
    }

    public User createUser(User user) {
        return null;
    }

    public List<User> getAllUsers() {
        try {
            return firebaseService.getAllUsersFromFirestore();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
