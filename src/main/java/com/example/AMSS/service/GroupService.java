package com.example.AMSS.service;
import java.util.logging.Logger;

import com.example.AMSS.model.Group;
import com.example.AMSS.repository.GroupRepository;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.WriteResult;
import java.util.concurrent.ExecutionException;
import com.google.cloud.Timestamp;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;
    
    private static final String COLLECTION_NAME = "groups";

    public List<Group> getAllGroups() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<Group> groupList = new ArrayList<>();

        QuerySnapshot querySnapshot = db.collection(COLLECTION_NAME).get().get();
        if (querySnapshot != null && !querySnapshot.isEmpty()) {
            for (QueryDocumentSnapshot document : querySnapshot) {
                Group group = document.toObject(Group.class);
                groupList.add(group);
            }
        }
        return groupList;
    }

    public Group createGroup(Group group) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        long id = System.currentTimeMillis();
        group.setId(id);
        ApiFuture<WriteResult> collectionApiFuture = db.collection(COLLECTION_NAME).document(String.valueOf(id)).set(group);

        return group;
    }

    public Group getGroupById(Long groupId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        String groupIdStr = String.valueOf(groupId);

        DocumentSnapshot document = db.collection(COLLECTION_NAME).document(groupIdStr).get().get();

        if (document.exists()) {
            Group group = document.toObject(Group.class);
            return group;
        } else {
            throw new RuntimeException("Group not found with id: " + groupId);
        }
    }
}


