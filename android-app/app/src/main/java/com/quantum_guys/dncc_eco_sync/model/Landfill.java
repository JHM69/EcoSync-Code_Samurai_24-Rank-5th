package com.quantum_guys.dncc_eco_sync.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Landfill {
    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("name")
    @Expose
    private String name;
    @SerializedName("capacity")
    @Expose
    private Integer capacity;
    @SerializedName("currentWasteVolume")
    @Expose
    private Integer currentWasteVolume;
    @SerializedName("startTime")
    @Expose
    private String startTime;
    @SerializedName("endTime")
    @Expose
    private String endTime;
    @SerializedName("gpsCoords")
    @Expose
    private String gpsCoords;
    @SerializedName("lat")
    @Expose
    private Double lat;
    @SerializedName("lon")
    @Expose
    private Double lon;
    @SerializedName("address")
    @Expose
    private String address;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getCurrentWasteVolume() {
        return currentWasteVolume;
    }

    public void setCurrentWasteVolume(Integer currentWasteVolume) {
        this.currentWasteVolume = currentWasteVolume;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getGpsCoords() {
        return gpsCoords;
    }

    public void setGpsCoords(String gpsCoords) {
        this.gpsCoords = gpsCoords;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

}