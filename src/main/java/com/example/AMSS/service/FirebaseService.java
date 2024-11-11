package com.example.AMSS.service;

import com.example.AMSS.model.Group;
import com.example.AMSS.model.User;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseService {
    private final Firestore db;

    public FirebaseService() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("src/main/resources/firebase-service-account.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
        this.db = FirestoreClient.getFirestore();
    }

    public List<User> getAllUsersFromFirestore() throws ExecutionException, InterruptedException {
        List<User> usersList = new ArrayList<>();
        QuerySnapshot querySnapshot = db.collection("users").get().get();
        for (QueryDocumentSnapshot document : querySnapshot) {
            User user = document.toObject(User.class);
            usersList.add(user);
        }
        return usersList;
    }

    public List<Group> getAllGroupsFromFirestore() throws ExecutionException, InterruptedException {
        List<Group> groupList = new ArrayList<>();
        QuerySnapshot querySnapshot = db.collection("groups").get().get();
        for (QueryDocumentSnapshot document : querySnapshot) {
            Group group = document.toObject(Group.class);
            groupList.add(group);
        }
        return groupList;
    }
}
