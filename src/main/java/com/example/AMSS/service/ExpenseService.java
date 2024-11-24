package com.example.AMSS.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.AMSS.model.Expense;
import com.example.AMSS.repository.ExpenseRepository;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getExpensesByGroup(Long groupId) {
        return expenseRepository.findByGroupId(groupId);
    }

    public List<Expense> getExpensesByUser(Long userId) {
        return expenseRepository.findByCreatedById(userId);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        return expenseRepository.findById(id).map(expense -> {
            expense.setDescription(updatedExpense.getDescription());
            expense.setAmount(updatedExpense.getAmount());
            expense.setType(updatedExpense.getType());
            expense.setSharedWith(updatedExpense.getSharedWith());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }
}
