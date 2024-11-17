package com.example.AMSS.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.cloud.Timestamp;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.cloud.Timestamp;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Entity
@Table(name = "groups")
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Date startDate; // Changed to java.util.Date
    private Date endDate;   // Changed to java.util.Date

    public Group() {}

    public Group(Long id, String name, String description, Date startDate, Date endDate) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

}
