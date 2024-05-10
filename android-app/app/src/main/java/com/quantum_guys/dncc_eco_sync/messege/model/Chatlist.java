package com.quantum_guys.dncc_eco_sync.messege.model;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import com.google.firebase.database.annotations.NotNull;


@Entity
public class Chatlist {
    @PrimaryKey
    @NonNull
    public String id = null;
    public String lastMessage;
    public long lastTimestamp;

    @Ignore
    public Chatlist(@NotNull String id) {
        this.id = id;
    }

    @Ignore
    public Chatlist() {
    }

    public Chatlist(@NotNull String id, String lastMessage, long lastTimestamp) {
        this.id = id;
        this.lastMessage = lastMessage;
        this.lastTimestamp = lastTimestamp;
    }

    @NotNull
    public String getId() {
        return id;
    }

    public void setId(@NotNull String id) {
        this.id = id;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public long getLastTimestamp() {
        return lastTimestamp;
    }

    public void setLastTimestamp(long lastTimestamp) {
        this.lastTimestamp = lastTimestamp;
    }
}
