package com.quantum_guys.dncc_eco_sync.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Date;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class User implements Serializable {
    @SerializedName("token")
    @Expose
    @JsonProperty("token")
    String token;

    @SerializedName("image")
    @Expose
    @JsonProperty("image")
    String image;

    @SerializedName("password")
    @Expose
    @JsonProperty("password")
    String password;

    @SerializedName("name")
    @Expose
    @JsonProperty("name")
    String name;


    @SerializedName("id")
    @Expose
    @JsonProperty("id")
    int id;


    @SerializedName("email")
    @Expose
    @JsonProperty("email")
    String email;


    @SerializedName("faceVerificationAdded")
    @Expose
    @JsonProperty("faceVerificationAdded")
    boolean faceVerificationAdded;


    @SerializedName("faceData")
    @Expose
    @JsonProperty("faceData")
    String faceData;


    @SerializedName("changedAdminPassword")
    @Expose
    @JsonProperty("changedAdminPassword")
    boolean changedAdminPassword;


    @SerializedName("roleId")
    @Expose
    @JsonProperty("roleId")
    int roleId;


    @SerializedName("lastLogout")
    @Expose
    @JsonProperty("lastLogout")
    Date lastLogout;


    @SerializedName("lastLogin")
    @Expose
    @JsonProperty("lastLogin")
    Date lastLogin;


    @SerializedName("updatedAt")
    @Expose
    @JsonProperty("updatedAt")
    Date updatedAt;


    @SerializedName("createdAt")
    @Expose
    @JsonProperty("createdAt")
    Date createdAt;


    public User(String token, String image, String password, String name, int id, String email, boolean faceVerificationAdded, String faceData, boolean changedAdminPassword, int roleId, Date lastLogout, Date lastLogin, Date updatedAt, Date createdAt) {
        this.token = token;
        this.image = image;
        this.password = password;
        this.name = name;
        this.id = id;
        this.email = email;
        this.faceVerificationAdded = faceVerificationAdded;
        this.faceData = faceData;
        this.changedAdminPassword = changedAdminPassword;
        this.roleId = roleId;
        this.lastLogout = lastLogout;
        this.lastLogin = lastLogin;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    public User() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isChangedAdminPassword() {
        return changedAdminPassword;
    }

    public void setChangedAdminPassword(boolean changedAdminPassword) {
        this.changedAdminPassword = changedAdminPassword;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public Date getLastLogout() {
        return lastLogout;
    }

    public void setLastLogout(Date lastLogout) {
        this.lastLogout = lastLogout;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isFaceVerificationAdded() {
        return faceVerificationAdded;
    }

    public void setFaceVerificationAdded(boolean faceVerificationAdded) {
        this.faceVerificationAdded = faceVerificationAdded;
    }

    public String getFaceData() {
        return faceData;
    }

    public void setFaceData(String faceData) {
        this.faceData = faceData;
    }
}


