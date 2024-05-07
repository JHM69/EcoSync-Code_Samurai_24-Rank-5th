package com.quantum_guys.dncc_eco_sync.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.ArrayList;

public class Landfill implements Serializable {
    @JsonProperty("id")
    public int getId() {
        return this.id; }
    public void setId(int id) {
        this.id = id; }
    int id;
    @JsonProperty("name")
    public String getName() {
        return this.name; }
    public void setName(String name) {
        this.name = name; }
    String name;
    @JsonProperty("capacity")
    public int getCapacity() {
        return this.capacity; }
    public void setCapacity(int capacity) {
        this.capacity = capacity; }
    int capacity;
    @JsonProperty("currentWasteVolume")
    public int getCurrentWasteVolume() {
        return this.currentWasteVolume; }
    public void setCurrentWasteVolume(int currentWasteVolume) {
        this.currentWasteVolume = currentWasteVolume; }
    int currentWasteVolume;
    @JsonProperty("startTime")
    public String getStartTime() {
        return this.startTime; }
    public void setStartTime(String startTime) {
        this.startTime = startTime; }
    String startTime;
    @JsonProperty("endTime")
    public String getEndTime() {
        return this.endTime; }
    public void setEndTime(String endTime) {
        this.endTime = endTime; }
    String endTime;
    @JsonProperty("gpsCoords")
    public String getGpsCoords() {
        return this.gpsCoords; }
    public void setGpsCoords(String gpsCoords) {
        this.gpsCoords = gpsCoords; }
    String gpsCoords;
    @JsonProperty("lat")
    public double getLat() {
        return this.lat; }
    public void setLat(double lat) {
        this.lat = lat; }
    double lat;
    @JsonProperty("lon")
    public double getLon() {
        return this.lon; }
    public void setLon(double lon) {
        this.lon = lon; }
    double lon;
    @JsonProperty("address")
    public String getAddress() {
        return this.address; }
    public void setAddress(String address) {
        this.address = address; }
    String address;
    @JsonProperty("managers")
    public ArrayList<User> getManagers() {
        return this.managers; }
    public void setManagers(ArrayList<User> managers) {
        this.managers = managers; }
    ArrayList<User> managers;
}
