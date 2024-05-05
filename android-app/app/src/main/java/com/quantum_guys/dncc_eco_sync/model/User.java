package com.quantum_guys.dncc_eco_sync.model;
import androidx.room.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class User{
    @JsonProperty("id") 
    public int getId() { 
		 return this.id; } 
    public void setId(int id) { 
		 this.id = id; } 
    int id;
    @JsonProperty("email") 
    public String getEmail() { 
		 return this.email; } 
    public void setEmail(String email) { 
		 this.email = email; } 
    String email;
    @JsonProperty("name") 
    public String getName() { 
		 return this.name; } 
    public void setName(String name) { 
		 this.name = name; } 
    String name;
    @JsonProperty("password") 
    public String getPassword() { 
		 return this.password; } 
    public void setPassword(String password) { 
		 this.password = password; } 
    String password;
    @JsonProperty("image") 
    public String getImage() { 
		 return this.image; } 
    public void setImage(String image) { 
		 this.image = image; } 
    String image;
    @JsonProperty("createdAt") 
    public Date getCreatedAt() {
		 return this.createdAt; } 
    public void setCreatedAt(Date createdAt) { 
		 this.createdAt = createdAt; } 
    Date createdAt;
    @JsonProperty("updatedAt") 
    public Date getUpdatedAt() { 
		 return this.updatedAt; } 
    public void setUpdatedAt(Date updatedAt) { 
		 this.updatedAt = updatedAt; } 
    Date updatedAt;
    @JsonProperty("lastLogin") 
    public Date getLastLogin() { 
		 return this.lastLogin; } 
    public void setLastLogin(Date lastLogin) { 
		 this.lastLogin = lastLogin; } 
    Date lastLogin;
    @JsonProperty("lastLogout") 
    public Date getLastLogout() { 
		 return this.lastLogout; } 
    public void setLastLogout(Date lastLogout) { 
		 this.lastLogout = lastLogout; } 
    Date lastLogout;
    @JsonProperty("roleId") 
    public int getRoleId() { 
		 return this.roleId; } 
    public void setRoleId(int roleId) { 
		 this.roleId = roleId; } 
    int roleId;
    @JsonProperty("changedAdminPassword") 
    public boolean getChangedAdminPassword() { 
		 return this.changedAdminPassword; } 
    public void setChangedAdminPassword(boolean changedAdminPassword) { 
		 this.changedAdminPassword = changedAdminPassword; } 
    boolean changedAdminPassword;
    @JsonProperty("role") 
    public Role getRole() { 
		 return this.role; } 
    public void setRole(Role role) { 
		 this.role = role; } 
    Role role;
    @JsonProperty("token") 
    public String getToken() { 
		 return this.token; } 
    public void setToken(String token) { 
		 this.token = token; } 
    String token;
}
