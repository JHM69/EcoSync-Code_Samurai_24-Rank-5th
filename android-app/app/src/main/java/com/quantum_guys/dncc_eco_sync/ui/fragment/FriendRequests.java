package com.quantum_guys.dncc_eco_sync.ui.fragment;

import static androidx.recyclerview.widget.RecyclerView.VERTICAL;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
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

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.FriendRequestAdapter;
import com.quantum_guys.dncc_eco_sync.models.FriendRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Created by jhm69
 */

public class FriendRequests extends Fragment {

    private List<FriendRequest> requestList;
    private FriendRequestAdapter requestAdapter;
    private FirebaseFirestore mFirestore;
    private FirebaseAuth mAuth;
    private SwipeRefreshLayout refreshLayout;

    public void getUsers() {
        requestList.clear();
        requestAdapter.notifyDataSetChanged();

        Objects.requireNonNull(getView()).findViewById(R.id.default_item).setVisibility(View.GONE);
        refreshLayout.setRefreshing(true);

        mFirestore.collection("Users")
                .document(Objects.requireNonNull(mAuth.getCurrentUser()).getUid())
                .collection("Friend_Requests")
                .get()
                .addOnSuccessListener(queryDocumentSnapshots -> {

                    if (!queryDocumentSnapshots.isEmpty()) {

                        for (DocumentChange doc : queryDocumentSnapshots.getDocumentChanges()) {

                            if (doc.getType() == DocumentChange.Type.ADDED) {
                                FriendRequest friendRequest = doc.getDocument().toObject(FriendRequest.class).withId(doc.getDocument().getId());
                                requestList.add(friendRequest);
                                requestAdapter.notifyDataSetChanged();
                                refreshLayout.setRefreshing(false);
                            }

                        }

                        if (requestList.isEmpty()) {
                            refreshLayout.setRefreshing(false);
                            getView().findViewById(R.id.default_item).setVisibility(View.VISIBLE);
                        }

                    } else {
                        refreshLayout.setRefreshing(false);
                        getView().findViewById(R.id.default_item).setVisibility(View.VISIBLE);
                    }

                })
                .addOnFailureListener(e -> {
                    refreshLayout.setRefreshing(false);
                    Toast.makeText(getView().getContext(), "Some error occurred", Toast.LENGTH_SHORT).show();
                    Log.w("Error", "listen:error", e);

                });
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.frag_friend_req, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        RecyclerView mRequestView = view.findViewById(R.id.recyclerView);
        refreshLayout = view.findViewById(R.id.refreshLayout);

        requestList = new ArrayList<>();
        requestAdapter = new FriendRequestAdapter(requestList, view.getContext());

        mRequestView.setItemAnimator(new DefaultItemAnimator());
        mRequestView.setLayoutManager(new LinearLayoutManager(view.getContext(), VERTICAL, false));
        mRequestView.addItemDecoration(new DividerItemDecoration(view.getContext(), DividerItemDecoration.VERTICAL));
        mRequestView.setHasFixedSize(true);
        mRequestView.setAdapter(requestAdapter);

        refreshLayout.setOnRefreshListener(this::getUsers);
        getUsers();

    }
}
