package com.quantum_guys.dncc_eco_sync.models;

import androidx.annotation.NonNull;

/**
 * Created by Jahangir .
 */

public class UserId {
    public String userId;

    @SuppressWarnings("unchecked")
    public <T extends UserId> T withId(@NonNull final String id) {
        this.userId = id;
        return (T) this;
    }

}
