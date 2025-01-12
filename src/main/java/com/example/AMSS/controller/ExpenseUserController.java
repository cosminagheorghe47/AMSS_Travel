package com.example.AMSS.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.AMSS.model.ExpenseUser;
import com.example.AMSS.service.ExpenseUserService;

@RestController
@RequestMapping("/api/expense-users")
public class ExpenseUserController {

    private final ExpenseUserService expenseUserService;

    public ExpenseUserController(ExpenseUserService expenseUserService) {
        this.expenseUserService = expenseUserService;
    }

    @PostMapping
    public ResponseEntity<ExpenseUser> addExpenseUser(@RequestBody ExpenseUser expenseUser) throws ExecutionException, InterruptedException {
        ExpenseUser createdExpenseUser = expenseUserService.addExpenseUser(expenseUser);
        return ResponseEntity.ok(createdExpenseUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpenseUser(@PathVariable Long id) throws ExecutionException, InterruptedException {
        expenseUserService.deleteExpenseUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/expense/{expenseId}")
    public ResponseEntity<List<ExpenseUser>> findByExpenseId(@PathVariable Long expenseId) throws ExecutionException, InterruptedException {
        List<ExpenseUser> expenseUsers = expenseUserService.findByExpenseId(expenseId);
        return ResponseEntity.ok(expenseUsers);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExpenseUser>> findByUserId(@PathVariable String userId) throws ExecutionException, InterruptedException {
        List<ExpenseUser> expenseUsers = expenseUserService.findByUserId(userId);
        return ResponseEntity.ok(expenseUsers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseUser> updateExpenseUser(@PathVariable Long id, @RequestBody ExpenseUser updatedExpenseUser) throws ExecutionException, InterruptedException {
        ExpenseUser expenseUser = expenseUserService.updateExpenseUser(id, updatedExpenseUser);
        return ResponseEntity.ok(expenseUser);
    }

    @PutMapping("/{id}/update-status")
    public ResponseEntity<ExpenseUser> updateStatus(
            @PathVariable Long id,
            @RequestParam boolean status) throws ExecutionException, InterruptedException {
        ExpenseUser expenseUser = expenseUserService.updateStatus(id, status);
        return ResponseEntity.ok(expenseUser);
    }

    
}
