package com.quantum_guys.dncc_eco_sync.ui.activities.quiz;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.inHome;

import android.annotation.SuppressLint;
import android.app.ActivityOptions;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.paging.PagedList;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.firebase.ui.firestore.paging.FirestorePagingAdapter;
import com.firebase.ui.firestore.paging.FirestorePagingOptions;
import com.firebase.ui.firestore.paging.LoadingState;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.PlayerAdapter;
import com.quantum_guys.dncc_eco_sync.models.Player;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import es.dmoral.toasty.Toasty;

/**
 * Created by jhm69
 */

public class PlayQuiz extends Fragment {
    List<String> usersId;
    UserViewModel userViewModel;
    long myType;
    private FirebaseFirestore firestore;
    private RecyclerView mRecyclerView;
    private SwipeRefreshLayout refreshLayout;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.send_message_fragment, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        firestore = FirebaseFirestore.getInstance();

        usersId = new ArrayList<>();
        mRecyclerView = view.findViewById(R.id.messageList);
        refreshLayout = view.findViewById(R.id.refreshLayout);

        userViewModel = ViewModelProviders.of(requireActivity()).get(UserViewModel.class);

        myType = userViewModel.getUser().getType();

        mRecyclerView.setItemAnimator(new DefaultItemAnimator());
        mRecyclerView.setLayoutManager(new LinearLayoutManager(view.getContext()));
        mRecyclerView.setHasFixedSize(true);
        mRecyclerView.addItemDecoration(new DividerItemDecoration(view.getContext(), DividerItemDecoration.VERTICAL));

        refreshLayout.setOnRefreshListener(this::setupAdapter);
        setupAdapter();
    }

    @Override
    public void onDestroy() {
        inHome = true;
        super.onDestroy();
    }

    private void setupAdapter() {
        PagedList.Config config = new PagedList.Config.Builder()
                .setEnablePlaceholders(false)
                .setPrefetchDistance(5)
                .setPageSize(20)
                .build();
        Query mQuery = firestore.collection("Users").whereEqualTo("type", myType)
                .orderBy("lastTimestamp", Query.Direction.DESCENDING);

        FirestorePagingOptions<Player> options = new FirestorePagingOptions.Builder<Player>()
                .setLifecycleOwner(this)
                .setQuery(mQuery, config, Player.class)
                .build();
        // Instantiate Paging Adapter

        //holder.bind(post, holder, position,  mmBottomSheetDialog, statsheetView);
        FirestorePagingAdapter<Player, PlayerAdapter.ViewHolder> mAdapter = new FirestorePagingAdapter<Player, PlayerAdapter.ViewHolder>(options) {
            @NonNull
            @Override
            public PlayerAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                View view = getLayoutInflater().inflate(R.layout.item_quiz_profile, parent, false);
                return new PlayerAdapter.ViewHolder(view);
            }

            @SuppressLint({"SetTextI18n", "CheckResult"})
            @Override
            protected void onBindViewHolder(@NonNull PlayerAdapter.ViewHolder holder, int position, @NonNull Player user) {
                usersId.add(user.getId());
                Objects.requireNonNull(getView()).findViewById(R.id.default_item).setVisibility(View.GONE);
                holder.name.setText(user.getName());
                holder.institute.setText(user.getDept() + ", " + user.getInstitute());
                if (user.getDept().equals("")) {
                    holder.institute.setText(user.getInstitute());
                } else if (user.getInstitute().equals("")) {
                    holder.institute.setText(user.getDept());
                } else {
                    holder.institute.setText(user.getDept() + ", " + user.getInstitute());
                }
                int score = (int) user.getScore();
                holder.level.setText(String.valueOf(score));
                Glide.with(Objects.requireNonNull(getContext()))
                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                        .load(user.getImage())
                        .into(holder.image);

                holder.time.setText(getTimeText(user.getLastTimestamp()));

                holder.mView.setOnClickListener(view -> {
                    if (Objects.equals(FirebaseAuth.getInstance().getUid(), user.getId())) {
                        Toasty.error(requireActivity(), "You can't play with yourself. Select someone else", Toasty.LENGTH_SHORT, true);
                    } else {
                        Intent goBattle = new Intent(getContext(), SelectTopic.class);
                        goBattle.putExtra("otherUid", user.getId());
                        getContext().startActivity(goBattle, ActivityOptions.makeSceneTransitionAnimation(getActivity()).toBundle());
                    }
                });
            }

            private String getTimeText(long lastTimestamp) {
                String time = TimeAgo.using(lastTimestamp);
                time = time.replaceAll("just now", "now")
                        .replaceAll(" minutes", "m")
                        .replaceAll(" minute", "1m")
                        .replaceAll("about", "")
                        .replaceAll(" hours", "h")
                        .replaceAll(" hour", "1h")
                        .replaceAll(" an", "")
                        .replaceAll("a ", "1 ")
                        .replaceAll(" ago", "")
                        .replaceAll("yesterday", "1d")
                        .replaceAll(" days", "d")
                        .replaceAll(" day", "1d");
                return time;
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
                        refreshLayout.setRefreshing(true);
                        break;

                    case LOADED:
                        if (getItemCount() == 0) {
                            Objects.requireNonNull(getView()).findViewById(R.id.default_item).setVisibility(View.VISIBLE);
                        }
                        refreshLayout.setRefreshing(false);
                        break;

                    case ERROR:
                        Toast.makeText(
                                getActivity(),
                                "Error Occurred!",
                                Toast.LENGTH_SHORT
                        ).show();

                        refreshLayout.setRefreshing(false);
                        break;
                    case FINISHED:
                        refreshLayout.setRefreshing(false);
                        break;
                }
            }

        };
        mRecyclerView.setAdapter(mAdapter);

    }

}
