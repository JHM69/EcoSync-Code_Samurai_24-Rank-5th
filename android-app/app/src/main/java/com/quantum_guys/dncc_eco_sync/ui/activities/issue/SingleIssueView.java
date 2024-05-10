package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.paging.PagedList;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.firebase.ui.firestore.paging.FirestorePagingAdapter;
import com.firebase.ui.firestore.paging.FirestorePagingOptions;
import com.firebase.ui.firestore.paging.LoadingState;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.PostViewHolder;
import com.quantum_guys.dncc_eco_sync.models.Issue;
import com.quantum_guys.dncc_eco_sync.models.Post;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class SingleIssueView extends AppCompatActivity {
    RecyclerView mRecyclerView;
    private View statsheetView;
    private BottomSheetDialog mmBottomSheetDialog;
    private ProgressBar pbar;
    private FirebaseFirestore mFirestore;


    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }


    @SuppressLint("InflateParams")
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

        setContentView(R.layout.activity_single_post_view);

        String post_id = getIntent().getStringExtra("post_id");

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setTitleTextColor(Color.WHITE);
        toolbar.setTitle("Issue");

        Objects.requireNonNull(getSupportActionBar()).setTitle("Issue");
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        if (post_id == null) {
            finish();
        }

        if (!TextUtils.isEmpty(post_id)) {

            pbar = findViewById(R.id.pbar);
            mFirestore = FirebaseFirestore.getInstance();

            statsheetView = getLayoutInflater().inflate(R.layout.stat_bottom_sheet_dialog, null);
            mmBottomSheetDialog = new BottomSheetDialog(this);
            mmBottomSheetDialog.setContentView(statsheetView);
            mmBottomSheetDialog.setCanceledOnTouchOutside(true);

            List<Issue> mPostsList = new ArrayList<>();

            mRecyclerView = findViewById(R.id.recyclerView);
            mRecyclerView.setItemAnimator(new DefaultItemAnimator());
            mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
            mRecyclerView.setHasFixedSize(true);
            pbar.setVisibility(View.VISIBLE);
            getPosts(post_id);


        } else {
            finish();
        }

    }

    private void getPosts(final String post_id) {
        PagedList.Config config = new PagedList.Config.Builder()
                .setEnablePlaceholders(false)
                .setPrefetchDistance(1)
                .setPageSize(1)
                .build();
        Query mQuery = mFirestore.collection("Issues")
                .whereEqualTo("postId", post_id);

        FirestorePagingOptions<Issue> options = new FirestorePagingOptions.Builder<Issue>()
                .setLifecycleOwner(this)
                .setQuery(mQuery, config, Issue.class)
                .build();
        // Instantiate Paging Adapter

        // getApplicationContext().getSharedPreferences("Posts", MODE_PRIVATE).edit().putInt("num", getItemCount()).apply();
        FirestorePagingAdapter<Issue, PostViewHolder> mAdapter = new FirestorePagingAdapter<Issue, PostViewHolder>(options) {
            @NonNull
            @Override
            public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                View view = getLayoutInflater().inflate(R.layout.item_feed_post, parent, false);
                return new PostViewHolder(view);
            }

            @Override
            protected void onBindViewHolder(@NonNull PostViewHolder holder, int position, @NonNull Issue issue) {
                holder.bind(issue, holder, position, mmBottomSheetDialog, statsheetView, false);
            }

            @Override
            protected void onError(@NonNull Exception e) {
                super.onError(e);
                Log.e("MainActivity", e.getMessage());
            }

            @Override
            protected void onLoadingStateChanged(@NonNull LoadingState state) {
                switch (state) {
                    case LOADING_INITIAL:
                    case LOADING_MORE:
                        pbar.setVisibility(View.VISIBLE);
                        break;

                    case LOADED:

                    case FINISHED:
                        if (getItemCount() == 0) finish();
                        pbar.setVisibility(View.GONE);
                        // getApplicationContext().getSharedPreferences("Posts", MODE_PRIVATE).edit().putInt("num", getItemCount()).apply();
                        break;

                    case ERROR:
                        Toast.makeText(
                                getApplicationContext(),
                                "Error Occurred!",
                                Toast.LENGTH_SHORT
                        ).show();

                        pbar.setVisibility(View.GONE);
                        break;
                }
            }

        };
        mRecyclerView.setAdapter(mAdapter);
    }
}
