package com.example.AMSS.service;

import com.example.AMSS.model.ExpenseUser;
import com.example.AMSS.repository.ExpenseUserRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ExpenseUserService {

    private final ExpenseUserRepository expenseUserRepository;

    public ExpenseUserService(ExpenseUserRepository expenseUserRepository) {
        this.expenseUserRepository = expenseUserRepository;
    }

    private static final String COLLECTION_NAME = "expense_users";

    public ExpenseUser addExpenseUser(ExpenseUser expenseUser) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        String id = String.valueOf(System.currentTimeMillis());
        expenseUser.setId(Long.valueOf(id));

        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(id).set(expenseUser);
        System.out.println("ExpenseUser added at: " + result.get().getUpdateTime());

        return expenseUser;
    }

    public void deleteExpenseUser(Long id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String idStr = String.valueOf(id);

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(idStr);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (!document.exists()) {
            throw new RuntimeException("ExpenseUser not found with id: " + id);
        }

        ApiFuture<WriteResult> writeResult = docRef.delete();
        System.out.println("ExpenseUser deleted at: " + writeResult.get().getUpdateTime());
    }

    public List<ExpenseUser> findByExpenseId(Long expenseId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<ExpenseUser> expenseUsers = new ArrayList<>();

        Query query = db.collection(COLLECTION_NAME).whereEqualTo("expenseId", expenseId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            ExpenseUser expenseUser = document.toObject(ExpenseUser.class);
            expenseUsers.add(expenseUser);
        }
        return expenseUsers;
    }

    public List<ExpenseUser> findByUserId(String userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<ExpenseUser> expenseUsers = new ArrayList<>();

        Query query = db.collection(COLLECTION_NAME).whereEqualTo("userId", userId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            ExpenseUser expenseUser = document.toObject(ExpenseUser.class);
            expenseUsers.add(expenseUser);
        }
        return expenseUsers;
    }

    public ExpenseUser updateExpenseUser(Long id, ExpenseUser updatedExpenseUser) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String idStr = String.valueOf(id);

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(idStr);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (!document.exists()) {
            throw new RuntimeException("ExpenseUser not found with id: " + id);
        }
        
        ExpenseUser existingExpenseUser = document.toObject(ExpenseUser.class);
        if (existingExpenseUser != null) {
            existingExpenseUser.setExpenseId(updatedExpenseUser.getExpenseId());
            existingExpenseUser.setUserId(updatedExpenseUser.getUserId());

            ApiFuture<WriteResult> writeResult = docRef.set(existingExpenseUser);
            System.out.println("ExpenseUser updated at: " + writeResult.get().getUpdateTime());
        }

        return existingExpenseUser;
    }
    
}
