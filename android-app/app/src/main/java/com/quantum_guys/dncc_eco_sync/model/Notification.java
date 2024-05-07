package com.quantum_guys.dncc_eco_sync.model;import java.io.Serializable;public class Notification implements Serializable {    private String id;    private String message;    private String name;    private int type;    private String driverId, stsId, truckId, tripId;    private long timeStamp;    String extra;    public Notification() {    }    public Notification(String id, String message, String name, int type, String driverId, String stsId, String truckId, String tripId, long timeStamp, String extra) {        this.id = id;        this.message = message;        this.name = name;        this.type = type;        this.driverId = driverId;        this.stsId = stsId;        this.truckId = truckId;        this.tripId = tripId;        this.timeStamp = timeStamp;        this.extra = extra;    }    public String getId() {        return id;    }    public void setId(String id) {        this.id = id;    }    public String getMessage() {        return message;    }    public void setMessage(String message) {        this.message = message;    }    public int getType() {        return type;    }    public void setType(int type) {        this.type = type;    }    public String getExtra() {        return extra;    }    public void setExtra(String extra) {        this.extra = extra;    }    public String getDriverId() {        return driverId;    }    public void setDriverId(String driverId) {        this.driverId = driverId;    }    public String getStsId() {        return stsId;    }    public void setStsId(String stsId) {        this.stsId = stsId;    }    public String getTruckId() {        return truckId;    }    public void setTruckId(String truckId) {        this.truckId = truckId;    }    public String getTripId() {        return tripId;    }    public void setTripId(String tripId) {        this.tripId = tripId;    }    public long getTimeStamp() {        return timeStamp;    }    public void setTimeStamp(long timeStamp) {        this.timeStamp = timeStamp;    }    public String getName() {        return name;    }    public void setName(String name) {        this.name = name;    }}