package com.quantum_guys.dncc_eco_sync.ui.fragment;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.inHome;
import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.tabs.TabLayout;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.messege.model.Chat;
import com.quantum_guys.dncc_eco_sync.models.Notification;
import com.quantum_guys.dncc_eco_sync.ui.activities.notification.NotificationFragment;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.util.List;
import java.util.Objects;

/**
 * Created by jhm69
 */

public class Dashboard extends Fragment {
    private final int[] tabIcons = {
            R.drawable.ic_multiline_chart_black_24dp,
            R.drawable.ic_prop,
            R.drawable.ic_question_answer_black_24dp,
            R.drawable.ic_notifications_black_24dp
    };
    private TabAdapter adapter;
    private TabLayout tabLayout;

    private int nSize;
    private FirebaseFirestore firestore;
    int count = 0, chatCount=0;
    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.frag_dashboard, container, false);
    }


    @SuppressLint("RestrictedApi")
    @Override
    public void onViewCreated(@NonNull final View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        tabLayout = requireView().findViewById(R.id.tabLayout);
        ViewPager viewPager = getView().findViewById(R.id.view_pager);
        adapter = new TabAdapter(requireActivity().getSupportFragmentManager(), getActivity());

        adapter.addFragment(new Home(), "Post", tabIcons[0]);
        adapter.addFragment(new Issue(), "Issue", tabIcons[1]);
        adapter.addFragment(new NotificationFragment(), "Notification", tabIcons[3]);

        viewPager.setAdapter(adapter);
        for (int i = 0; i < tabLayout.getTabCount(); i++) {
            TabLayout.Tab tab = tabLayout.getTabAt(i);
            Objects.requireNonNull(tab).setCustomView(null);
            tab.setCustomView(adapter.getTabView(i));
        }
        tabLayout.setupWithViewPager(viewPager);

        highLightCurrentTab(0);
        try {
            viewPager.setOffscreenPageLimit(adapter.getCount());
        } catch (Exception ignored) {

        }


        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
                highLightCurrentTab(position);
                inHome = position == 0;
            }

            @Override
            public void onPageScrollStateChanged(int state) {
            }
        });


        firestore = FirebaseFirestore.getInstance();

        updateBattle();

        TabLayout.Tab tab = tabLayout.getTabAt(2);
        FirebaseDatabase.getInstance().getReference().child("Chats")
                .orderByChild("receiver")
                .equalTo(userId).limitToLast(10).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                try {
                    Chat chat = (Chat) snapshot.getValue(Chat.class);
                    //Log.d("SeenCount", chat.getMessage()+chat.isIsseen());
                    if(chat!=null) {
                        if (!chat.isIsseen()) {
                            chatCount++;
                            if (chatCount > 0) {
                                tab.setCustomView(null);
                                tab.setCustomView(adapter.setChat(chatCount));
                            }
                        }
                    }
                }catch(Exception ignore){

                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }

    @Override
    public void onResume() {
        updateBattle();
        super.onResume();
    }



    private void updateBattle(){
        count = 0;
        AsyncTask.execute(() -> firestore.collection("Users")
               .document(userId)
               .collection("Info_Notifications")
               .orderBy("timestamp", Query.Direction.DESCENDING).limit(7)
               .get()
               .addOnSuccessListener(queryDocumentSnapshots -> {
                   if (!queryDocumentSnapshots.isEmpty()) {
                       for (DocumentChange documentChange : queryDocumentSnapshots.getDocumentChanges()) {
                           if (documentChange.getType() == DocumentChange.Type.ADDED) {
                               Notification notification = documentChange.getDocument().toObject(Notification.class).withId(documentChange.getDocument().getId());
                               if (!notification.isRead()) count++;


                           }
                       }
//                       if(count!=0) {
//                           TabLayout.Tab tab = tabLayout.getTabAt(0);
//                           tab.setCustomView(null);
//                           tab.setCustomView(adapter.setNotifications(count/2));
//                       }
                   }
               }));
   }

    private void highLightCurrentTab(int position) {
        for (int i = 0; i < tabLayout.getTabCount(); i++) {
            TabLayout.Tab tab = tabLayout.getTabAt(i);
            assert tab != null;
            tab.setCustomView(null);
            tab.setCustomView(adapter.getTabView(i));
        }
        TabLayout.Tab tab = tabLayout.getTabAt(position);
        assert tab != null;
        tab.setCustomView(null);
        tab.setCustomView(adapter.getSelectedTabView(position));
    }

    private int getScoreCount(List<Boolean> scoreList) {
        int score = 0;
        for (int i = 0; i < scoreList.size(); i++) {
            if (scoreList.get(i)) {
                score++;
            }
        }
        return score;
    }

    @SuppressLint("CheckResult")
    private void updateScore() {
        try {
            UserViewModel userViewModel = ViewModelProviders.of(requireActivity()).get(UserViewModel.class);
            firestore.collection("Users")
                    .document(userId)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        int score = Objects.requireNonNull(documentSnapshot.getLong("score")).intValue();
                        int win = Integer.parseInt(Objects.requireNonNull(documentSnapshot.get("win")).toString());
                        int lose = Integer.parseInt(Objects.requireNonNull(documentSnapshot.get("lose")).toString());
                        int draw = Integer.parseInt(Objects.requireNonNull(documentSnapshot.get("draw")).toString());
                        userViewModel.setWin(win);
                        userViewModel.setLose(lose);
                        userViewModel.setDraw(draw);
                        userViewModel.setScore(score);
                    });
        }catch (Exception ignored){

        }
    }



    @Override
    public void onDestroy() {
        count=chatCount=0;
        super.onDestroy();
    }

    /*   private void checkFriendRequest() {
        request_alert = getView().findViewById(R.id.friend_req_alert);
        request_alert_text = getView().findViewById(R.id.friend_req_alert_text);
        FirebaseFirestore.getInstance().collection("Users")
                .document(userId)
                .collection("Friend_Requests")
                .addSnapshotListener((queryDocumentSnapshots, e) -> {
                    if (e != null) {
                        e.printStackTrace();
                        return;
                    }

                    if (!queryDocumentSnapshots.isEmpty()) {
                        try {
                            request_alert.setVisibility(View.VISIBLE);
                            request_alert_text.setText(String.format("You have new Friend Request", queryDocumentSnapshots.size()));
                            request_alert.animate()
                                    .setDuration(300)
                                    .scaleX(1.0f)
                                    .scaleY(1.0f)
                                    .alpha(1.0f)
                                    .start();

                        } catch (Exception e1) {
                            e1.printStackTrace();
                        }
                    }

                });
    }*/
}

