package com.example.AMSS.model;

import java.util.Date;

import org.checkerframework.checker.units.qual.degrees;

import jakarta.persistence.*;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private double amount;
    private Date creationDate;
    
    @Enumerated(EnumType.STRING)
    private ExpenseType type;

    private Long groupId;
    private String createdById;
    private String createdByName;
    private double amountPaid;

    public Expense(Object groupId) {}
    public Expense() {}
    // Constructor
    public Expense(double amount, long groupId, String description, long id, Date creationDate, ExpenseType type, String createdById, double amountPaid) {
        this.amount = amount;
        this.groupId = groupId;
        this.description = description;
        this.id = id;
        this.creationDate = creationDate;
        this.type = type;
        this.createdById = createdById;
        this.amountPaid = amountPaid;
    }
    public Expense(double amount, long groupId, String description, long id, Date creationDate, ExpenseType type, String createdById, double amountPaid, String createdByName) {
        this.amount = amount;
        this.groupId = groupId;
        this.description = description;
        this.id = id;
        this.creationDate = creationDate;
        this.type = type;
        this.createdById = createdById;
        this.amountPaid = amountPaid;
        this.createdByName =createdByName;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

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

    public Date getCreationDate(){
        return creationDate;
    }

    public void setCreationDate(Date creationDate){
        this.creationDate = creationDate;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }
    
}
