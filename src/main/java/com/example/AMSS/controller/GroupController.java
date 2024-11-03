package com.example.AMSS.controller;
import com.example.AMSS.model.Group;
import com.example.AMSS.model.User;
import com.example.AMSS.repository.GroupRepository;
import com.example.AMSS.repository.UserRepository;
import com.example.AMSS.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group groupRequest) {
        Group newGroup = new Group();
        newGroup.setName(groupRequest.getName());
        newGroup.setDescription(groupRequest.getDescription());
        newGroup.setStartDate(groupRequest.getStartDate());
        newGroup.setEndDate(groupRequest.getEndDate());

        List<User> fetchedUsers = userRepository.findAllById(groupRequest.getUsers().stream().map(User::getId).collect(Collectors.toList()));
        newGroup.setUsers(fetchedUsers);

        Group savedGroup = groupRepository.save(newGroup);
        return ResponseEntity.ok(savedGroup);
    }
}