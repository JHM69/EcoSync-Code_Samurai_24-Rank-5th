package com.quantum_guys.dncc_eco_sync.models;

import java.io.Serializable;
import java.util.Date;

public class VehicleEntry implements Serializable {

    Integer id,stsId,vehicleId,landfillId,userId;
    double lon;
    double lat;

    float volumeOfWaste;

    Date timeOfArrival, timeOfDeparture;

    User user;

    Sts sts;
    Vehicle vehicle;
    Landfill landfill;


    public VehicleEntry(Integer id, Integer stsId, Integer vehicleId, Integer landfillId, Integer userId, double lon, double lat, float volumeOfWaste, Date timeOfArrival, Date timeOfDeparture, User user, Sts sts, Vehicle vehicle, Landfill landfill) {
        this.id = id;
        this.stsId = stsId;
        this.vehicleId = vehicleId;
        this.landfillId = landfillId;
        this.userId = userId;
        this.lon = lon;
        this.lat = lat;
        this.volumeOfWaste = volumeOfWaste;
        this.timeOfArrival = timeOfArrival;
        this.timeOfDeparture = timeOfDeparture;
        this.user = user;
        this.sts = sts;
        this.vehicle = vehicle;
        this.landfill = landfill;
    }

    public VehicleEntry() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStsId() {
        return stsId;
    }

    public void setStsId(Integer stsId) {
        this.stsId = stsId;
    }

    public Integer getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
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

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public float getVolumeOfWaste() {
        return volumeOfWaste;
    }

    public void setVolumeOfWaste(float volumeOfWaste) {
        this.volumeOfWaste = volumeOfWaste;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Landfill getLandfill() {
        return landfill;
    }

    public void setLandfill(Landfill landfill) {
        this.landfill = landfill;
    }

    public Sts getSts() {
        return sts;
    }

    public void setSts(Sts sts) {
        this.sts = sts;
    }
}
