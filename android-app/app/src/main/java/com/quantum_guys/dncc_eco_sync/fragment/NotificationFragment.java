package com.quantum_guys.dncc_eco_sync.fragment;import android.annotation.SuppressLint;import android.os.Bundle;import android.view.LayoutInflater;import android.view.View;import android.view.ViewGroup;import android.widget.ProgressBar;import androidx.annotation.NonNull;import androidx.annotation.Nullable;import androidx.fragment.app.Fragment;import androidx.recyclerview.widget.LinearLayoutManager;import androidx.recyclerview.widget.RecyclerView;import com.quantum_guys.dncc_eco_sync.R;import com.quantum_guys.dncc_eco_sync.adapter.NotificationAdapter;import com.quantum_guys.dncc_eco_sync.model.Notification;import java.util.ArrayList;import java.util.List;public class NotificationFragment extends Fragment {    List<Notification> notifications = new ArrayList<>();    NotificationAdapter notificationAdapter;    @Nullable    @Override    public View onCreateView(@NonNull LayoutInflater inflater,                             @Nullable ViewGroup container,                             @Nullable Bundle savedInstanceState) {        return inflater.inflate(R.layout.fragment_notification, container, false);    }    @SuppressLint("SetTextI18n")    @Override    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {        super.onViewCreated(view, savedInstanceState);        ProgressBar progressBar = view.findViewById(R.id.progressBar34);        RecyclerView busesView = view.findViewById(R.id.notifications4);        busesView.setLayoutManager(new LinearLayoutManager(getContext()));        notificationAdapter = new NotificationAdapter(getActivity(), notifications);        busesView.setAdapter(notificationAdapter);        progressBar.setVisibility(View.VISIBLE);    }    @Override    public void onResume() {        notifications.clear();        super.onResume();    }}