package com.quantum_guys.dncc_eco_sync.models;

public class Chapter {

    private String name, img;

    public Chapter(String name, String img) {
        this.name = name;
        this.img = img;
    }

    public Chapter() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
