package com.quantum_guys.dncc_eco_sync.model;

import java.util.Date;

public class LocationData {

    Integer id;

    double lat;
    double lon;

    long timestamp;

    public LocationData(Integer id, double lat, double lon, long timestamp) {
        this.id = id;
        this.lat = lat;
        this.lon = lon;
        this.timestamp = timestamp;

    }

    public double getLat() {
        return lat;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public Integer getId() {
        return id;
    }




}
