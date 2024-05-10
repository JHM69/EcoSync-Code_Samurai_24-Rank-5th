package com.quantum_guys.dncc_eco_sync.models;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import java.io.Serializable;

/**
 * Created by Jahangir .
 */
@SuppressWarnings("NotNullFieldNotInitialized")
@Entity
public class Users implements Serializable {
    @PrimaryKey()
    @NonNull
    String id;
    long score, lastTimestamp, win, lose, draw, reward, type, lat, lon;
    private String name, image, institute, dept, email, bio, username, location, ward, gender, address, number;



    @Ignore
    public Users() {
    }
    @Ignore
    public Users(@NonNull String id, long score, long lastTimestamp, long win, long lose, long draw, long reward, long type, String name, String image, String institute, String dept, String email, String bio, String username, String location) {
        this.id = id;
        this.score = score;
        this.lastTimestamp = lastTimestamp;
        this.win = win;
        this.lose = lose;
        this.draw = draw;
        this.reward = reward;
        this.type = type;
        this.name = name;
        this.image = image;
        this.institute = institute;
        this.dept = dept;
        this.email = email;
        this.bio = bio;
        this.username = username;
        this.location = location;
    }


    public Users(@NonNull String id, long score, long lastTimestamp, long win, long lose, long draw, long reward, long type, long lat, long lon, String name, String image, String institute, String dept, String email, String bio, String username, String location, String ward, String gender, String address, String number) {
        this.id = id;
        this.score = score;
        this.lastTimestamp = lastTimestamp;
        this.win = win;
        this.lose = lose;
        this.draw = draw;
        this.reward = reward;
        this.type = type;
        this.lat = lat;
        this.lon = lon;
        this.name = name;
        this.image = image;
        this.institute = institute;
        this.dept = dept;
        this.email = email;
        this.bio = bio;
        this.username = username;
        this.location = location;
        this.ward = ward;
        this.gender = gender;
        this.address = address;
        this.number = number;
    }

    @NonNull
    public String getId() {
        return id;
    }

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public long getScore() {
        return score;
    }

    public void setScore(long score) {
        this.score = score;
    }

    public long getLastTimestamp() {
        return lastTimestamp;
    }

    public void setLastTimestamp(long lastTimestamp) {
        this.lastTimestamp = lastTimestamp;
    }

    public long getWin() {
        return win;
    }

    public void setWin(long win) {
        this.win = win;
    }

    public long getLose() {
        return lose;
    }

    public void setLose(long lose) {
        this.lose = lose;
    }

    public long getDraw() {
        return draw;
    }

    public void setDraw(long draw) {
        this.draw = draw;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public long getReward() {
        return reward;
    }

    public void setReward(long reward) {
        this.reward = reward;
    }

    public long getType() {
        return type;
    }

    public void setType(long type) {
        this.type = type;
    }


    public long getLat() {
        return lat;
    }

    public void setLat(long lat) {
        this.lat = lat;
    }

    public long getLon() {
        return lon;
    }

    public void setLon(long lon) {
        this.lon = lon;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
