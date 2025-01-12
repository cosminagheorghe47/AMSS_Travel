package com.example.AMSS.controller;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.AMSS.model.Expense;

import com.example.AMSS.service.ExpenseService;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getExpensesByGroup(@PathVariable Long groupId) throws ExecutionException, InterruptedException {
        List<Expense> expenses = expenseService.getExpensesByGroup(groupId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/createdBy/{userId}")
    public ResponseEntity<List<Expense>> getExpensesByUser(@PathVariable String userId) throws ExecutionException, InterruptedException {
        List<Expense> expenses = expenseService.getExpensesByUser(userId);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(@RequestBody Expense expense) throws ExecutionException, InterruptedException {
        Expense createdExpense = expenseService.addExpense(expense);
        return ResponseEntity.ok(createdExpense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) throws ExecutionException, InterruptedException {
        Expense expense = expenseService.updateExpense(id, updatedExpense);
        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) throws ExecutionException, InterruptedException {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/update-amount-paid")
    public ResponseEntity<Expense> updateAmountPaid(
            @PathVariable Long id,
            @RequestParam double amountPaid) throws ExecutionException, InterruptedException {
        Expense expense = expenseService.updateAmountPaid(id, amountPaid);
        return ResponseEntity.ok(expense);
    }
}
