package com.quantum_guys.dncc_eco_sync.model;


import java.io.Serializable;

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


    int loadedFuelCost;


    int unloadedFuelCost;


    int stsId;


    User driver;

    public Vehicle(int id, String registrationNumber, String type, String name, int capacity, int remainingCapacity, double lat, double lon, boolean isFull, int loadedFuelCost, int unloadedFuelCost, int stsId, User driver) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.type = type;
        this.name = name;
        this.capacity = capacity;
        this.remainingCapacity = remainingCapacity;
        this.lat = lat;
        this.lon = lon;
        this.isFull = isFull;
        this.loadedFuelCost = loadedFuelCost;
        this.unloadedFuelCost = unloadedFuelCost;
        this.stsId = stsId;
        this.driver = driver;
    }

    public Vehicle() {
    }

    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getRegistrationNumber() {
        return this.registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public int getCapacity() {
        return this.capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getRemainingCapacity() {
        return this.remainingCapacity;
    }

    public void setRemainingCapacity(int remainingCapacity) {
        this.remainingCapacity = remainingCapacity;
    }


    public double getLat() {
        return this.lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }


    public double getLon() {
        return this.lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }


    public boolean getIsFull() {
        return this.isFull;
    }

    public void setIsFull(boolean isFull) {
        this.isFull = isFull;
    }


    public boolean isFull() {
        return isFull;
    }

    public void setFull(boolean full) {
        isFull = full;
    }

    public int getLoadedFuelCost() {
        return loadedFuelCost;
    }

    public void setLoadedFuelCost(int loadedFuelCost) {
        this.loadedFuelCost = loadedFuelCost;
    }


    public int getUnloadedFuelCost() {
        return this.unloadedFuelCost;
    }

    public void setUnloadedFuelCost(int unloadedFuelCost) {
        this.unloadedFuelCost = unloadedFuelCost;
    }


    public int getStsId() {
        return this.stsId;
    }

    public void setStsId(int stsId) {
        this.stsId = stsId;
    }



    public User getDriver() {
        return this.driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }


}