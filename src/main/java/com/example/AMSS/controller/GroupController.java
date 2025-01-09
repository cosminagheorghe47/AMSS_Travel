package com.example.AMSS.controller;
import com.example.AMSS.model.Group;
import com.example.AMSS.model.User;
import com.example.AMSS.repository.GroupRepository;
import com.example.AMSS.repository.UserRepository;
import com.example.AMSS.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ExecutionException;
import com.google.cloud.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() throws ExecutionException, InterruptedException {
        List<Group> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group groupRequest) throws ExecutionException, InterruptedException {
        Group savedGroup = groupService.createGroup(groupRequest);
        return ResponseEntity.ok(savedGroup);
    }


    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long groupId) {
        try {
            Group group = groupService.getGroupById(groupId);
            return ResponseEntity.ok(group);
        } catch (RuntimeException | ExecutionException | InterruptedException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    // public ResponseEntity<Group> getGroupById(@PathVariable Long groupId) {
    //     Group group = groupService.getGroupById(groupId);
    //     return ResponseEntity.ok(group);
    // }
    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteGroup(@PathVariable Long groupId) {
        try {
            groupService.deleteGroup(groupId);
            return ResponseEntity.ok("Group with ID " + groupId + " has been deleted.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (ExecutionException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(500).body("An error occurred while deleting the group.");
        }
    }
}


