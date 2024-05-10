package com.quantum_guys.dncc_eco_sync.notification;

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

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.messege.activity.MessageActivity;
import com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity;

import java.util.Objects;

@SuppressWarnings("RedundantSuppression")
@SuppressLint("MissingFirebaseInstanceTokenRefresh")
public class MyFireBaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        int icon = R.drawable.ic_logo_icon;
        String name = "ত্বারক";
        String type = remoteMessage.getData().get("type");
        String title = remoteMessage.getData().get("username");
        String message = remoteMessage.getData().get("message");

        String image = remoteMessage.getData().get("image");
        String notifyTo = remoteMessage.getData().get("notifyTo");


        switch (Objects.requireNonNull(type)) {
            case "like":
                name = "Lights";
                icon = (R.drawable.ic_batti);
                break;
            case "comment":
                name = "Comments";
                icon = (R.drawable.ic_comment_blue);
                break;
            case "friend_req":
                name = "Friend Requests";
                icon = (R.drawable.ic_person_add_yellow_24dp);
                break;
            case "accept_friend_req":
                name = "Accepted Notification";
                icon = (R.drawable.ic_person_green_24dp);
                break;
            case "play":
                name = "Invites to Play";
                break;
           case "chat":
                icon = (R.drawable.ic_question_answer_black_24dp);
                break;
            case "play_result":
                name = "Battle Results";
                icon = (R.drawable.ic_logo_icon);
                break;
            case "post":
                icon = (R.drawable.ic_image_post_black);
                break;
            default:
                icon = (R.drawable.ic_logo_icon);
                break;
        }

        showNotification(icon, title, message, type, name, type, notifyTo, image);
    }


    void showNotification(int icon, String title, String message, String id, String name, String type, String who, String img) {
        NotificationManager mNotificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(id,
                    name,
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("ত্বারক notifications. Add friends, Lighting posts, Playing battle quiz etc");
            mNotificationManager.createNotificationChannel(channel);
        }
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(getApplicationContext(), id)
                .setVibrate(new long[]{0, 100})
                .setPriority(Notification.PRIORITY_MAX)
                .setLights(Color.BLUE, 3000, 3000)
                .setAutoCancel(true)
                .setContentTitle(title)
                .setContentText(message)
                .setSmallIcon(icon)
                .setLargeIcon(BitmapFactory.decodeResource(this.getResources(), R.drawable.ic_logo));

        if(type.equals("chat")){
            Intent intent = new Intent(getApplicationContext(), MessageActivity.class);
            intent.putExtra("userid", who);
            intent.putExtra("name", title);
            intent.putExtra("image", img);
            PendingIntent pi = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            mBuilder.setContentIntent(pi);
            mNotificationManager.notify(0, mBuilder.build());
        }

        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        mBuilder.setContentIntent(pi);
        mNotificationManager.notify(0, mBuilder.build());
    }


}
