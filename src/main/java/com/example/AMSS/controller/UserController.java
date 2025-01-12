package com.example.AMSS.controller;

import com.example.AMSS.model.Group;
import com.example.AMSS.model.User;
import com.example.AMSS.repository.UserRepository;
import com.example.AMSS.service.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;


@RestController
@RequestMapping("/auth")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private final FirebaseAuth firebaseAuth;


    public UserController(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestHeader("Authorization") String token) {
        try {
            String authToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(authToken);
            String uid = decodedToken.getUid();
            return ResponseEntity.ok("Login successful with uid: " + uid);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody User userRequest) throws ExecutionException, InterruptedException {
        User newUser = new User();
        newUser.setName(userRequest.getName());
        String createdTime = userService.createUser(newUser);
        return ResponseEntity.ok(createdTime);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserRecord>> getAllUsers() throws Exception {
        List<UserRecord> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        try {
            User user = userService.findById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException | ExecutionException | InterruptedException e) {
            return ResponseEntity.status(404).body(null);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }
}

