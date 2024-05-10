package com.quantum_guys.dncc_eco_sync.models;

import java.io.Serializable;
import java.util.Date;

public class Bill implements Serializable {

    int id, tripId;
    boolean paid;
    float amount;
    Date createdAt;

    Trip trip;

    public Bill(int id, int tripId, boolean paid, float amount, Date createdAt) {
        this.id = id;
        this.tripId = tripId;
        this.paid = paid;
        this.amount = amount;
        this.createdAt = createdAt;
    }

    public Bill() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTripId() {
        return tripId;
    }

    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }
}
