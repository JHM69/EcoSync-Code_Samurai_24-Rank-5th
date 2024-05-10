package com.quantum_guys.dncc_eco_sync.models;

public class Issue extends Post{

    String states = "Pending"; // Pending, Resolved, Processing
    String issueType;  //

    boolean isAnonymous;

    float lat, lon;
    String address;



    public Issue() {
    }

    public Issue(String postId, String userId, String name, String timestamp, String likes, String favourites, String description, String username, String institute, String dept, String userimage, int image_count, String image_url_0, String image_url_1, String image_url_2, String image_url_3, String image_url_4, String image_url_5, String image_url_6, int liked_count, int comment_count, String states, String issueType, boolean isAnonymous, float lat, float lon, String address) {
        super(postId, userId, name, timestamp, likes, favourites, description, username, institute, dept, userimage, image_count, image_url_0, image_url_1, image_url_2, image_url_3, image_url_4, image_url_5, image_url_6, liked_count, comment_count);
        this.states = states;
        this.issueType = issueType;
        this.isAnonymous = isAnonymous;
        this.lat = lat;
        this.lon = lon;
        this.address = address;
    }

    public String getStates() {
        return states;
    }

    public void setStates(String states) {
        this.states = states;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
