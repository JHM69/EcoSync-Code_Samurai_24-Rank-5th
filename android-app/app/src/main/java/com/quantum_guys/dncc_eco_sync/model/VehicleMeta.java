package com.quantum_guys.dncc_eco_sync.model;

import java.io.Serializable;
import java.util.Date;

public class VehicleMeta implements Serializable {

    Integer id;


    Integer tripId;


    float lat;


    float lon;


    Trip trip;


    float weight;


    Date timestamp;


    public VehicleMeta(Integer id, Integer tripId, float lat, float lon, Trip trip, float weight, Date timestamp) {
        this.id = id;
        this.tripId = tripId;
        this.lat = lat;
        this.lon = lon;
        this.trip = trip;
        this.weight = weight;
        this.timestamp = timestamp;
    }

    public VehicleMeta() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTripId() {
        return tripId;
    }

    public void setTripId(Integer tripId) {
        this.tripId = tripId;
    }

    public float getLat() {
        return lat;
    }

    public void setLat(float lat) {
        this.lat = lat;
    }

    public float getLon() {
        return lon;
    }

    public void setLon(float lon) {
        this.lon = lon;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}
