package com.quantum_guys.dncc_eco_sync.model;

import com.github.marlonlom.utilities.timeago.TimeAgo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Trip implements Serializable {


    int id;


    int vehicleId;


    int driverId;


    int startLandfillId;


    Vehicle vehicle;


    Driver driver;


    Landfill startLandfill;


    List<VehicleEntry> vehicleEntries = new ArrayList<>();


    List<VehicleMeta> vehicleMetas = new ArrayList<>();


    List<TruckDumpEntry> truckDumpEntries = new ArrayList<>();


    boolean completed;


    float amount;


    Date createdAt;


    Date finishedAt;


    float distance;


    float duration;


    Bill bill;


    public Trip(int id, int vehicleId, int driverId, int startLandfillId, Vehicle vehicle, Driver driver, Landfill startLandfill, List<VehicleEntry> vehicleEntries, List<VehicleMeta> vehicleMetas, List<TruckDumpEntry> truckDumpEntries, boolean completed, float amount, Date createdAt, Date finishedAt, float distance, float duration, Bill bill) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.driverId = driverId;
        this.startLandfillId = startLandfillId;
        this.vehicle = vehicle;
        this.driver = driver;
        this.startLandfill = startLandfill;
        this.vehicleEntries = vehicleEntries;
        this.vehicleMetas = vehicleMetas;
        this.truckDumpEntries = truckDumpEntries;
        this.completed = completed;
        this.amount = amount;
        this.createdAt = createdAt;
        this.finishedAt = finishedAt;
        this.distance = distance;
        this.duration = duration;
        this.bill = bill;
    }

    public Trip() {
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(int vehicleId) {
        this.vehicleId = vehicleId;
    }

    public int getDriverId() {
        return driverId;
    }

    public void setDriverId(int driverId) {
        this.driverId = driverId;
    }

    public int getStartLandfillId() {
        return startLandfillId;
    }

    public void setStartLandfillId(int startLandfillId) {
        this.startLandfillId = startLandfillId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Landfill getStartLandfill() {
        return startLandfill;
    }

    public void setStartLandfill(Landfill startLandfill) {
        this.startLandfill = startLandfill;
    }

    public List<VehicleEntry> getVehicleEntries() {
        return vehicleEntries;
    }

    public void setVehicleEntries(List<VehicleEntry> vehicleEntries) {
        this.vehicleEntries = vehicleEntries;
    }

    public List<VehicleMeta> getVehicleMetas() {
        return vehicleMetas;
    }

    public void setVehicleMetas(List<VehicleMeta> vehicleMetas) {
        this.vehicleMetas = vehicleMetas;
    }

    public List<TruckDumpEntry> getTruckDumpEntries() {
        return truckDumpEntries;
    }

    public void setTruckDumpEntries(List<TruckDumpEntry> truckDumpEntries) {
        this.truckDumpEntries = truckDumpEntries;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
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

    public Date getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(Date finishedAt) {
        this.finishedAt = finishedAt;
    }

    public float getDistance() {
        return distance;
    }

    public void setDistance(float distance) {
        this.distance = distance;
    }

    public float getDuration() {
        return duration;
    }

    public void setDuration(float duration) {
        this.duration = duration;
    }

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }

    public String getTotalAmount() {
        return "৳" + getAmount();
    }

    public String getVehicleRegNo() {
        return "Vehicle: " + getVehicle().name;
    }

    public String getLastStsName() {
        try {
            return "Last STS: " + vehicleEntries.get(vehicleEntries.size() - 1).sts.getName();
        } catch (Exception d) {
            return "Nothing to Show";
        }
    }



    public String getStartTime() {
        return TimeAgo.using(createdAt.getTime());
    }


    public String getTotalWasteCarried() {
        float total = 0;
        for(VehicleEntry vehicleEntry:  vehicleEntries) {
            total += vehicleEntry.getVolumeOfWaste();
        }
        return total + " T";
    }
}
