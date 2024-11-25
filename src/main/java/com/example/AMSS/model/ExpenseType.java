package com.example.AMSS.model;

public enum ExpenseType {
    INDIVIDUAL, GROUP;

    public static ExpenseType fromString(String value) {
        for (ExpenseType type : ExpenseType.values()) {
            if (type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }

}
