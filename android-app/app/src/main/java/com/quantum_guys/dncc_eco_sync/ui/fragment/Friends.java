package com.quantum_guys.dncc_eco_sync.ui.fragment;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.viewFriends.ViewFriendAdapter;
import com.quantum_guys.dncc_eco_sync.models.ViewFriends;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import es.dmoral.toasty.Toasty;

/**
 * Created by jhm69
 */

@SuppressWarnings("NullableProblems")
public class Friends extends Fragment {

    private List<ViewFriends> usersList;
    private ViewFriendAdapter usersAdapter;
    private FirebaseFirestore firestore;
    private SwipeRefreshLayout refreshLayout;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.frag_view_friends, container, false);
    }

    public void startListening() {
        usersList.clear();
        usersAdapter.notifyDataSetChanged();
        Objects.requireNonNull(getView()).findViewById(R.id.default_item).setVisibility(View.GONE);
        refreshLayout.setRefreshing(true);
        firestore.collection("Users")
                .document(userId)
                .collection("Friends")
                .orderBy("name", Query.Direction.ASCENDING)
                .get()
                .addOnSuccessListener(queryDocumentSnapshots -> {

                    if (!queryDocumentSnapshots.isEmpty()) {
                        for (DocumentChange doc : queryDocumentSnapshots.getDocumentChanges()) {
                            if (doc.getType() == DocumentChange.Type.ADDED) {
                                ViewFriends users = doc.getDocument().toObject(ViewFriends.class);
                                usersList.add(users);
                                usersAdapter.notifyDataSetChanged();
                                refreshLayout.setRefreshing(false);
                            }
                        }

                        if (usersList.isEmpty()) {
                            refreshLayout.setRefreshing(false);
                            getView().findViewById(R.id.default_item).setVisibility(View.VISIBLE);
                        }

                    } else {
                        try {
                            refreshLayout.setRefreshing(false);
                            getView().findViewById(R.id.default_item).setVisibility(View.VISIBLE);
                        } catch (NullPointerException ignored) {

                        }
                    }

                })
                .addOnFailureListener(e -> {

                    refreshLayout.setRefreshing(false);
                    Toasty.error(getView().getContext(), "Some technical error occurred", Toasty.LENGTH_SHORT, true).show();
                    Log.w("Error", "listen:error", e);

                });
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        firestore = FirebaseFirestore.getInstance();
        FirebaseAuth mAuth = FirebaseAuth.getInstance();

        RecyclerView mRecyclerView = Objects.requireNonNull(getView()).findViewById(R.id.recyclerView);
        refreshLayout = getView().findViewById(R.id.refreshLayout);

        usersList = new ArrayList<>();
        usersAdapter = new ViewFriendAdapter(usersList, view.getContext());


        mRecyclerView.setItemAnimator(new DefaultItemAnimator());
        mRecyclerView.setLayoutManager(new LinearLayoutManager(view.getContext()));
        mRecyclerView.setHasFixedSize(true);
        mRecyclerView.addItemDecoration(new DividerItemDecoration(view.getContext(), DividerItemDecoration.VERTICAL));
        mRecyclerView.setAdapter(usersAdapter);

        refreshLayout.setOnRefreshListener(this::startListening);

        startListening();

    }
}
