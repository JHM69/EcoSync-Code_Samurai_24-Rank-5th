package com.quantum_guys.dncc_eco_sync.model;
import com.fasterxml.jackson.annotation.JsonProperty; 
public class Permission{
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
}
