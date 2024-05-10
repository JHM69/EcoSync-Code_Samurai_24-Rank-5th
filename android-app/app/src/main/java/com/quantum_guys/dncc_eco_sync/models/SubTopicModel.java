package com.quantum_guys.dncc_eco_sync.models;

import java.io.Serializable;

public class SubTopicModel implements Serializable {
    public String name;
    public String id;

    public SubTopicModel(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public SubTopicModel() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
