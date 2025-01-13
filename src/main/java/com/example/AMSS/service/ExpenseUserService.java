package com.example.AMSS.service;

import com.example.AMSS.model.Expense;
import com.example.AMSS.model.ExpenseUser;
import com.example.AMSS.model.Notification;
import com.example.AMSS.repository.ExpenseRepository;
import com.example.AMSS.repository.ExpenseUserRepository;
import com.example.AMSS.repository.UserRepository;
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
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    public ExpenseUserService(ExpenseUserRepository expenseUserRepository,NotificationService notificationService, UserRepository userRepository) {
        this.expenseUserRepository = expenseUserRepository;
        this.notificationService=notificationService;
        this.userRepository=userRepository;
    }

    private static final String COLLECTION_NAME = "expense_users";

    public ExpenseUser addExpenseUser(ExpenseUser expenseUser) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        String id = String.valueOf(System.currentTimeMillis());
        expenseUser.setId(Long.valueOf(id));

        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(id).set(expenseUser);
        System.out.println("ExpenseUser added at: " + result.get().getUpdateTime());
        createNotificationForExpenseUser(expenseUser);
        return expenseUser;
    }
    private void createNotificationForExpenseUser(ExpenseUser expenseUser) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        String expenseId = String.valueOf(expenseUser.getExpenseId());
        DocumentReference expenseDocRef = db.collection("expenses").document(expenseId);
        DocumentSnapshot expenseSnapshot = expenseDocRef.get().get();

        if (!expenseSnapshot.exists()) {
            System.out.println("Expense not found for ID: " + expenseId);
            return;
        }

        Expense expense = expenseSnapshot.toObject(Expense.class);

        Notification notification = new Notification();
        notification.setUserId(expenseUser.getUserId());

        notification.setDescription("User "+ expense.getCreatedByName()+" added a new expense: " + expense.getDescription());
        notification.setGroupId(expense.getGroupId());
        notification.setAmount(expense.getAmount());
        notification.setRead(false);

        // Save the notification in Firestore
        notificationService.createNotification(notification);

        System.out.println("Notification created for user: " + expenseUser.getUserId());
//        Long groupId = expense.getGroupId();
//        System.out.println("ADDING NOTIFIcations FOR expense : " + expense.getDescription());
//        System.out.println("Group id for expense: " + groupId);
//
////        List<User> usersInGroup = userGroupService.getUsersByGroupId(groupId);
//
////        for (User user : usersInGroup) {
////            if (user.getId().equals(expense.getCreatedById())) {
////                continue;
////            }
//
//        Notification notification = new Notification();
//        notification.setUserId(expense.getCreatedById());
//        notification.setDescription("User _ added a new expense: " + expense.getDescription());
//        notification.setGroupId(groupId);
//        notification.setAmount(expense.getAmount());
//        notification.setRead(false);
//        System.out.println("Group id for notification: " + notification.getGroupId() + "    userID: "  + notification.getUserId());
//        notificationService.createNotification(notification);
//        }
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

    public ExpenseUser updateStatus(Long expenseUserId, boolean status) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("expense_users").document(expenseUserId.toString());
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
    
        if (!document.exists()) {
            throw new RuntimeException("ExpenseUser not found with id: " + expenseUserId);
        }
    
        ExpenseUser expenseUser = document.toObject(ExpenseUser.class);
        if (expenseUser != null) {
            expenseUser.setStatus(status);
            docRef.set(expenseUser);
        }
    
        return expenseUser;
    }
    
    
}
