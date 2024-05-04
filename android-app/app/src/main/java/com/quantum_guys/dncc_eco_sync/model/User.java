package com.quantum_guys.dncc_eco_sync.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class User implements Serializable {
    private int id;
    private String email;
    private String name;
    private String password;
    private String image;
    private Date createdAt;
    private Date updatedAt;
    private Date lastLogin;
    private Date lastLogout;
    private int roleId;
    private boolean changedAdminPassword;
    private Role role;
    private String token;

    // Constructor
    public User(int id, String email, String name, String password, String image, Date createdAt, Date updatedAt,
                Date lastLogin, Date lastLogout, int roleId, boolean changedAdminPassword, Role role, String token) {
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

    // Getters and Setters
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Date getLastLogout() {
        return lastLogout;
    }

    public void setLastLogout(Date lastLogout) {
        this.lastLogout = lastLogout;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public boolean isChangedAdminPassword() {
        return changedAdminPassword;
    }

    public void setChangedAdminPassword(boolean changedAdminPassword) {
        this.changedAdminPassword = changedAdminPassword;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

class Role {
    private int id;
    private String type;
    private List<Permission> permissions;

    public Role(int id, String type, List<Permission> permissions) {
        this.id = id;
        this.type = type;
        this.permissions = permissions;
    }
}

class Permission {
    private int id;
    private String name;

    public Permission(int id, String name) {
        this.id = id;
        this.name = name;
    }
}
