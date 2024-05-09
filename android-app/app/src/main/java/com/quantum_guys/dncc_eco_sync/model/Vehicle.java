package com.quantum_guys.dncc_eco_sync.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
public class Vehicle {

    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("registrationNumber")
    @Expose
    private String registrationNumber;
    @SerializedName("type")
    @Expose
    private String type;
    @SerializedName("name")
    @Expose
    private Object name;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("capacity")
    @Expose
    private Integer capacity;
    @SerializedName("remainingCapacity")
    @Expose
    private Integer remainingCapacity;
    @SerializedName("lat")
    @Expose
    private Double lat;
    @SerializedName("lon")
    @Expose
    private Double lon;
    @SerializedName("isFull")
    @Expose
    private Boolean isFull;
    @SerializedName("loaddedFuelCost")
    @Expose
    private Integer loaddedFuelCost;
    @SerializedName("unloadedFuelCost")
    @Expose
    private Integer unloadedFuelCost;
    @SerializedName("stsId")
    @Expose
    private Object stsId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getName() {
        return name;
    }

    public void setName(Object name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getRemainingCapacity() {
        return remainingCapacity;
    }

    public void setRemainingCapacity(Integer remainingCapacity) {
        this.remainingCapacity = remainingCapacity;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }

    public Boolean getIsFull() {
        return isFull;
    }

    public void setIsFull(Boolean isFull) {
        this.isFull = isFull;
    }

    public Integer getLoaddedFuelCost() {
        return loaddedFuelCost;
    }

    public void setLoaddedFuelCost(Integer loaddedFuelCost) {
        this.loaddedFuelCost = loaddedFuelCost;
    }

    public Integer getUnloadedFuelCost() {
        return unloadedFuelCost;
    }

    public void setUnloadedFuelCost(Integer unloadedFuelCost) {
        this.unloadedFuelCost = unloadedFuelCost;
    }

    public Object getStsId() {
        return stsId;
    }

    public void setStsId(Object stsId) {
        this.stsId = stsId;
    }

}
