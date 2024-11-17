package com.example.AMSS.controller;
import java.util.Map;
import java.util.HashMap;
import com.example.AMSS.model.UserGroup;
import com.example.AMSS.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.AMSS.model.User;
import com.example.AMSS.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import org.springframework.http.HttpStatus;

import java.util.concurrent.ExecutionException;
import java.util.List;

@RestController
@RequestMapping("/api/user-groups")
@CrossOrigin(origins = "http://localhost:3000")
public class UserGroupController {
    @Autowired
    private UserGroupService userGroupService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<User>> getUsersByGroupId (@PathVariable Long groupId) throws ExecutionException, InterruptedException{
        List<User> users = userGroupService.getUsersByGroupId(groupId);
        System.out.println("aici2");
        return ResponseEntity.ok(users);
    }



    @PostMapping("/addUsersToGroup")
    public ResponseEntity<String> addUsersToGroup(@RequestBody Map<String, Object> payload) {
        Long groupId = ((Number) payload.get("groupId")).longValue();
        List<Long> userIds = (List<Long>) payload.get("userIds");
        System.out.println("1");
        try {
            System.out.println(groupId);
            System.out.println(userIds);
            userGroupService.addUsersToGroup(groupId, userIds);
            System.out.println("2");
            return ResponseEntity.ok("Users added to group successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Error adding users to group: " + e.getMessage());
        }
    }


    //    @GetMapping("/group/{groupId}")
//    public ResponseEntity<List<UserGroup>> getUserGroupsByGroupId(@PathVariable String groupId) {
//        List<UserGroup> userGroups = userGroupService.getUserGroupsByGroupId(groupId);
//        return ResponseEntity.ok(userGroups);
//    }
    @GetMapping
    public ResponseEntity<List<UserGroup>> getAllUserGroups() {
        List<UserGroup> userGroups = userGroupService.getAllUserGroups();
        return ResponseEntity.ok(userGroups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserGroup> getUserGroupById(@PathVariable Long id) {
        return userGroupService.getUserGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserGroup>> getUserGroupsByUserId(@PathVariable Long userId) {
        List<UserGroup> userGroups = userGroupService.getUserGroupsByUserId(userId);
        return ResponseEntity.ok(userGroups);
    }


    @PostMapping
    public ResponseEntity<UserGroup> createUserGroup(@RequestBody UserGroup userGroup) {
        UserGroup createdUserGroup = userGroupService.createUserGroup(userGroup);
        return ResponseEntity.ok(createdUserGroup);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserGroup(@PathVariable Long id) {
        userGroupService.deleteUserGroup(id);
        return ResponseEntity.noContent().build();
    }
}
