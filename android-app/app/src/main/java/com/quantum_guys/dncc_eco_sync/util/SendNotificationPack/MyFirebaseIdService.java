package com.quantum_guys.dncc_eco_sync.util.SendNotificationPack;

import androidx.annotation.NonNull;


import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.messaging.FirebaseMessagingService;

import java.util.Objects;

public class MyFirebaseIdService extends FirebaseMessagingService {

    @Override
    public void onNewToken(@NonNull String s) {
        super.onNewToken(s);

        String refreshToken = FirebaseInstanceId.getInstance().getToken();
//        if (firebaseUser != null) {
//            updateToken(refreshToken);
//        }
    }

//    private void updateToken(String refreshToken) {
//        Token token1 = new Token(refreshToken);
//        FirebaseDatabase.getInstance().getReference("Tokens").child(Objects.requireNonNull(FirebaseAuth.getInstance().getCurrentUser()).getUid()).setValue(token1);
//    }
}
