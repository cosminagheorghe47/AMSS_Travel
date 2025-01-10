package com.example.AMSS.service;

import com.example.AMSS.model.Notification;
import com.example.AMSS.repository.NotificationRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        Firestore db = FirestoreClient.getFirestore();
        String id = String.valueOf(System.currentTimeMillis());
        notification.setId(Long.parseLong(id));

        try {
            ApiFuture<WriteResult> result = db.collection("notifications").document(id).set(notification);
            System.out.println("Notification added at: " + result.get().getUpdateTime());
        } catch (Exception e) {
            System.err.println("Error saving notification: " + e.getMessage());
        }
        return notification;
    }

    public List<Notification> getNotificationsByUserId(String userId) {
        System.out.println("GETTING NOTIFICATIONS");
        Firestore firestore = FirestoreClient.getFirestore();
        try {
            Query query = firestore.collection("notifications").whereEqualTo("userId", userId).whereEqualTo("read", false);
            List<Notification> notifications = query.get().get().toObjects(Notification.class);
            System.out.println("Fetched notifications for userId: " + userId + " -> " + notifications);
            return notifications;
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("fail fetch notif");
            throw new RuntimeException("Failed to fetch notifications", e);
        }
    }

    public void markNotificationAsRead(Long notificationId) {
        System.out.println("Marking notification as read for ID: " + notificationId);
        Firestore firestore = FirestoreClient.getFirestore();
        try {

            Query query = firestore.collection("notifications").whereEqualTo("id", notificationId);
            List<QueryDocumentSnapshot> documents = query.get().get().getDocuments();

            if (documents.isEmpty()) {
                System.out.println("No notification found with ID: " + notificationId);
                throw new RuntimeException("Notification not found");
            }

            DocumentReference docRef = documents.getFirst().getReference();
            Map<String, Object> updates = new HashMap<>();
            updates.put("read", true);
            docRef.update(updates).get();

            System.out.println("Notification marked as read for Firestore document: " + docRef.getId());
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("Failed to mark notification as read for ID: " + notificationId);
            throw new RuntimeException("Failed to mark notification as read", e);
        }

    }
}
