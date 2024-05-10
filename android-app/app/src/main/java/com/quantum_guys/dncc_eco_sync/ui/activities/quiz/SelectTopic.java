package com.quantum_guys.dncc_eco_sync.ui.activities.quiz;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.FirebaseFirestore;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.TopicAdapter;
import com.quantum_guys.dncc_eco_sync.models.Friends;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import es.dmoral.toasty.Toasty;

public class SelectTopic extends AppCompatActivity {
    final List<String> topics = new ArrayList<>();
    long ty;
    private RecyclerView recyclerView;
    //  private RecyclerView.LayoutManager layoutManager;
    private TopicAdapter capterAdapter;
    private String otherUid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);

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
        recyclerView = findViewById(R.id.rcv);
        GridLayoutManager gridLayoutManager = new GridLayoutManager(this, 2);
        recyclerView.setLayoutManager(gridLayoutManager);
        recyclerView.setAdapter(capterAdapter);//set adapter to recyclerview
        //recyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
        //recyclerView.setLayoutManager(layoutManager);
        //layoutManager = new LinearLayoutManager(getApplicationContext());
        // toolbar.setBackgroundColor(ContextCompat.getColor(getApplicationContext(), R.color.colorAccentt));
        recyclerView.setHasFixedSize(true);


        otherUid = getIntent().getStringExtra("otherUid");
        ty = getIntent().getLongExtra("type", 99);
        if (ty == 99) {
            Toasty.info(this, "Wait some time...", Toast.LENGTH_SHORT).show();
            FirebaseFirestore firestore = FirebaseFirestore.getInstance();
            firestore.collection("Users").whereEqualTo("id", otherUid)
                    .get()
                    .addOnSuccessListener(queryDocumentSnapshots -> {
                        if (!queryDocumentSnapshots.getDocuments().isEmpty()) {
                            for (final DocumentChange doc : queryDocumentSnapshots.getDocumentChanges()) {
                                Friends friends = doc.getDocument().toObject(Friends.class).withId(Objects.requireNonNull(doc.getDocument().getString("id")));
                                ty = friends.getType();
                            }

                            String type = getType(ty);
                            Log.d("Typee-SelectTopic", type);
                            DatabaseReference itemsRef = FirebaseDatabase.getInstance().getReference().child("Topics").child(type);
                            ValueEventListener eventListener = new ValueEventListener() {
                                @Override
                                public void onDataChange(DataSnapshot dataSnapshot) {
                                    for (DataSnapshot ds : dataSnapshot.getChildren()) {
                                        String name = ds.getKey();
                                        topics.add(name);
                                        capterAdapter = new TopicAdapter(topics, SelectTopic.this, otherUid, type);
                                        recyclerView.setAdapter(capterAdapter);
                                        capterAdapter.notifyDataSetChanged();
                                        loading.setVisibility(View.GONE);
                                    }
                                }

                                @Override
                                public void onCancelled(@NonNull DatabaseError databaseError) {
                                }
                            };
                            itemsRef.addListenerForSingleValueEvent(eventListener);
                        }
                    })
                    .addOnFailureListener(e -> {

                    });
        } else {
            String type = getType(ty);
            DatabaseReference itemsRef = FirebaseDatabase.getInstance().getReference().child("Topics").child(type);
            ValueEventListener eventListener = new ValueEventListener() {
                @Override
                public void onDataChange(DataSnapshot dataSnapshot) {
                    for (DataSnapshot ds : dataSnapshot.getChildren()) {
                        String name = ds.getKey();
                        topics.add(name);
                        capterAdapter = new TopicAdapter(topics, SelectTopic.this, otherUid, type);
                        recyclerView.setAdapter(capterAdapter);
                        capterAdapter.notifyDataSetChanged();
                        loading.setVisibility(View.GONE);
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {
                }
            };
            itemsRef.addListenerForSingleValueEvent(eventListener);
        }
    }

    String getType(long t) {
        if (t == 0) return "bsc";
        if (t == 1) return "hsc";
        if (t == 2) return "ssc";
        else return "bsc";
    }

    @Override
    public void onBackPressed() {
        finish();
    }
}