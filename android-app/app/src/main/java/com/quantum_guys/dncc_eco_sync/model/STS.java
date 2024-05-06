package com.quantum_guys.dncc_eco_sync.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.ArrayList;

public class STS implements Serializable {
    ArrayList<Vehicle> vehicles;
    ArrayList<User> managers;
    String logo;
    String address;
    double lon;
    double lat;
    int currentWasteVolume;
    int id;
    String name;
    String wardNumber;
    int capacity;

    public STS(int id, String name, String wardNumber, int capacity, int currentWasteVolume, double lat, double lon, String address, String logo, ArrayList<User> managers, ArrayList<Vehicle> vehicles) {
        this.id = id;
        this.name = name;
        this.wardNumber = wardNumber;
        this.capacity = capacity;
        this.currentWasteVolume = currentWasteVolume;
        this.lat = lat;
        this.lon = lon;
        this.address = address;
        this.logo = logo;
        this.managers = managers;
        this.vehicles = vehicles;
    }

    public STS() {
    }

    @JsonProperty("id")
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }


    @JsonProperty("name")
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }


    @JsonProperty("wardNumber")
    public String getWardNumber() {
        return this.wardNumber;
    }

    public void setWardNumber(String wardNumber) {
        this.wardNumber = wardNumber;
    }


    @JsonProperty("capacity")
    public int getCapacity() {
        return this.capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }


    @JsonProperty("currentWasteVolume")
    public int getCurrentWasteVolume() {
        return this.currentWasteVolume;
    }

    public void setCurrentWasteVolume(int currentWasteVolume) {
        this.currentWasteVolume = currentWasteVolume;
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


    @JsonProperty("address")
    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    @JsonProperty("logo")
    public String getLogo() {
        return this.logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }


    @JsonProperty("managers")
    public ArrayList<User> getManagers() {
        return this.managers;
    }

    public void setManagers(ArrayList<User> managers) {
        this.managers = managers;
    }


    @JsonProperty("vehicles")
    public ArrayList<Vehicle> getVehicles() {
        return this.vehicles;
    }

    public void setVehicles(ArrayList<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }


}