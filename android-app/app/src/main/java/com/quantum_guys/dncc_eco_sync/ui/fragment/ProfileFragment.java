package com.quantum_guys.dncc_eco_sync.ui.fragment;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.paging.PagedList;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.firebase.ui.firestore.paging.FirestorePagingAdapter;
import com.firebase.ui.firestore.paging.FirestorePagingOptions;
import com.firebase.ui.firestore.paging.LoadingState;
import com.github.mikephil.charting.charts.PieChart;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.data.PieData;
import com.github.mikephil.charting.data.PieDataSet;
import com.github.mikephil.charting.data.PieEntry;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.PostViewHolder;
import com.quantum_guys.dncc_eco_sync.models.Post;
import com.quantum_guys.dncc_eco_sync.ui.activities.account.EditProfile;
import com.quantum_guys.dncc_eco_sync.ui.activities.notification.ImagePreviewSave;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;
import es.dmoral.toasty.Toasty;

/**
 * Created by jhm69
 */

public class ProfileFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.frag_profile_view, container, false);
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public void onViewCreated(@NonNull final View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Button edit = view.findViewById(R.id.editProfile);
        edit.setOnClickListener(view1 -> startActivity(new Intent(getContext(), EditProfile.class)));
        loadFragment(new AboutFragment());
    }

    private void loadFragment(Fragment fragment) {
        assert getFragmentManager() != null;
        getFragmentManager()
                .beginTransaction()
                .replace(R.id.frame_container, fragment)
                .commit();
    }

    @SuppressWarnings("StatementWithEmptyBody")
    public static class AboutFragment extends Fragment {
        private TextView post, play;
        private TextView friend;
        private TextView scoreTv, levelTv;
        private PieChart pieChart;
        private View rootView;
        private RecyclerView rcv;
        private View statsheetView;
        private BottomSheetDialog mmBottomSheetDialog;
        float total;
        ImageView playMatchs;
        @SuppressLint({"SetTextI18n", "InflateParams"})
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            rootView = inflater.inflate(R.layout.fragmengt_about, container, false);
            FirebaseAuth mAuth = FirebaseAuth.getInstance();
            FirebaseFirestore mFirestore = FirebaseFirestore.getInstance();
            UserViewModel profileView = ViewModelProviders.of(requireActivity()).get(UserViewModel.class);
            CircleImageView profile_pic = rootView.findViewById(R.id.profile_pic);
            TextView name = rootView.findViewById(R.id.name);
            TextView instituteTV = rootView.findViewById(R.id.institute_about);
            TextView email = rootView.findViewById(R.id.email);
            TextView location = rootView.findViewById(R.id.location);
            post = rootView.findViewById(R.id.posts);
            play = rootView.findViewById(R.id.win);
            friend = rootView.findViewById(R.id.friends);
            TextView bio = rootView.findViewById(R.id.bio);
            scoreTv = rootView.findViewById(R.id.scoreJ);
            levelTv = rootView.findViewById(R.id.levelJ);
            statsheetView = getActivity().getLayoutInflater().inflate(R.layout.stat_bottom_sheet_dialog, null);
            mmBottomSheetDialog = new BottomSheetDialog(requireContext());
            mmBottomSheetDialog.setContentView(statsheetView);
            mmBottomSheetDialog.setCanceledOnTouchOutside(true);
            playMatchs = rootView.findViewById(R.id.playBtn);
            rcv = rootView.findViewById(R.id.hdrh);
            rcv.setVisibility(View.VISIBLE);
            LinearLayoutManager layoutManager = new LinearLayoutManager(rootView.getContext());
            rcv.setHasFixedSize(true);
            rcv.setLayoutManager(layoutManager);
            loadPosts();

            playMatchs.setVisibility(View.GONE);

            pieChart = rootView.findViewById(R.id.pieChart);
            pieChart.setNoDataText("");
            mFirestore.collection("Users")
                    .document(Objects.requireNonNull(mAuth.getCurrentUser()).getUid())
                    .collection("Friends")
                    .get()
                    .addOnSuccessListener(documentSnapshots -> friend.setText(String.valueOf(documentSnapshots.size())));
            try {
                profileView.user.observe(getViewLifecycleOwner(), users -> {
                    name.setText(users.getName());

                    instituteTV.setText(users.getInstitute());

                    email.setText(users.getEmail());
                    location.setText(users.getLocation());
                    bio.setText(users.getBio());
                    scoreTv.setText(String.valueOf(users.getScore()));
                    setLevelByScore(levelTv, (int) users.getScore());
                    setUpChartData(pieChart, users.getWin(), users.getLose(), users.getDraw());
                    Glide.with(rootView.getContext())
                            .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                            .load(users.getImage())
                            .into(profile_pic);
                    profile_pic.setOnClickListener(v -> rootView.getContext().startActivity(new Intent(rootView.getContext(), ImagePreviewSave.class)
                            .putExtra("url", users.getImage())));
                });
                FirebaseFirestore.getInstance().collection("Posts")
                        .whereEqualTo("userId", mAuth.getCurrentUser().getUid())
                        .get()
                        .addOnSuccessListener(querySnapshot -> post.setText(String.format(Locale.ENGLISH, "%d", querySnapshot.size())));
            } catch (NullPointerException ignored) {

            }
            levelTv.setOnClickListener(view -> Toasty.info(requireContext(), "Your current level is "+levelTv.getText().toString(), Toast.LENGTH_SHORT).show());
            scoreTv.setOnClickListener(view -> Toasty.info(requireContext(), "Your current score is "+scoreTv.getText().toString(), Toast.LENGTH_SHORT).show());
            friend.setOnClickListener(view -> Toasty.info(requireContext(), "Your total friends count is  "+friend.getText().toString(), Toast.LENGTH_SHORT).show());
            post.setOnClickListener(view -> Toasty.info(requireContext(), "You have posted total "+post.getText().toString() + " posts.", Toast.LENGTH_SHORT).show());
            play.setOnClickListener(view -> Toasty.info(requireContext(), "You have played total "+play.getText().toString() + " battles.", Toast.LENGTH_SHORT).show());



            return rootView;
        }




        @SuppressLint("SetTextI18n")
        private void setLevelByScore(TextView levelTV, int score) {
            if (score <= 500) {
                levelTV.setText("1");
            } else if (score <= 1000) {
                levelTV.setText("2");
            } else if (score <= 1500) {
                levelTV.setText("3");
            } else if (score <= 2000) {
                levelTV.setText("4");
            } else if (score <= 2500) {
                levelTV.setText("5");
            } else if (score <= 3500) {
                levelTV.setText("6");
            } else if (score <= 5000) {
                levelTV.setText("7");
            } else {
                levelTV.setText("0");
            }
        }

        private void loadPosts() {
            PagedList.Config config = new PagedList.Config.Builder()
                    .setEnablePlaceholders(false)
                    .setPrefetchDistance(4)
                    .setPageSize(6)
                    .build();
            Query mQuery;
            mQuery = FirebaseFirestore.getInstance().collection("Posts").orderBy("timestamp", Query.Direction.DESCENDING).whereEqualTo("userId", userId);
            FirestorePagingOptions<Post> options = new FirestorePagingOptions.Builder<Post>()
                    .setLifecycleOwner(this)
                    .setQuery(mQuery, config, Post.class)
                    .build();

            FirestorePagingAdapter<Post, PostViewHolder> mAdapter;
            mAdapter = new FirestorePagingAdapter<Post, PostViewHolder>(options) {
                @NonNull
                @Override
                public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                    View view = getLayoutInflater().inflate(R.layout.item_feed_post, parent, false);
                    return new PostViewHolder(view);
                }

                @Override
                protected void onBindViewHolder(@NonNull PostViewHolder holder, int position, @NonNull Post post) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                        holder.bind(post, holder, position, mmBottomSheetDialog, statsheetView, true);
                    }
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
                            // refreshLayout.setRefreshing(true);
                            break;

                        case LOADED:
                            break;

                        case ERROR:
                            Toast.makeText(
                                    getActivity(),
                                    "Error Occurred!",
                                    Toast.LENGTH_SHORT
                            ).show();

                            //refreshLayout.setRefreshing(false);
                            break;

                        case FINISHED:
                            // refreshLayout.setRefreshing(false);
                            break;
                    }
                }

            };
            rcv.setAdapter(mAdapter);
        }

        void setUpChartData(PieChart pieChart, float win, float lose, float draw) {
            float total = win + draw + lose;
            if (total == 0) {
                pieChart.setVisibility(View.INVISIBLE);
            } else {
                pieChart.setVisibility(View.VISIBLE);
                Description description = new Description();
                description.setText("");
                pieChart.setDescription(description);
                Map<String, Float> scoreData = new HashMap<>();
                scoreData.put("win", win);
                scoreData.put("draw:", draw);
                scoreData.put("lose:", lose);
                ArrayList<PieEntry> entries = new ArrayList<>();
                if (win == 0) {
                    //entries.add(new PieEntry(win, "Win: " + win));
                } else {
                    entries.add(new PieEntry(win, "win"));
                }
                if (draw == 0) {
                    //entries.add(new PieEntry(win, "Win: " + win));
                } else {
                    entries.add(new PieEntry(draw, "draw"));
                }
                if (lose == 0) {
                    //entries.add(new PieEntry(win, "Win: " + win));
                } else {
                    entries.add(new PieEntry(lose, "lose"));
                }
                PieDataSet pieDataSet = new PieDataSet(entries, " | won:" + (win == 0 ? "0" : (int) win) + " | drawn:" + (draw == 0 ? "0" : (int) draw) + " | lost:" + (lose == 0 ? "0" : (int) lose) + " | total:" + ((win + draw + lose) == 0 ? "0" : (int) (win + draw + lose)));
                pieDataSet.setColors(Color.parseColor("#41B843"), Color.parseColor("#AA6CEF"), Color.parseColor("#F45656"));
                PieData pieData = new PieData(pieDataSet);
                pieChart.setData(pieData);
                pieData.setValueTextColor(Color.parseColor("#ffffff"));
                pieData.setValueTextSize(10);
                pieChart.animateXY(1500, 1500);
                pieChart.invalidate();
                play.setText(String.valueOf((int)total));

            }
        }
    }



}


