package com.quantum_guys.dncc_eco_sync.notification;

import com.quantum_guys.dncc_eco_sync.models.Notification;

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
