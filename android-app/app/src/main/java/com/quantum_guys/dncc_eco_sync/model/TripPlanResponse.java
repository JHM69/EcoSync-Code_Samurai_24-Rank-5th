package com.quantum_guys.dncc_eco_sync.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;
 

public class TripPlanResponse {

    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("createdAt")
    @Expose
    private String createdAt;
    @SerializedName("type")
    @Expose
    private String type;
    @SerializedName("driverId")
    @Expose
    private Integer driverId;
    @SerializedName("vehicleId")
    @Expose
    private Integer vehicleId;
    @SerializedName("vehicle")
    @Expose
    private Vehicle vehicle;
    @SerializedName("tripPlanStss")
    @Expose
    private List<TripPlanSts> tripPlanStss;
    @SerializedName("tripPlanLandfills")
    @Expose
    private List<TripPlanLandfill> tripPlanLandfills;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getDriverId() {
        return driverId;
    }

    public void setDriverId(Integer driverId) {
        this.driverId = driverId;
    }

    public Integer getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public List<TripPlanSts> getTripPlanStss() {
        return tripPlanStss;
    }

    public void setTripPlanStss(List<TripPlanSts> tripPlanStss) {
        this.tripPlanStss = tripPlanStss;
    }

    public List<TripPlanLandfill> getTripPlanLandfills() {
        return tripPlanLandfills;
    }

    public void setTripPlanLandfills(List<TripPlanLandfill> tripPlanLandfills) {
        this.tripPlanLandfills = tripPlanLandfills;
    }

}
  

 

