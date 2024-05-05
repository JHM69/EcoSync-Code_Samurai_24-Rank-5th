package com.quantum_guys.dncc_eco_sync.model;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
public class Role{
    @JsonProperty("id") 
    public int getId() { 
		 return this.id; } 
    public void setId(int id) { 
		 this.id = id; } 
    int id;
    @JsonProperty("type") 
    public String getType() { 
		 return this.type; } 
    public void setType(String type) { 
		 this.type = type; } 
    String type;
    @JsonProperty("permissions") 
    public ArrayList<Permission> getPermissions() {
		 return this.permissions; } 
    public void setPermissions(ArrayList<Permission> permissions) { 
		 this.permissions = permissions; } 
    ArrayList<Permission> permissions;
}
