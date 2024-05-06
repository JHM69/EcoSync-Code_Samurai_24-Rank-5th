package com.quantum_guys.dncc_eco_sync.model;

import androidx.room.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class User {
    String token;
    Role role;
    boolean changedAdminPassword;
    int roleId;
    Date lastLogout;
    Date lastLogin;
    Date updatedAt;
    Date createdAt;
    String image;
    String password;
    String name;
    int id;
    String email;

    public User(int id, String email, String name, String password, String image, Date createdAt, Date updatedAt, Date lastLogin, Date lastLogout, int roleId, boolean changedAdminPassword, Role role, String token) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.image = image;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastLogin = lastLogin;
        this.lastLogout = lastLogout;
        this.roleId = roleId;
        this.changedAdminPassword = changedAdminPassword;
        this.role = role;
        this.token = token;
    }

    public User() {
    }

    @JsonProperty("id")
    public int getId() {
        return this.id;
    }

    public void setId(int id) {
        this.id = id;
    }


    @JsonProperty("email")
    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    @JsonProperty("name")
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }



    @JsonProperty("password")
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }



    @JsonProperty("image")
    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }



    @JsonProperty("createdAt")
    public Date getCreatedAt() {
        return this.createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }



    @JsonProperty("updatedAt")
    public Date getUpdatedAt() {
        return this.updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }



    @JsonProperty("lastLogin")
    public Date getLastLogin() {
        return this.lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }



    @JsonProperty("lastLogout")
    public Date getLastLogout() {
        return this.lastLogout;
    }

    public void setLastLogout(Date lastLogout) {
        this.lastLogout = lastLogout;
    }



    @JsonProperty("roleId")
    public int getRoleId() {
        return this.roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }



    @JsonProperty("changedAdminPassword")
    public boolean getChangedAdminPassword() {
        return this.changedAdminPassword;
    }

    public void setChangedAdminPassword(boolean changedAdminPassword) {
        this.changedAdminPassword = changedAdminPassword;
    }



    @JsonProperty("role")
    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }



    @JsonProperty("token")
    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }


}
