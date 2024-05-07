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

import com.google.android.material.tabs.TabLayout;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.activity.MapView;

public class MainFragment extends Fragment {

    private final TabLayout tabLayout;
    final Integer id;

    public MainFragment(TabLayout tabLayout, Integer id) {
        this.tabLayout = tabLayout;
        this.id = id;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_home, container, false);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

//         new GetTripInfo().execute(id);


        view.findViewById(R.id.button).setOnClickListener(v -> {
            startActivity(new Intent(getContext(), MapView.class));
        });


    }


//    @SuppressLint("StaticFieldLeak")
//    protected class GetTripInfo extends AsyncTask<Integer, Void, Trip> {
//        protected Trip doInBackground(Integer... urls) {
//            try {
//                return new Trip();
//            } catch (Exception e) {
//                return null;
//            }
//        }
//
//        @SuppressLint("SetTextI18n")
//        protected void onPostExecute(Trip trip) {
//            try {
//
//            } catch (Exception ignored) {
//
//            }
//        }
//    }


}