package com.quantum_guys.dncc_eco_sync.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Trip implements Serializable {


    int id;
    Vehicle vehicle;
    Driver driver;
    List<STS> visitedSTSs = new ArrayList<>();
    List<LocationData> locationData = new ArrayList<>();


    public Trip(int id, Vehicle vehicle, Driver driver, List<STS> visitedSTSs, List<LocationData> locationData, Landfill startedLandfill) {
        this.id = id;
        this.vehicle = vehicle;
        this.driver = driver;
        this.visitedSTSs = visitedSTSs;
        this.locationData = locationData;
        this.startedLandfill = startedLandfill;
    }

    public Trip() {
    }

    @JsonProperty("id")
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }


    @JsonProperty("getVisitedSTSs")
    public List<STS> getVisitedSTSs() {
        return visitedSTSs;
    }

    public void setVisitedSTSs(List<STS> visitedSTSs) {
        this.visitedSTSs = visitedSTSs;
    }

    Landfill startedLandfill;

    @JsonProperty("getVisitedSTSs")
    public Landfill getStartedLandfill() {
        return startedLandfill;
    }

    public void setStartedLandfill(Landfill startedLandfill) {
        this.startedLandfill = startedLandfill;
    }

    @JsonProperty("vehicle")
    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    @JsonProperty("driver")
    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }


    @JsonProperty("locationData")
    public List<LocationData> getLocationData() {
        return locationData;
    }

    public void setLocationData(List<LocationData> locationData) {
        this.locationData = locationData;
    }


}
