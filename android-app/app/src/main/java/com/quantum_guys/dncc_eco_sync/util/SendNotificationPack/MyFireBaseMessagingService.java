package com.quantum_guys.dncc_eco_sync.util.SendNotificationPack;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.quantum_guys.dncc_eco_sync.MainActivity;
import com.quantum_guys.dncc_eco_sync.R;

import java.util.Objects;

@SuppressLint("MissingFirebaseInstanceTokenRefresh")
public class MyFireBaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        String title = "";
        String id = remoteMessage.getData().get("id");
        String message = remoteMessage.getData().get("message");
        String name = remoteMessage.getData().get("name");
        int type = Integer.parseInt(Objects.requireNonNull(remoteMessage.getData().get("id")));
        String busId = remoteMessage.getData().get("busId");
        /*String driverId = remoteMessage.getData().get("driverId");
        String routeId = remoteMessage.getData().get("routeId");
        String tripId = remoteMessage.getData().get("tripId");
        String extra = remoteMessage.getData().get("extra");
        long timestamp = Long.parseLong(Objects.requireNonNull(remoteMessage.getData().get("timestamp")));*/

        if (type == 1) {
            title = "Driver Id: " + name + ", Bus No: " + busId;
        }

        showNotification(title, message, name, id);
    }

    void showNotification(String title, String message, String name, String id) {
        NotificationManager mNotificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel("go",
                    name,
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Authority Notification");
            mNotificationManager.createNotificationChannel(channel);
        }
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(getApplicationContext(), "go")
                .setVibrate(new long[]{0, 100})
                .setPriority(Notification.PRIORITY_MAX)
                .setLights(Color.BLUE, 3000, 3000)
                .setAutoCancel(false)
                .setContentTitle(title)
                .setSmallIcon(R.drawable.logo_round)
                .setContentText(message)
                .setLargeIcon(BitmapFactory.decodeResource(this.getResources(), R.drawable.logo));

        Intent intent = new Intent(getApplicationContext(), MainActivity.class);

        PendingIntent pi = PendingIntent.getActivity(getApplicationContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        mBuilder.setContentIntent(pi);
        mNotificationManager.notify(0, mBuilder.build());

            /*GlideApp.with(getApplicationContext())
                    .asBitmap()
                    .load(image)
                    .into(new CustomTarget<Bitmap>() {
                        @Override
                        public void onResourceReady(@NonNull Bitmap resource, @Nullable Transition<? super Bitmap> transition) {
                            mBuilder.setLargeIcon(resource);
                            mBuilder.setStyle(new NotificationCompat.BigPictureStyle().bigPicture(resource));
                            Intent intent = new Intent(getApplicationContext(), NoticeDetailsActivity.class).putExtra("post", postId);
                            PendingIntent pi = PendingIntent.getActivity(getApplicationContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
                            mBuilder.setContentIntent(pi);
                            mNotificationManager.notify(0, mBuilder.build());
                        }

                        @Override
                        public void onLoadCleared(@Nullable Drawable placeholder) {
                        }

                        @Override
                        public void onLoadFailed(@Nullable Drawable errorDrawable) {
                            super.onLoadFailed(errorDrawable);
                        }
                    });*/
    }


}
