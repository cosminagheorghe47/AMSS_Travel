package com.example.AMSS.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.example.AMSS.model.ExpenseType;
import org.springframework.stereotype.Service;
import com.example.AMSS.model.Notification;
import com.example.AMSS.model.User;
import org.checkerframework.checker.units.qual.N;
import com.example.AMSS.model.Expense;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import java.util.concurrent.ExecutionException;

@Service
public class ExpenseService {

    private static final String COLLECTION_NAME = "expenses";
    private final NotificationService notificationService;
    private final UserGroupService userGroupService;

    public ExpenseService(NotificationService notificationService, UserGroupService userGroupService) {
        this.notificationService = notificationService;
        this.userGroupService = userGroupService;
    }

    public List<Expense> getExpensesByGroup(Long groupId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<Expense> expenses = new ArrayList<>();
    
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("groupId", groupId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();
    
        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            double amount = document.getDouble("amount");
            long groupIdd = document.getLong("groupId");
            String description = document.getString("description");
            long id = document.getLong("id");
            Date creationDate = document.getDate("creationDate");
            ExpenseType type = ExpenseType.valueOf(document.getString("type"));
            
            // Verifică și setează amountPaid
            Double amountPaid = document.getDouble("amountPaid");
            if (amountPaid == null) {
                amountPaid = 0.0;
            }
    
            String createdById;
            if (document.get("createdById") instanceof String)
                createdById = document.getString("createdById");
            else 
                createdById = String.valueOf(document.getLong("createdById")); // Convertim în String
    
            // Construim manual obiectul Expense
            Expense expense = new Expense(amount, groupIdd, description, id, creationDate, type, createdById, amountPaid);
            expense.setAmountPaid(amountPaid); // Setăm valoarea amountPaid
    
            expenses.add(expense);
        }
        return expenses;
    }
    

    public List<Expense> getExpensesByUser(String userId) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        List<Expense> expenses = new ArrayList<>();

        Query query = db.collection(COLLECTION_NAME).whereEqualTo("createdById", userId);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
            Expense expense = document.toObject(Expense.class);
            expenses.add(expense);
        }
        return expenses;
    }

    public Expense addExpense(Expense expense) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        String id = String.valueOf(System.currentTimeMillis());
        expense.setId(Long.valueOf(id));

        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME).document(id).set(expense);
        System.out.println("Expense added at: " + result.get().getUpdateTime());

        return expense;
    }

    public Expense updateExpense(Long id, Expense updatedExpense) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String idStr = String.valueOf(id);

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(idStr);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (!document.exists()) {
            throw new RuntimeException("Expense not found with id: " + id);
        }

        Expense existingExpense = document.toObject(Expense.class);
        if (existingExpense != null) {
            existingExpense.setDescription(updatedExpense.getDescription());
            existingExpense.setAmount(updatedExpense.getAmount());
            existingExpense.setType(updatedExpense.getType());
            existingExpense.setCreationDate(updatedExpense.getCreationDate());
            existingExpense.setGroupId(updatedExpense.getGroupId());
            existingExpense.setCreatedById(updatedExpense.getCreatedById());
            existingExpense.setAmountPaid(updatedExpense.getAmountPaid());

            ApiFuture<WriteResult> writeResult = docRef.set(existingExpense);
            System.out.println("Expense updated at: " + writeResult.get().getUpdateTime());
        }

        return existingExpense;
    }

    public void deleteExpense(Long id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        String idStr = String.valueOf(id);

        DocumentReference docRef = db.collection(COLLECTION_NAME).document(idStr);
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();

        if (!document.exists()) {
            throw new RuntimeException("Expense not found with id: " + id);
        }

        ApiFuture<WriteResult> writeResult = docRef.delete();
        System.out.println("Expense deleted at: " + writeResult.get().getUpdateTime());
    }

    public Expense updateAmountPaid(Long expenseId, double amountPaid) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("expenses").document(expenseId.toString());
        ApiFuture<DocumentSnapshot> future = docRef.get();
        DocumentSnapshot document = future.get();
    
        if (!document.exists()) {
            throw new RuntimeException("Expense not found with id: " + expenseId);
        }
    
        Expense expense = document.toObject(Expense.class);
        if (expense != null) {
            expense.setAmountPaid(expense.getAmountPaid() + amountPaid);
            docRef.set(expense);
        }
    
        return expense;
    }
}