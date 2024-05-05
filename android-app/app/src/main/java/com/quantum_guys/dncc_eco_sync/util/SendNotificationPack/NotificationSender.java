package com.quantum_guys.dncc_eco_sync.util.SendNotificationPack;


import com.quantum_guys.dncc_eco_sync.model.Notification;

public class NotificationSender {
    public Notification data;
    public String to;

    public NotificationSender(Notification data, String to) {
        this.data = data;
        this.to = to;
    }

    public NotificationSender() {
    }
}
