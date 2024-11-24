package com.example.AMSS.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private double amount;
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    private ExpenseType type;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;        // Grupul asociat cheltuielii

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;     // Utilizatorul care a creat cheltuiala

    @ManyToMany
    @JoinTable(
        name = "expense_users",
        joinColumns = @JoinColumn(name = "expense_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> sharedWith; // Utilizatorii cu care se împarte cheltuiala

    public Expense() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public ExpenseType getType() {
        return type;
    }

    public void setType(ExpenseType type) {
        this.type = type;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<User> getSharedWith() {
        return sharedWith;
    }

    public void setSharedWith(List<User> sharedWith) {
        this.sharedWith = sharedWith;
    }
    
}
