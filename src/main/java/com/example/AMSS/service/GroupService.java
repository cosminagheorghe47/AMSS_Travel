package com.example.AMSS.service;


import com.example.AMSS.model.Group;
import com.example.AMSS.repository.GroupRepository;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    public List<Group> getAllGroups() {

        return groupRepository.findAll();
    }

    public List<Group> getAllGroupsFromFirestore() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        List<Group> groupList = new ArrayList<>();
        QuerySnapshot querySnapshot = db.collection("groups").get().get();
        for (QueryDocumentSnapshot document : querySnapshot) {
            Group group = document.toObject(Group.class);
            groupList.add(group);
        }
        return groupList;
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }
}

