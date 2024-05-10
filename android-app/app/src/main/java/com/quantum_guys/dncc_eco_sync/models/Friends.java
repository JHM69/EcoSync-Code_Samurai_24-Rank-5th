package com.quantum_guys.dncc_eco_sync.models;

import java.util.List;

/**
 * Created by Jahangir .
 */

public class Friends extends UserId {

    int score;
    long type;
    private String id, name, username, institute, dept, image, email;
    private List<String> token_ids;

    public Friends() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public long getType() {
        return type;
    }

    public void setType(long type) {
        this.type = type;
    }

    public List<String> getToken_ids() {
        return token_ids;
    }

    public void setToken_ids(List<String> token_ids) {
        this.token_ids = token_ids;
    }
}