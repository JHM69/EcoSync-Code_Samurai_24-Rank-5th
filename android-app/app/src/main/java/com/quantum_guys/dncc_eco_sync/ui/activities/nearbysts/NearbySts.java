package com.quantum_guys.dncc_eco_sync.ui.activities.nearbysts;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;


public class NearbySts implements Serializable
{

@SerializedName("id")
@Expose
private Integer id;
@SerializedName("name")
@Expose
private String name;
@SerializedName("wardNumber")
@Expose
private String wardNumber;
@SerializedName("capacity")
@Expose
private Integer capacity;
@SerializedName("currentWasteVolume")
@Expose
private Integer currentWasteVolume;
@SerializedName("lat")
@Expose
private Double lat;
@SerializedName("lon")
@Expose
private Double lon;
@SerializedName("address")
@Expose
private String address;
@SerializedName("logo")
@Expose
private String logo;
@SerializedName("fine")
@Expose
private Integer fine;
@SerializedName("startTime")
@Expose
private Integer startTime;
@SerializedName("endTime")
@Expose
private Integer endTime;
private final static long serialVersionUID = 4238233360176200559L;

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

public String getWardNumber() {
return wardNumber;
}

public void setWardNumber(String wardNumber) {
this.wardNumber = wardNumber;
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

public String getLogo() {
return logo;
}

public void setLogo(String logo) {
this.logo = logo;
}

public Integer getFine() {
return fine;
}

public void setFine(Integer fine) {
this.fine = fine;
}

public Integer getStartTime() {
return startTime;
}

public void setStartTime(Integer startTime) {
this.startTime = startTime;
}

public Integer getEndTime() {
return endTime;
}

public void setEndTime(Integer endTime) {
this.endTime = endTime;
}

}