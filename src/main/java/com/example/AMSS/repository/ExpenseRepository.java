package com.example.AMSS.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.AMSS.model.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // List<Expense> findByGroupId(Long groupId);

    // List<Expense> findByCreatedById(Long userId);
}