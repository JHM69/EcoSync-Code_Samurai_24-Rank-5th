package com.quantum_guys.dncc_eco_sync.fragment;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.face.DetectFace;
import com.quantum_guys.dncc_eco_sync.model.TripPlanResponse;
import com.quantum_guys.dncc_eco_sync.model.User;
import com.quantum_guys.dncc_eco_sync.retrofit.ApiUtils;
import com.quantum_guys.dncc_eco_sync.retrofit.TripService;

import org.jetbrains.annotations.NotNull;

import retrofit2.Call;
import retrofit2.Response;

public class MainFragment extends Fragment {

    User user;

    TripPlanResponse tripPlanResponse = new TripPlanResponse();


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

//    default constructor
    public MainFragment(User user) {
        this.user = user;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        view.findViewById(R.id.button).setOnClickListener(v -> {
            startActivity(new Intent(getContext(), DetectFace.class));
        });

        TripService tripService = ApiUtils.getTripService(getContext());

        tripService.getTripPlan(user.getToken()).enqueue( new retrofit2.Callback() {
            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) {
                if(response.isSuccessful()) {
                    tripPlanResponse = (TripPlanResponse) response.body();
                }
            }

            @Override
            public void onFailure(@NotNull Call call, @NotNull Throwable t) {
                Log.e("TripPlan", "onFailure: ", t);
            }
        });


    }



}