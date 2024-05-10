package com.quantum_guys.dncc_eco_sync.ui.fragment;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;

import com.quantum_guys.dncc_eco_sync.R;

import java.util.Objects;

/**
 * Created by jhm69
 */

@SuppressWarnings("NullableProblems")
public class FriendsFragment extends Fragment implements BottomNavigationView.OnNavigationItemReselectedListener,
        BottomNavigationView.OnNavigationItemSelectedListener {

   // FloatingActionButton fab;

    public static FriendsFragment newInstance(String frag) {

        Bundle args = new Bundle();
        args.putString("frag", frag);

        FriendsFragment friendsFragment = new FriendsFragment();
        friendsFragment.setArguments(args);

        return friendsFragment;

    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.frag_friends, container, false);
    }

    @Override
    public void onViewCreated(final View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

       // fab = view.findViewById(R.id.searchFab);
       // fab.setOnClickListener(v -> gotoSearch());

        BottomNavigationView bottomNavigationView = view.findViewById(R.id.bottom_nav);
        if (getArguments() != null) {
            bottomNavigationView.setSelectedItemId(R.id.action_view_request);
            loadFragment(new FriendRequests());
        } else {
            loadFragment(new Friends());
        }
        bottomNavigationView.setOnNavigationItemSelectedListener(this);
        bottomNavigationView.setOnNavigationItemReselectedListener(this);


    }

    private void loadFragment(Fragment fragment) {
        Objects.requireNonNull(getFragmentManager())
                .beginTransaction()
                .replace(R.id.container_2, fragment)
                .commit();
    }

    public void gotoSearch() {
       // SearchUsersActivity.startActivity(getActivity(), Objects.requireNonNull(getView()).getContext(), fab);
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public void onNavigationItemReselected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_view:
            case R.id.action_view_request:
                break;


        }
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_view:
                loadFragment(new Friends());
                break;
            case R.id.action_view_request:
                loadFragment(new FriendRequests());
                break;
        }
        return true;
    }
}
