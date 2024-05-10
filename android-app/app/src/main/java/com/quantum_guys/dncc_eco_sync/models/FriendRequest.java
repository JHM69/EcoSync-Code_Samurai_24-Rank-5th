package com.quantum_guys.dncc_eco_sync.models;

import java.util.List;

/**
 * Created by Jahangir on 11/3/18.
 */

public class FriendRequest extends UserId {

    private String id, username, institute, dept, name, email, image, timestamp;
    // token field no longer used
    private List<String> token_ids;

    public FriendRequest() {
    }

    public FriendRequest(String id, String username, String institute, String dept, String name, String email, String image, String timestamp, List<String> token_ids) {
        this.id = id;
        this.username = username;
        this.institute = institute;
        this.dept = dept;
        this.name = name;
        this.email = email;
        this.image = image;
        this.timestamp = timestamp;
        this.token_ids = token_ids;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getInstitute() {
        return institute;
    }

    public void setInstitute(String institute) {
        this.institute = institute;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public List<String> getToken_ids() {
        return token_ids;
    }

    public void setToken_ids(List<String> token_ids) {
        this.token_ids = token_ids;
    }
}