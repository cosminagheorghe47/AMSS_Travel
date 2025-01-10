package com.example.AMSS.service;
import java.util.Map;
import java.util.HashMap;
import com.example.AMSS.model.User;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.http.HttpStatus;
import com.example.AMSS.model.UserGroup;
import com.example.AMSS.repository.UserRepository;
import com.example.AMSS.repository.UserGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.example.AMSS.model.UserGroup;
import com.example.AMSS.repository.UserGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ExecutionException;
import java.util.List;
import java.util.Optional;

@Service
public class UserGroupService {

    @Autowired
    private UserRepository userRepository;



    private static final String USER_GROUP_COLLECTION = "user_groups";
    private static final String USER_COLLECTION = "users";


    @Autowired
    private UserService userService;

    public List<User> getUsersByGroupId(Long groupId) throws ExecutionException, InterruptedException, FirebaseAuthException {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> userGroupQuery = db.collection(USER_GROUP_COLLECTION)
                .whereEqualTo("groupId", groupId)
                .get();

        List<User> users = new ArrayList<>();
        for (QueryDocumentSnapshot userGroupDoc : userGroupQuery.get()) {
            String userId = userGroupDoc.getString("userId");
            if (userId != null) {
                User user = userService.findById(userId);
                if (user != null) {
                    System.out.println("Found user: " + user);
                    users.add(user);
                }
            }
        }

        return users;
    }

    @Autowired
    private UserGroupRepository userGroupRepository;

    public void addUsersToGroup(Long groupId, List<String> userIds) throws Exception {

        Firestore db = FirestoreClient.getFirestore();
        System.out.println("here"+userIds);
        for(int i=0;i<userIds.size();i++){
            System.out.println("curr users id: " + userIds);
            if (userIds.get(i) == null) {
                System.out.println("UserId is null");
            } else {
                System.out.println("curr user id: " + userIds.get(i) );
            }
            try {
                Map<String, Object> userGroupData = new HashMap<>();
                Long userGroupId = generateUserGroupId();
                System.out.println("Generated userGroupId: " + userGroupId);

                userGroupData.put("id", userGroupId);
                userGroupData.put("groupId", groupId);
                userGroupData.put("userId", userIds.get(i));

                ApiFuture<WriteResult> future = db.collection(USER_GROUP_COLLECTION)
                        .document(String.valueOf(userGroupId))
                        .set(userGroupData);


            } catch (Exception e) {
                System.err.println("Error adding user to group: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }



    private Long generateUserGroupId() {
        return System.currentTimeMillis();
    }






//    public List<User> getUsersByGroupId(Long groupId) {
//
//        List<UserGroup> userGroups = userGroupRepository.findByGroupId(groupId);
//
//        System.out.println("aici1");
//        return userGroups.stream()
//                .map(userGroup -> userRepository.findById(userGroup.getUserId()).orElse(null))
//                .collect(Collectors.toList());
//    }

    public List<UserGroup> getAllUserGroups() {
        return userGroupRepository.findAll();
    }

    public Optional<UserGroup> getUserGroupById(Long id) {
        return userGroupRepository.findById(id);
    }

    public List<UserGroup> getUserGroupsByUserId(String userId) {
        return userGroupRepository.findByUserId(userId);
    }

    public List<UserGroup> getUserGroupsByGroupId(Long groupId) {
        return userGroupRepository.findByGroupId(groupId);
    }

    public UserGroup createUserGroup(UserGroup userGroup) {
        return userGroupRepository.save(userGroup);
    }

    public void deleteUserGroup(Long id) {
        userGroupRepository.deleteById(id);
    }
}
