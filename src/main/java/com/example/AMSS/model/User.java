package com.example.AMSS.model;


import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String password;
    private String email;

    @OneToMany(mappedBy = "createdBy")
    private List<Expense> createdExpenses;

    @ManyToMany(mappedBy = "sharedWith")
    private List<Expense> sharedExpenses;

    public User() {}

    public User(String name) {
        this.name = name;
    }

    public User(Long id, String name, String password, String email) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
    }

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public List<Expense> getCreatedExpenses() {
        return createdExpenses;
    }

    public void setCreatedExpenses(List<Expense> createdExpenses) {
        this.createdExpenses = createdExpenses;
    }

    public List<Expense> getSharedExpenses() {
        return sharedExpenses;
    }

    public void setSharedExpenses(List<Expense> sharedExpenses) {
        this.sharedExpenses = sharedExpenses;
    }
}

