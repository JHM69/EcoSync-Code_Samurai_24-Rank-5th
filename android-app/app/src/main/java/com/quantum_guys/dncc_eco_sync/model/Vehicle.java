package com.quantum_guys.dncc_eco_sync.model;


import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.ArrayList;

public class Vehicle implements Serializable {
    int id;
    String registrationNumber;
    String type;
    String name;
    int capacity;
    int remainingCapacity;
    double lat;
    double lon;
    boolean isFull;
    int loaddedFuelCost;
    int unloadedFuelCost;
    int stsId;
    User driver;

    public Vehicle(int id, String registrationNumber, String type, String name, int capacity, int remainingCapacity, double lat, double lon, boolean isFull, int loaddedFuelCost, int unloadedFuelCost, int stsId, User driver) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.type = type;
        this.name = name;
        this.capacity = capacity;
        this.remainingCapacity = remainingCapacity;
        this.lat = lat;
        this.lon = lon;
        this.isFull = isFull;
        this.loaddedFuelCost = loaddedFuelCost;
        this.unloadedFuelCost = unloadedFuelCost;
        this.stsId = stsId;
        this.driver = driver;
    }

    public Vehicle(int id, String registrationNumber, String type, String name, int capacity, int remainingCapacity, double lat, double lon, boolean isFull, int loaddedFuelCost, int unloadedFuelCost, int stsId) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.type = type;
        this.name = name;
        this.capacity = capacity;
        this.remainingCapacity = remainingCapacity;
        this.lat = lat;
        this.lon = lon;
        this.isFull = isFull;
        this.loaddedFuelCost = loaddedFuelCost;
        this.unloadedFuelCost = unloadedFuelCost;
        this.stsId = stsId;
    }

    public Vehicle() {
    }

    @JsonProperty("id")
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }


    @JsonProperty("registrationNumber")
    public String getRegistrationNumber() {
        return this.registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    @JsonProperty("type")
    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @JsonProperty("name")
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }


    @JsonProperty("capacity")
    public int getCapacity() {
        return this.capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    @JsonProperty("remainingCapacity")
    public int getRemainingCapacity() {
        return this.remainingCapacity;
    }

    public void setRemainingCapacity(int remainingCapacity) {
        this.remainingCapacity = remainingCapacity;
    }


    @JsonProperty("lat")
    public double getLat() {
        return this.lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }


    @JsonProperty("lon")
    public double getLon() {
        return this.lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }


    @JsonProperty("isFull")
    public boolean getIsFull() {
        return this.isFull;
    }

    public void setIsFull(boolean isFull) {
        this.isFull = isFull;
    }



    @JsonProperty("loaddedFuelCost")
    public int getLoaddedFuelCost() {
        return this.loaddedFuelCost;
    }

    public void setLoaddedFuelCost(int loaddedFuelCost) {
        this.loaddedFuelCost = loaddedFuelCost;
    }






    @JsonProperty("unloadedFuelCost")
    public int getUnloadedFuelCost() {
        return this.unloadedFuelCost;
    }

    public void setUnloadedFuelCost(int unloadedFuelCost) {
        this.unloadedFuelCost = unloadedFuelCost;
    }


    @JsonProperty("stsId")
    public int getStsId() {
        return this.stsId;
    }

    public void setStsId(int stsId) {
        this.stsId = stsId;
    }



    @JsonProperty("driver")
    public User getDriver() {
        return this.driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }


}