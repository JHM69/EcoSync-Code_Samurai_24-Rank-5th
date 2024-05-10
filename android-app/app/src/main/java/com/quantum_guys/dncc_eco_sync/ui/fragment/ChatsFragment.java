package com.quantum_guys.dncc_eco_sync.ui.fragment;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreSettings;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.messege.Adapter.UserAdapter;
import com.quantum_guys.dncc_eco_sync.messege.model.Chatlist;
import com.quantum_guys.dncc_eco_sync.models.Users;
import com.quantum_guys.dncc_eco_sync.viewmodel.ChatViewModel;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;


public class ChatsFragment extends Fragment {
    private final List<Users> mUsers = new ArrayList<>(new LinkedHashSet<>());
    String fuser;
    private RecyclerView recyclerView;
    private UserAdapter userAdapter;
    ChatViewModel chatViewModel;
    TextView not;
    UserViewModel viewModel;
    FirebaseFirestore firestore;
    SwipeRefreshLayout progressBar;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setHasOptionsMenu(true);
    }



    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_chats, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        recyclerView = view.findViewById(R.id.recycler_view);
        FirebaseFirestoreSettings settings = new FirebaseFirestoreSettings.Builder()
                .setPersistenceEnabled(true)
                .build();
        firestore = FirebaseFirestore.getInstance();
        firestore.setFirestoreSettings(settings);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        progressBar = view.findViewById(R.id.swf);
        not = view.findViewById(R.id.not);
        fuser = userId;
        chatViewModel = ViewModelProviders.of(requireActivity()).get(ChatViewModel.class);
        viewModel = ViewModelProviders.of(requireActivity()).get(UserViewModel.class);
        chatViewModel.chats.observe(requireActivity(), chat -> {
            if (chat.size() == 0) {
                loadData();
                not.setVisibility(View.VISIBLE);
                // TextView show = not.findViewById(R.id.textView8);
                // show.setText("Send someone message first.");
            } else {
                //not.setVisibility(View.GONE);
                mUsers.clear();
                for (Chatlist c : chat) {
                    Users user = viewModel.getUserChat(c.id);
                    if(user==null){
                        firestore.collection("Users")
                                .document(c.id)
                                .get()
                                .addOnSuccessListener(documentSnapshot -> {
                                    Users use = documentSnapshot.toObject(Users.class);
                                    viewModel.insert(use);
                                    use.setBio(c.lastMessage);
                                    mUsers.add(use);
                                });
                    }else{
                        user.setBio(c.lastMessage);
                        mUsers.add(user);
                    }
                }
                userAdapter = new UserAdapter(getContext(), mUsers, true);
                recyclerView.setAdapter(userAdapter);
                userAdapter.notifyDataSetChanged();
            }
        });
        progressBar.setOnRefreshListener(this::loadData);
    }

    @SuppressLint({"SetTextI18n", "UseCompatLoadingForDrawables"})
    public void loadData() {
        progressBar.setRefreshing(true);
        Query reference = FirebaseDatabase.getInstance().getReference("Chatlist").child(fuser);
        reference.addChildEventListener(new ChildEventListener() {
            @Override
            public void onChildAdded(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                progressBar.setRefreshing(false);
                Chatlist chatlist = snapshot.getValue(Chatlist.class);
                chatViewModel.insertUser(chatlist);
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

    @Override
    public void onResume() {
        super.onResume();
        loadData();
    }
}
