package com.quantum_guys.dncc_eco_sync.messege.model;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import java.io.Serializable;

@Entity
public class Chat implements Serializable {
    private String sender;
    private String receiver;
    private String message;
    private String image;
    @PrimaryKey
    private long timestamp;
    private boolean isseen;


    @Ignore
    public Chat(String sender, String receiver, String message, boolean isseen, long timestamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.isseen = isseen;
        this.timestamp = timestamp;
    }



    public Chat(String sender, String receiver, String message, String image, boolean isseen, long timestamp) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
        this.image = image;
        this.isseen = isseen;
        this.timestamp = timestamp;
    }

    @Ignore
    public Chat() {
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isIsseen() {
        return isseen;
    }

    public void setIsseen(boolean isseen) {
        this.isseen = isseen;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }


}
