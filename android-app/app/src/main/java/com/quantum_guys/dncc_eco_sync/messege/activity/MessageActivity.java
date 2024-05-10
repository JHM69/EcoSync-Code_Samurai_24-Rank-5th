package com.quantum_guys.dncc_eco_sync.messege.activity;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.motion.widget.MotionLayout;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.database.annotations.NotNull;
import com.google.firebase.firestore.FirebaseFirestore;
import com.yalantis.ucrop.UCrop;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.messege.Adapter.MessageAdapter;
import com.quantum_guys.dncc_eco_sync.messege.model.Chat;
import com.quantum_guys.dncc_eco_sync.messege.model.Chatlist;
import com.quantum_guys.dncc_eco_sync.models.Notification;
import com.quantum_guys.dncc_eco_sync.models.Users;
import com.quantum_guys.dncc_eco_sync.notification.APIService;
import com.quantum_guys.dncc_eco_sync.notification.Client;
import com.quantum_guys.dncc_eco_sync.notification.MyResponse;
import com.quantum_guys.dncc_eco_sync.notification.NotificationSender;
import com.quantum_guys.dncc_eco_sync.service.UploadService;
import com.quantum_guys.dncc_eco_sync.ui.activities.friends.FriendProfile;
import com.quantum_guys.dncc_eco_sync.ui.activities.quiz.SelectTopic;
import com.quantum_guys.dncc_eco_sync.viewmodel.MessageViewModel;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.io.File;
import java.util.HashMap;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class MessageActivity extends AppCompatActivity {

    CircleImageView profile_image;
    TextView username;
    MessageViewModel messageViewModel;
    String fuser;
    DatabaseReference reference;

    FirebaseFirestore firestore;
    ImageView btn_send, btn_photo;
    EditText text_send;

    MessageAdapter messageAdapter;
    //  List<Chat> mchat;

    RecyclerView recyclerView;

    Intent intent;

    ValueEventListener seenListener;

    String userid;


    boolean notifable = false;
    UserViewModel viewModel;
    Users me;
    private TextView userTime;

    @SuppressLint("UseCompatLoadingForDrawables")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SharedPreferences sharedPreferences = getSharedPreferences("Theme", Context.MODE_PRIVATE);
        String themeName = sharedPreferences.getString("ThemeName", "Default");
        if (themeName.equalsIgnoreCase("TealTheme")) {
            setTheme(R.style.TealTheme);
        } else if (themeName.equalsIgnoreCase("VioleteTheme")) {
            setTheme(R.style.VioleteTheme);
        } else if (themeName.equalsIgnoreCase("PinkTheme")) {
            setTheme(R.style.PinkTheme);
        } else if (themeName.equalsIgnoreCase("DelRio")) {
            setTheme(R.style.DelRio);
        } else if (themeName.equalsIgnoreCase("DarkTheme")) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            setTheme(R.style.Dark);
        } else if (themeName.equalsIgnoreCase("Lynch")) {
            setTheme(R.style.Lynch);
        } else {
            setTheme(R.style.AppTheme);
        }

        setContentView(R.layout.activity_message);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        Objects.requireNonNull(getSupportActionBar()).setTitle("");
        firestore = FirebaseFirestore.getInstance();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        toolbar.setNavigationOnClickListener(view -> finish());

        messageViewModel = ViewModelProviders.of(this).get(MessageViewModel.class);

        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setHasFixedSize(true);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getApplicationContext());
        linearLayoutManager.setStackFromEnd(true);
        recyclerView.setLayoutManager(linearLayoutManager);

        viewModel = ViewModelProviders.of(this).get(UserViewModel.class);
        profile_image = findViewById(R.id.profile_image);
        username = findViewById(R.id.username);
        userTime = findViewById(R.id.statusUpdate);
        btn_send = findViewById(R.id.btn_send);
        btn_photo = findViewById(R.id.btn_image);
        text_send = findViewById(R.id.text_send);

        intent = getIntent();
        userid = intent.getStringExtra("userid");
        String name = intent.getStringExtra("name");
        String image = intent.getStringExtra("image");

        fuser = userId;
        me = viewModel.getUser();
        upadeActiveNow(userid);

        MotionLayout motionLayout = findViewById(R.id.bottom);
        btn_photo.setOnClickListener(view -> {
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            startActivityForResult(Intent.createChooser(intent, "Select Picture"), 69);
        });
        text_send.addTextChangedListener(new TextWatcher() {
            @Override
            public void afterTextChanged(Editable s) {
            }

            @Override
            public void beforeTextChanged(CharSequence s, int start,
                                          int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start,
                                      int before, int count) {
                if (s.length() != 0) {
                    motionLayout.transitionToEnd();
                } else {
                    motionLayout.transitionToStart();
                }
            }
        });


        btn_send.setOnClickListener(view -> {
            String msg = text_send.getText().toString();
            if (!"".equals(msg)) {
                sendMessage(fuser, userid, msg);
            } else {
                Toast.makeText(MessageActivity.this, "You can't send empty message", Toast.LENGTH_SHORT).show();
            }
            text_send.setText("");
        });


        //reference = FirebaseDatabase.getInstance().getReference("Users").child(userid);
        try {
            username.setText(name);
            if (Objects.equals(image, "")) {
                profile_image.setImageResource(R.drawable.ic_logo);
            } else {
                try {
                    Glide.with(getApplicationContext()).load(image).placeholder(R.drawable.ic_logo).into(profile_image);
                } catch (ArrayIndexOutOfBoundsException ignored) {
                    profile_image.setImageDrawable(getResources().getDrawable(R.drawable.ic_logo));
                }
            }
            readMesagges(fuser, userid, image);
        } catch (NullPointerException ignored) {

        }

        seenMessage(userid);
    }

    @SuppressLint("SetTextI18n")
    private void upadeActiveNow(String userid) {
        try {
            firestore.collection("Users")
                    .document(userid)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        try {
                            long timestamp = documentSnapshot.getLong("lastTimestamp");
                            userTime.setText(TimeAgo.using(timestamp));
                            notifable = System.currentTimeMillis() - timestamp >= (1000 * 60 * 4) && !userTime.getText().equals("just now");
                        } catch (NullPointerException ignored) {
                            userTime.setText("not yet installed this app");
                        }

                    });

            HashMap<String, Object> hashMap = new HashMap<>();
            hashMap.put("lastTimestamp", System.currentTimeMillis());
            firestore.collection("Users").document(fuser).update(hashMap);

        } catch (NullPointerException ignored) {

        }

    }

    private void seenMessage(final String userid) {
        reference = FirebaseDatabase.getInstance().getReference("Chats");
        seenListener = reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Chat chat = snapshot.getValue(Chat.class);
                    if (Objects.requireNonNull(chat).getReceiver().equals(fuser) && chat.getSender().equals(userid)) {
                        HashMap<String, Object> hashMap = new HashMap<>();
                        hashMap.put("isseen", true);
                        snapshot.getRef().updateChildren(hashMap);
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {

            }
        });
    }

    public void sendMessage(String sender, final String receiver, String message) {

        DatabaseReference reference = FirebaseDatabase.getInstance().getReference();
        Chat chat = new Chat(sender, receiver, message, false, System.currentTimeMillis());
        reference.child("Chats").push().setValue(chat);
        messageViewModel.insertMessage(chat);

        // add user to chat fragment
        final DatabaseReference chatRef = FirebaseDatabase.getInstance().getReference("Chatlist")
                .child(fuser)
                .child(userid);
//Me
        String mess = message;
        if (mess.length() > 17) {
            mess = "You: " + message.substring(0, 17) + "...";
        } else {
            mess = "You: " + message;
        }

        Chatlist chatlist = new Chatlist(userid, mess, System.currentTimeMillis());
        chatlist.setId(userid);


        chatRef.setValue(chatlist);


        final DatabaseReference chatRefReceiver = FirebaseDatabase.getInstance().getReference("Chatlist")
                .child(userid)
                .child(fuser);
        chatlist.setId(fuser);

        chatlist.setLastMessage(mess.replace("You: ", ""));

        chatRefReceiver.setValue(chatlist);
        upadeActiveNow(userid);
        if (notifable) {
            Notification notificationData = new Notification(me.getId(), userid, me.getName(), me.getImage(), message, String.valueOf(System.currentTimeMillis()), "chat", userid, false);
            new SendNotificationAsyncTask(notificationData).execute();
        }

    }


    private void readMesagges(final String myid, final String userid, final String imageurl) {

        reference = FirebaseDatabase.getInstance().getReference("Chats");
        reference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                // mchat.clear();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Chat chat = snapshot.getValue(Chat.class);
                    if (Objects.requireNonNull(chat).getReceiver().equals(myid) && chat.getSender().equals(userid) ||
                            chat.getReceiver().equals(userid) && chat.getSender().equals(myid)) {
                        messageViewModel.insertMessage(chat);
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {

            }
        });
        messageViewModel.getAllChats(userid).observe(this, chats -> {
            messageAdapter = new MessageAdapter(MessageActivity.this, chats);
            recyclerView.setAdapter(messageAdapter);
        });

        // mchat = new ArrayList<>();


    }


    private void currentUser(String userid) {
        SharedPreferences.Editor editor = getSharedPreferences("PREFS", MODE_PRIVATE).edit();
        editor.putString("currentuser", userid);
        editor.apply();
    }

    private void status() {
        reference = FirebaseDatabase.getInstance().getReference("Users").child(fuser);
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("timestamp", System.currentTimeMillis());
        reference.updateChildren(hashMap);
    }

    @Override
    protected void onResume() {
        super.onResume();
        currentUser(userid);
    }

    @Override
    protected void onPause() {
        super.onPause();
        reference.removeEventListener(seenListener);
        currentUser("none");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && requestCode == 69) {
            Uri imageUri = Objects.requireNonNull(data).getData();
            UCrop.Options options = new UCrop.Options();
            options.setCompressionFormat(Bitmap.CompressFormat.PNG);
            options.setCompressionQuality(35);
            options.setShowCropGrid(true);
            UCrop.of(Objects.requireNonNull(imageUri), Uri.fromFile(new File(this.getCacheDir(), "message" + System.currentTimeMillis() + ".png")))
                    .withOptions(options)
                    .start(this, 77);
        }
        if (resultCode == RESULT_OK && requestCode == 77) {
            Uri uri = UCrop.getOutput(Objects.requireNonNull(data));
            Intent intent = new Intent(MessageActivity.this, UploadService.class);
            intent.putExtra("userid", userid);
            intent.putExtra("fuser", fuser);
            intent.putExtra("image", uri);
            intent.setAction(UploadService.ACTION_START_FOREGROUND_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.play, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        if (item.getItemId() == R.id.play) {
            AlertDialog.Builder builder = new AlertDialog.Builder(MessageActivity.this);
            builder.setPositiveButton("Yes", (dialogInterface, i) -> playQuiz(userid)).setNegativeButton("No", (dialogInterface, i) -> {
            })
                    .setTitle("Play Quiz?")
                    .setTitle("Start Quiz with " + username.getText() + "?")
                    .show();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void playQuiz(String userid) {
        Intent goBattle = new Intent(getApplicationContext(), SelectTopic.class);
        goBattle.putExtra("otherUid", userid);
        startActivity(goBattle);
    }

    void call(String number) {
        Intent callIntent = new Intent(Intent.ACTION_CALL);
        callIntent.setData(Uri.parse("tel:" + number));
        startActivity(callIntent);
    }

    public void goProfile(View view) {
        startActivity(new Intent(getApplicationContext(), FriendProfile.class).putExtra("f_id", userid));
        //FriendProfile.startActivity(getApplicationContext(), userid);
    }

    private static class SendNotificationAsyncTask extends AsyncTask<Void, Void, Void> {
        final APIService apiService;
        Notification notificationData;
        String who;

        private SendNotificationAsyncTask(Notification notificationData) {
            this.notificationData = notificationData;
            this.who = notificationData.getNotifyTo();
            apiService = Client.getClient("https://fcm.googleapis.com/").create(APIService.class);
        }

        @Override
        protected Void doInBackground(Void... jk) {
            try {
                FirebaseDatabase.getInstance().getReference().child("Tokens").child(who).child("token").addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                        try {
                            String usertoken = dataSnapshot.getValue(String.class);
                            NotificationSender sender = new NotificationSender(notificationData, usertoken);
                            apiService.sendNotifcation(sender).enqueue(new Callback<MyResponse>() {
                                @Override
                                public void onResponse(@NonNull Call<MyResponse> call, @NonNull Response<MyResponse> response) {
                                }

                                @Override
                                public void onFailure(@NonNull Call<MyResponse> call, @NotNull Throwable t) {

                                }
                            });
                        } catch (NullPointerException ignored) {
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError databaseError) {

                    }
                });

            } catch (NullPointerException ignored) {

            }
            return null;
        }
    }

}
