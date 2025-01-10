package com.example.AMSS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import com.example.AMSS.model.ExpenseUser;

@Repository
public interface ExpenseUserRepository extends JpaRepository<ExpenseUser, Long> {
    List<ExpenseUser> findByUserId(String userId);
    List<ExpenseUser> findByExpenseId(Long expenseId);
}