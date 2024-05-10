package com.quantum_guys.dncc_eco_sync.ui.activities.quiz;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.transition.Explode;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.SubTopicAdapter;
import com.quantum_guys.dncc_eco_sync.models.SubTopicModel;

import java.util.ArrayList;
import java.util.List;

public class SubTopic extends AppCompatActivity {
    final List<SubTopicModel> subTopics = new ArrayList<>();
    String topic, otherUid, type;
    private RecyclerView recyclerView;
    private RecyclerView.LayoutManager layoutManager;
    private SubTopicAdapter capterAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);
        getWindow().setEnterTransition(new Explode());
        getWindow().setExitTransition(new Explode());

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
        setContentView(R.layout.activity_all_parent_topic);
        ProgressBar loading = findViewById(R.id.progressBar2);
        topic = getIntent().getStringExtra("topic");
        type = getIntent().getStringExtra("type");
        otherUid = getIntent().getStringExtra("otherUid");
        recyclerView = findViewById(R.id.rcv);

        GridLayoutManager gridLayoutManager = new GridLayoutManager(this, 2);
        recyclerView.setLayoutManager(gridLayoutManager);
        recyclerView.setAdapter(capterAdapter);
        recyclerView.setHasFixedSize(true);
        Log.d("Typee-SubTopic", type);
        FirebaseDatabase.getInstance().getReference().child("Topics").child(type).child(topic).child("all_totpics").addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                SubTopicModel subTopic = snapshot.getValue(SubTopicModel.class);
                subTopics.add(subTopic);
                capterAdapter = new SubTopicAdapter(subTopics, topic, SubTopic.this, otherUid, type);
                recyclerView.setAdapter(capterAdapter);
                capterAdapter.notifyDataSetChanged();
                loading.setVisibility(View.GONE);
            }

            @Override
            public void onChildChanged(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {

            }

            @Override
            public void onChildRemoved(@NonNull DataSnapshot snapshot) {

            }

            @Override
            public void onChildMoved(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {

            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }


}
