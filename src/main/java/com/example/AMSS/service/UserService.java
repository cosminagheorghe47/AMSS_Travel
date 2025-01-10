package com.example.AMSS.service;
import com.example.AMSS.model.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.ListUsersPage;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.DocumentSnapshot;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {
    private static final String COLLECTION_NAME = "users";

    public String createUser(User user) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<WriteResult> collectionApiFuture = db.collection(COLLECTION_NAME).document().set(user);
        return collectionApiFuture.get().getUpdateTime().toString();
        //        return null;
    }

//    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
//        Firestore db = FirestoreClient.getFirestore();
//
//        List<User> usersList = new ArrayList<>();
//        QuerySnapshot querySnapshot = db.collection(COLLECTION_NAME).get().get();
//        for (QueryDocumentSnapshot document : querySnapshot) {
//            User user = new User((Long) document.get("id"), (String) document.get("name"), (String) document.get("email"));
////            User user = document.toObject(User.class);
//            usersList.add(user);
//        }
//        return usersList;
//    }

    public List<UserRecord> getAllUsers() throws Exception {
        List<UserRecord> users = new ArrayList<>();
        ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);
        while (page != null) {
            for (UserRecord user : page.getValues()) {
                users.add(user);
            }
            page = page.getNextPage();
        }
        return users;
    }



    public User findById(Long userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> queryFuture = db.collection(COLLECTION_NAME).whereEqualTo("id", userId).get();

        QuerySnapshot querySnapshot = queryFuture.get();

        if (!querySnapshot.isEmpty()) {
            QueryDocumentSnapshot document = querySnapshot.getDocuments().get(0);

            return new User(
                    document.getLong("id"),
                    document.getString("name"),
                    document.getString("email")
            );
        }

        return null;
    }

}
