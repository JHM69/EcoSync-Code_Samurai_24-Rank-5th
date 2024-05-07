package com.quantum_guys.dncc_eco_sync.model;

import java.io.Serializable;
import java.util.Date;

public class TruckDumpEntry implements Serializable {

        Integer id, billId, tripId, landfillId, userId;

        Date timeOfArrival, timeOfDeparture, createdAt;

        float volumeOfWaste;

        Landfill landfill;


        User user;


        Trip trip;


    public TruckDumpEntry(Integer id, Integer billId, Integer tripId, Integer landfillId, Integer userId, Date timeOfArrival, Date timeOfDeparture, Date createdAt, float volumeOfWaste, Landfill landfill, User user, Trip trip) {
        this.id = id;
        this.billId = billId;
        this.tripId = tripId;
        this.landfillId = landfillId;
        this.userId = userId;
        this.timeOfArrival = timeOfArrival;
        this.timeOfDeparture = timeOfDeparture;
        this.createdAt = createdAt;
        this.volumeOfWaste = volumeOfWaste;
        this.landfill = landfill;
        this.user = user;
        this.trip = trip;
    }

public TruckDumpEntry() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getBillId() {
        return billId;
    }

    public void setBillId(Integer billId) {
        this.billId = billId;
    }

    public Integer getTripId() {
        return tripId;
    }

    public void setTripId(Integer tripId) {
        this.tripId = tripId;
    }

    public Integer getLandfillId() {
        return landfillId;
    }

    public void setLandfillId(Integer landfillId) {
        this.landfillId = landfillId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Date getTimeOfArrival() {
        return timeOfArrival;
    }

    public void setTimeOfArrival(Date timeOfArrival) {
        this.timeOfArrival = timeOfArrival;
    }

    public Date getTimeOfDeparture() {
        return timeOfDeparture;
    }

    public void setTimeOfDeparture(Date timeOfDeparture) {
        this.timeOfDeparture = timeOfDeparture;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public float getVolumeOfWaste() {
        return volumeOfWaste;
    }

    public void setVolumeOfWaste(float volumeOfWaste) {
        this.volumeOfWaste = volumeOfWaste;
    }

    public Landfill getLandfill() {
        return landfill;
    }

    public void setLandfill(Landfill landfill) {
        this.landfill = landfill;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }
}
