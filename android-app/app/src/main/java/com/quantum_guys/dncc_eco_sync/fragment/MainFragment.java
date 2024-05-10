package com.quantum_guys.dncc_eco_sync.fragment;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
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

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainFragment extends Fragment {

    User user;

    String TAG = "MainFragmentView";

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

        tripService.getTripPlan("Bearer " + user.getToken()).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    // Request successful
                    System.out.println("Request successful");
                } else {
                    // Request failed
                    System.out.println("Request failed: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                // Request failed due to network failure or other reasons
                System.out.println("Request failed: " + t.getMessage());
            }
        });



    }



}