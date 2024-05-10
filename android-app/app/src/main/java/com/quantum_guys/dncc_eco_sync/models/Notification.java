package com.quantum_guys.dncc_eco_sync.models;

public class Notification extends DocumentID {

    private String id, notifyTo, username, image, message, timestamp, type, action_id;
    private boolean read=true;

    public Notification() {
    }

    public Notification(String id, String notifyTo, String username, String image, String message, String timestamp, String type, String action_id, Boolean read) {
        this.id = id;
        this.notifyTo = notifyTo;
        this.username = username;
        this.image = image;
        this.message = message;
        this.timestamp = timestamp;
        this.type = type;
        this.action_id = action_id;
        this.read = read;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNotifyTo() {
        return notifyTo;
    }

    public void setNotifyTo(String notifyTo) {
        this.notifyTo = notifyTo;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAction_id() {
        return action_id;
    }

    public void setAction_id(String action_id) {
        this.action_id = action_id;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public long getTimeStamp() {
        return Long.parseLong(timestamp);
    }
}
