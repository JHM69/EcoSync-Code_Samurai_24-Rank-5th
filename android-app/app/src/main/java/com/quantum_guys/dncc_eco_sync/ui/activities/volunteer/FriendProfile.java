package com.quantum_guys.dncc_eco_sync.ui.activities.volunteer;

import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;
import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityOptions;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.transition.Explode;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.fragment.app.Fragment;
import androidx.paging.PagedList;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.firebase.ui.firestore.paging.FirestorePagingAdapter;
import com.firebase.ui.firestore.paging.FirestorePagingOptions;
import com.firebase.ui.firestore.paging.LoadingState;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.marcoscg.dialogsheet.DialogSheet;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.PostViewHolder;
import com.quantum_guys.dncc_eco_sync.messege.activity.MessageActivity;
import com.quantum_guys.dncc_eco_sync.models.Notification;
import com.quantum_guys.dncc_eco_sync.models.Post;
import com.quantum_guys.dncc_eco_sync.notification.APIService;
import com.quantum_guys.dncc_eco_sync.notification.Client;
import com.quantum_guys.dncc_eco_sync.notification.MyResponse;
import com.quantum_guys.dncc_eco_sync.notification.NotificationSender;
import com.quantum_guys.dncc_eco_sync.ui.activities.quiz.SelectTopic;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;
import es.dmoral.toasty.Toasty;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FriendProfile extends AppCompatActivity {
    String id;
    static String namee;
    static String imagee;
    static boolean isFriend;
    public static void startActivity(Context context, String id) {
        if (!id.equals(userId)) {
            context.startActivity(new Intent(context, FriendProfile.class).putExtra("f_id", id).setFlags(FLAG_ACTIVITY_NEW_TASK), ActivityOptions.makeSceneTransitionAnimation((Activity)context).toBundle());
        }else{
            Toast.makeText(context, "", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);
        getWindow().setEnterTransition(new Explode());
        getWindow().setExitTransition(new Explode());

        super.onCreate(savedInstanceState);
        SharedPreferences sharedPreferences = getSharedPreferences("Theme", Context.MODE_PRIVATE);
        String themeName = sharedPreferences.getString("ThemeName", "Default");
        if (themeName.equalsIgnoreCase("TealTheme")) {
            setTheme(R.style.TealTheme);
        } else if (themeName.equalsIgnoreCase("VioleteTheme")) {
            setTheme(R.style.VioleteTheme);
        } else if (themeName.equalsIgnoreCase("PinkTheme")) {
            setTheme(R.style.PinkTheme);
        } else if (themeName.equalsIgnoreCase("DelRio")) {
            setTheme(R.style.DelRio);
        } else if (themeName.equalsIgnoreCase("DarkTheme")) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            setTheme(R.style.Dark);
        } else if (themeName.equalsIgnoreCase("Lynch")) {
            setTheme(R.style.Lynch);
        } else {
            setTheme(R.style.AppTheme);
        }
        setContentView(R.layout.activity_friend_profile);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setTitle("Profile");
        toolbar.setTitleTextColor(Color.WHITE);

        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setTitle("Profile");

        id = getIntent().getStringExtra("f_id");

        if(id==null){
            String link = getIntent().getData().toString();
            id = link.substring(link.lastIndexOf("/") + 1);
        }

        final Bundle bundle = new Bundle();
        bundle.putString("id", id);

        Fragment fragment = new AboutFragment();
        fragment.setArguments(bundle);
        loadFragment(fragment);


    }

    private void loadFragment(Fragment fragment) {
        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.frame_container, fragment)
                .commit();
    }


    @SuppressLint("SetTextI18n")
    private void setLevelByScore(TextView levelTV, int score) {
        if (score <= 500) {
            levelTV.setText("Level: 1");
        } else if (score <= 1000) {
            levelTV.setText("Level: 2");
        } else if (score <= 1500) {
            levelTV.setText("Level: 3");
        } else if (score <= 2000) {
            levelTV.setText("Level: 4");
        } else if (score <= 2500) {
            levelTV.setText("Level: 5");
        } else if (score <= 3500) {
            levelTV.setText("Level: 6");
        } else if (score <= 5000) {
            levelTV.setText("Level: 7");
        } else {
            levelTV.setText("Level: unknown");
        }
    }

    @SuppressWarnings("StatementWithEmptyBody")
    public static class AboutFragment extends Fragment {
        FirestorePagingAdapter<Post, PostViewHolder> mAdapter;
        String id;
        ImageView playMatchs;
        long type;
        private FirebaseFirestore mFirestore;
        private FirebaseUser currentUser;
        private String friend_name, friend_email, friend_image;
        private TextView name, email, institute, location, post, friend, totalP ,bio, req_sent, scoreTV, levelTV;
        private CircleImageView profile_pic;
        private Button add_friend, remove_friend, accept, decline;
        private LinearLayout req_layout;
        private View rootView;
        private ProgressDialog mDialog;
        private RecyclerView rcv;
        private View statsheetView;
        private BottomSheetDialog mmBottomSheetDialog;

        public AboutFragment() {
        }

        @SuppressLint({"SetTextI18n", "InflateParams"})
        @Override
        public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            rootView = inflater.inflate(R.layout.fragmengt_about, container, false);

            Bundle bundle = this.getArguments();
            if (bundle != null) {
                id = bundle.getString("id");
            } else {
                Toasty.error(rootView.getContext(), "Error retrieving information.", Toasty.LENGTH_SHORT, true).show();
                requireActivity().finish();
            }

            mFirestore = FirebaseFirestore.getInstance();
            currentUser = FirebaseAuth.getInstance().getCurrentUser();
            institute = rootView.findViewById(R.id.institute_about);
            profile_pic = rootView.findViewById(R.id.profile_pic);
            name = rootView.findViewById(R.id.name);
            email = rootView.findViewById(R.id.email);
            totalP =  rootView.findViewById(R.id.win);
            location = rootView.findViewById(R.id.location);
            playMatchs = rootView.findViewById(R.id.playBtn);
            scoreTV = rootView.findViewById(R.id.scoreJ);
            levelTV = rootView.findViewById(R.id.levelJ);
            post = rootView.findViewById(R.id.posts);
            friend = rootView.findViewById(R.id.friends);
            bio = rootView.findViewById(R.id.bio);

            req_sent = rootView.findViewById(R.id.friend_sent);
            add_friend = rootView.findViewById(R.id.friend_no);
            remove_friend = rootView.findViewById(R.id.friend_yes);
            req_layout = rootView.findViewById(R.id.friend_req);
            accept = rootView.findViewById(R.id.accept);
            decline = rootView.findViewById(R.id.decline);

            email.setVisibility(View.GONE);
            req_sent.setVisibility(View.VISIBLE);
            req_sent.setText("Please wait...");

            mDialog = new ProgressDialog(rootView.getContext());
            mDialog.setMessage("Please wait..");
            mDialog.setIndeterminate(true);
            mDialog.setCanceledOnTouchOutside(false);
            mDialog.setCancelable(false);
            statsheetView = requireActivity().getLayoutInflater().inflate(R.layout.stat_bottom_sheet_dialog, null);
            mmBottomSheetDialog = new BottomSheetDialog(requireContext());
            mmBottomSheetDialog.setContentView(statsheetView);
            mmBottomSheetDialog.setCanceledOnTouchOutside(true);

            rcv = rootView.findViewById(R.id.hdrh);
            rcv.setVisibility(View.VISIBLE);
            LinearLayoutManager layoutManager = new LinearLayoutManager(rootView.getContext());
            rcv.setHasFixedSize(true);
            rcv.setLayoutManager(layoutManager);
            rcv.setAdapter(mAdapter);
            loadPosts();




            mFirestore.collection("Users")
                    .document(id)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        try {
                            friend_name = documentSnapshot.getString("name");
                            namee = friend_name;
                            friend_email = documentSnapshot.getString("email");
                            friend_image = documentSnapshot.getString("image");
                            imagee = friend_image;
                            type = Long.parseLong(Objects.requireNonNull(documentSnapshot.get("type")).toString());

                            float win = (float) Integer.parseInt(Objects.requireNonNull(documentSnapshot.get("win")).toString());
                            float lose = (float) Integer.parseInt(Objects.requireNonNull(documentSnapshot.get("lose")).toString());
                            float draw = (float) Integer.parseInt(Objects.requireNonNull(documentSnapshot.get("draw")).toString());

                            name.setText(friend_name);
                            email.setText(friend_email);
                            int score = Objects.requireNonNull(documentSnapshot.getLong("score")).intValue();
                            scoreTV.setText(String.valueOf(score));
                            setLevelByScore(levelTV, score);
                            if(Objects.requireNonNull(documentSnapshot.getString("location")).length()<1){
                                location.setVisibility(View.GONE);
                            }else{
                                location.setText(documentSnapshot.getString("location"));
                            }
                            bio.setText(documentSnapshot.getString("bio"));

                            String dept = Objects.requireNonNull(documentSnapshot.getString("dept")) ;
                            String institutee = Objects.requireNonNull(documentSnapshot.getString("institute")) ;


                            if(dept.length() > 1 && institutee.length() > 1) {
                                institute.setText(dept + ", " + institutee);
                            }else if (dept.length()<1) {
                                institute.setText(institutee);
                            } else if (institutee.length()<1) {
                                institute.setText(dept);
                            }
                            if(dept.length()<1 && institutee.length() < 1){
                                institute.setVisibility(View.GONE);
                            }

                            Glide.with(requireActivity())
                                    .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                    .load(friend_image)
                                    .into(profile_pic);
                        } catch (NullPointerException ignored) {

                        }
                    });

            mFirestore.collection("Users")
                    .document(currentUser.getUid())
                    .collection("Friends")
                    .document(id)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {

                        if (documentSnapshot.exists()) {
                            req_sent.setVisibility(View.GONE);
                            showRemoveButton();
                        } else {
                            mFirestore.collection("Users")
                                    .document(id)
                                    .collection("Friend_Requests")
                                    .document(currentUser.getUid())
                                    .get()
                                    .addOnSuccessListener(documentSnapshot12 -> {
                                        if (!documentSnapshot12.exists()) {

                                            mFirestore.collection("Users")
                                                    .document(currentUser.getUid())
                                                    .collection("Friend_Requests")
                                                    .document(id)
                                                    .get()
                                                    .addOnSuccessListener(documentSnapshot1 -> {
                                                        if (documentSnapshot1.exists()) {
                                                            req_sent.setVisibility(View.GONE);
                                                            showRequestLayout();
                                                        } else {
                                                            req_sent.setVisibility(View.GONE);
                                                            showAddButton();
                                                        }

                                                    })
                                                    .addOnFailureListener(e -> Log.w("error", "fail", e));

                                        } else {
                                            req_sent.setText("Friend request sent");
                                            req_sent.setVisibility(View.VISIBLE);
                                            req_sent.setAlpha(0.0f);

                                            req_sent.animate()
                                                    .setDuration(200)
                                                    .alpha(1.0f)
                                                    .start();
                                        }
                                    }).addOnFailureListener(e -> Log.w("error", "fail", e));

                        }

                    })
                    .addOnFailureListener(e -> Log.w("error", "fail", e));


            mFirestore.collection("Users")
                    .document(id)
                    .collection("Friends")
                    .get()
                    .addOnSuccessListener(documentSnapshots -> {
                        //Total Friends
                        friend.setText(String.format(Locale.ENGLISH, "%d", documentSnapshots.size()));
                    });

            FirebaseFirestore.getInstance().collection("Posts")
                    .whereEqualTo("userId", id)
                    .get()
                    .addOnSuccessListener(querySnapshot -> post.setText(String.format(Locale.ENGLISH, "%d", querySnapshot.size())));


            playMatchs.setOnClickListener(view -> {
                Intent goBattle = new Intent(getActivity(), SelectTopic.class);
                goBattle.putExtra("otherUid", id);
                goBattle.putExtra("type", type);
                requireActivity().startActivity(goBattle);
            });

            levelTV.setOnClickListener(view -> Toasty.info(requireContext(), friend_name+"'s current level is "+levelTV.getText().toString(), Toast.LENGTH_SHORT).show());
            scoreTV.setOnClickListener(view -> Toasty.info(requireContext(), friend_name+"'s current score is "+scoreTV.getText().toString(), Toast.LENGTH_SHORT).show());
            friend.setOnClickListener(view -> Toasty.info(requireContext(), friend_name+"'s total friends count is  "+friend.getText().toString(), Toast.LENGTH_SHORT).show());
            post.setOnClickListener(view -> Toasty.info(requireContext(), friend_name+"'s have posted total "+post.getText().toString() + " posts.", Toast.LENGTH_SHORT).show());
            totalP.setOnClickListener(view -> Toasty.info(requireContext(), friend_name+"'s have played total "+totalP.getText().toString() + " battles.", Toast.LENGTH_SHORT).show());

            return rootView;
        }


        @SuppressLint("SetTextI18n")
        private void setLevelByScore(TextView levelTV, int score) {
            if (score <= 500) {
                levelTV.setText("1");
            } else if (score <= 1000) {
                levelTV.setText("2");
            } else if (score <= 1500) {
                levelTV.setText("3");
            } else if (score <= 2000) {
                levelTV.setText("4");
            } else if (score <= 2500) {
                levelTV.setText("5");
            } else if (score <= 3500) {
                levelTV.setText("6");
            } else if (score <= 5000) {
                levelTV.setText("7");
            } else {
                levelTV.setText("0");
            }
        }

        private void loadPosts() {
            PagedList.Config config = new PagedList.Config.Builder()
                    .setEnablePlaceholders(false)
                    .setPrefetchDistance(4)
                    .setPageSize(6)
                    .build();
            Query mQuery;
            mQuery = FirebaseFirestore.getInstance().collection("Posts").orderBy("timestamp", Query.Direction.DESCENDING).whereEqualTo("userId", id);
            FirestorePagingOptions<Post> options = new FirestorePagingOptions.Builder<Post>()
                    .setLifecycleOwner(this)
                    .setQuery(mQuery, config, Post.class)
                    .build();

            mAdapter = new FirestorePagingAdapter<Post, PostViewHolder>(options) {
                @NonNull
                @Override
                public PostViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
                    View view = getLayoutInflater().inflate(R.layout.item_feed_post, parent, false);
                    return new PostViewHolder(view);
                }

                @RequiresApi(api = Build.VERSION_CODES.R)
                @Override
                protected void onBindViewHolder(@NonNull PostViewHolder holder, int position, @NonNull Post post) {
                    holder.bind(post, holder, position, mmBottomSheetDialog, statsheetView, true);
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
                            // refreshLayout.setRefreshing(true);
                            break;

                        case LOADED:
                            break;

                        case ERROR:
                            Toast.makeText(
                                    getActivity(),
                                    "Error Occurred!",
                                    Toast.LENGTH_SHORT
                            ).show();

                            //refreshLayout.setRefreshing(false);
                            break;

                        case FINISHED:
                            // refreshLayout.setRefreshing(false);
                            break;
                    }
                }

            };
            rcv.setAdapter(mAdapter);
        }

        private void showRequestLayout() {
            req_layout.setVisibility(View.VISIBLE);
            req_layout.setAlpha(0.0f);
            req_layout.animate()
                    .setDuration(200)
                    .alpha(1.0f)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            super.onAnimationEnd(animation);

                            accept.setOnClickListener(v -> new DialogSheet(rootView.getContext())
                                    .setTitle("Accept Friend Request")
                                    .setMessage("Are you sure do you want to accept " + friend_name + "'s friend request?")
                                    .setPositiveButton("Yes", v12 -> acceptRequest())
                                    .setNegativeButton("No", v1 -> {

                                    })
                                    .setColoredNavigationBar(true)
                                    .setRoundedCorners(true)
                                    .setCancelable(true)
                                    .show());

                            decline.setOnClickListener(v -> new DialogSheet(rootView.getContext())
                                    .setTitle("Decline Friend Request")
                                    .setMessage("Are you sure do you want to decline " + name + "'s friend request?")
                                    .setPositiveButton("Yes", v13 -> declineRequest())
                                    .setNegativeButton("No", v14 -> {

                                    })
                                    .setRoundedCorners(true)
                                    .setColoredNavigationBar(true)
                                    .setCancelable(true)
                                    .show());

                        }


                    }).start();


        }

        private void showAddButton() {
            add_friend.setVisibility(View.VISIBLE);
            add_friend.setAlpha(0.0f);
            add_friend.animate()
                    .setDuration(200)
                    .alpha(1.0f)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            super.onAnimationEnd(animation);
                            add_friend.setOnClickListener(v -> new DialogSheet(rootView.getContext())
                                    .setTitle("Add Friend ")
                                    .setMessage("Are you sure do you want to send friend request to " + friend_name + " ?")
                                    .setPositiveButton("Yes", v1 -> addFriend())
                                    .setNegativeButton("No", v12 -> {

                                    })
                                    .setColoredNavigationBar(true)
                                    .setRoundedCorners(true)
                                    .setCancelable(true)
                                    .show());
                        }
                    }).start();
        }

        private void showRemoveButton() {
            isFriend=true;
            //sendMsg.setVisibility(View.VISIBLE);
            remove_friend.setVisibility(View.VISIBLE);
            remove_friend.setAlpha(0.0f);
            remove_friend.animate()
                    .setDuration(200)
                    .alpha(1.0f)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            super.onAnimationEnd(animation);
                            remove_friend.setOnClickListener(v -> new DialogSheet(rootView.getContext())
                                    .setTitle("Remove Friend ")
                                    .setMessage("Are you sure do you want to remove " + friend_name + " from your friend list?")
                                    .setPositiveButton("Yes", v12 -> removeFriend())
                                    .setNegativeButton("No", v1 -> {

                                    })
                                    .setRoundedCorners(true)
                                    .setColoredNavigationBar(true)
                                    .setCancelable(true)
                                    .show());
                        }
                    }).start();


        }

        public void acceptRequest() {
            mDialog.show();
            //Delete from friend request
            mFirestore.collection("Users")
                    .document(currentUser.getUid())
                    .collection("Friend_Requests")
                    .document(id)
                    .delete()
                    .addOnSuccessListener(aVoid -> {

                        Map<String, Object> friendInfo = new HashMap<>();
                        friendInfo.put("name", friend_name);
                        friendInfo.put("email", friend_email);
                        friendInfo.put("id", id);
                        friendInfo.put("image", friend_image);
                        friendInfo.put("notification_id", String.valueOf(System.currentTimeMillis()));
                        friendInfo.put("timestamp", String.valueOf(System.currentTimeMillis()));

                        //Add data friend to current user
                        mFirestore.collection("Users/" + currentUser.getUid() + "/Friends/")
                                .document(id)
                                .set(friendInfo)
                                .addOnSuccessListener(aVoid13 -> {

                                    //get the current user data
                                    mFirestore.collection("Users")
                                            .document(currentUser.getUid())
                                            .get()
                                            .addOnSuccessListener(documentSnapshot -> {

                                                String name_c = documentSnapshot.getString("name");
                                                final String email_c = documentSnapshot.getString("email");
                                                final String id_c = documentSnapshot.getId();
                                                String image_c = documentSnapshot.getString("image");
                                                String username_c = documentSnapshot.getString("username");
                                                List<String> tokens_c;
                                                //noinspection unchecked
                                                tokens_c = (List<String>) documentSnapshot.get("token_ids");

                                                final Map<String, Object> currentuserInfo = new HashMap<>();
                                                currentuserInfo.put("name", name_c);
                                                currentuserInfo.put("email", email_c);
                                                currentuserInfo.put("id", id_c);
                                                currentuserInfo.put("image", image_c);
                                                currentuserInfo.put("token_ids", tokens_c);
                                                currentuserInfo.put("notification_id", String.valueOf(System.currentTimeMillis()));
                                                currentuserInfo.put("timestamp", String.valueOf(System.currentTimeMillis()));

                                                //Save current user data to Friend
                                                mFirestore.collection("Users/" + id + "/Friends/")
                                                        .document(id_c)
                                                        .set(currentuserInfo)
                                                        .addOnSuccessListener(aVoid12 -> mFirestore.collection("Notifications")
                                                                .document(id)
                                                                .collection("Accepted_Friend_Requests")
                                                                .document(email_c)
                                                                .set(currentuserInfo)
                                                                .addOnSuccessListener(aVoid1 -> addToNotification(id,
                                                                        id_c,
                                                                        image_c,
                                                                        username_c,
                                                                        "Accepted your friend request",
                                                                        "accept_friend_req"))
                                                                .addOnFailureListener(e -> Log.e("Error", e.getMessage()))).addOnFailureListener(e -> {
                                                    mDialog.dismiss();
                                                    Log.w("fourth", "listen:error", e);
                                                });

                                            }).addOnFailureListener(e -> {
                                        mDialog.dismiss();
                                        Log.w("third", "listen:error", e);
                                    });


                                }).addOnFailureListener(e -> {
                                    mDialog.dismiss();
                                    Log.w("second", "listen:error", e);
                                });

                    }).addOnFailureListener(e -> {
                        mDialog.dismiss();
                        Log.w("first", "listen:error", e);
                    });

        }

        private void declineRequest() {

            try {
                //delete friend request data
                mFirestore.collection("Users").document(currentUser.getUid())
                        .collection("Friend_Requests").document(id).delete().addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Toasty.success(rootView.getContext(), "Friend request denied", Toasty.LENGTH_SHORT, true).show();

                        req_layout.animate()
                                .alpha(0.0f)
                                .setDuration(200)
                                .setListener(new AnimatorListenerAdapter() {
                                    @Override
                                    public void onAnimationEnd(Animator animation) {
                                        super.onAnimationEnd(animation);
                                        req_layout.setVisibility(View.GONE);
                                        showAddButton();
                                    }
                                }).start();

                    }
                }).addOnFailureListener(e -> Log.i("Error decline", e.getMessage()));
            } catch (Exception ex) {
                Log.w("error", "fail", ex);
                Toasty.error(rootView.getContext(), "Some error occurred while declining friend request, Try again later.", Toasty.LENGTH_SHORT, true).show();
            }
        }

        public void addFriend() {
            FirebaseFirestore.getInstance()
                    .collection("Users")
                    .document(id)
                    .collection("Friends")
                    .document(currentUser.getUid())
                    .get()
                    .addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                        @Override
                        public void onSuccess(DocumentSnapshot documentSnapshot) {

                            if (!documentSnapshot.exists()) {

                                FirebaseFirestore.getInstance()
                                        .collection("Users")
                                        .document(id)
                                        .collection("Friend_Requests")
                                        .document(currentUser.getUid())
                                        .get()
                                        .addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                                            @Override
                                            public void onSuccess(DocumentSnapshot documentSnapshot) {

                                                if (!documentSnapshot.exists()) {
                                                    executeFriendReq();
                                                } else {

                                                    add_friend.animate()
                                                            .alpha(0.0f)
                                                            .setDuration(200)
                                                            .setListener(new AnimatorListenerAdapter() {
                                                                @Override
                                                                public void onAnimationEnd(Animator animation) {
                                                                    super.onAnimationEnd(animation);
                                                                    add_friend.setVisibility(View.GONE);
                                                                    req_sent.setVisibility(View.VISIBLE);
                                                                    req_sent.setAlpha(0.0f);

                                                                    req_sent.animate()
                                                                            .setDuration(200)
                                                                            .alpha(1.0f)
                                                                            .start();
                                                                }
                                                            }).start();


                                                    Toasty.info(rootView.getContext(), "Friend request has been sent already", Toasty.LENGTH_SHORT, true).show();
                                                }

                                            }
                                        });
                            }

                        }
                    });

        }


        private void executeFriendReq() {

            final Map<String, Object> userMap = new HashMap<>();

            FirebaseFirestore.getInstance()
                    .collection("Users")
                    .document(userId)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {

                        final String email = documentSnapshot.getString("email");

                        userMap.put("name", documentSnapshot.getString("name"));
                        userMap.put("id", documentSnapshot.getString("id"));
                        userMap.put("email", email);
                        userMap.put("image", documentSnapshot.getString("image"));
                        userMap.put("tokens", documentSnapshot.get("token_ids"));
                        userMap.put("notification_id", String.valueOf(System.currentTimeMillis()));
                        userMap.put("timestamp", String.valueOf(System.currentTimeMillis()));

                        //Add to user
                        FirebaseFirestore.getInstance()
                                .collection("Users")
                                .document(id)
                                .collection("Friend_Requests")
                                .document(Objects.requireNonNull(documentSnapshot.getString("id")))
                                .set(userMap)
                                .addOnSuccessListener(aVoid -> {

                                    //Add for notification data
                                    assert email != null;
                                    FirebaseFirestore.getInstance()
                                            .collection("Notifications")
                                            .document(id)
                                            .collection("Friend_Requests")
                                            .document(email)
                                            .set(userMap)
                                            .addOnSuccessListener(aVoid1 -> addToNotification(id,
                                                    userId,
                                                    documentSnapshot.getString("image"),
                                                    documentSnapshot.getString("username"),
                                                    "Sent you friend request",
                                                    "friend_req")).addOnFailureListener(e -> Log.e("Error", e.getMessage()));


                                }).addOnFailureListener(e -> Log.e("Error", e.getMessage()));

                    });

        }

        public void removeFriend() {
            mFirestore.collection("Users").document(currentUser.getUid())
                    .collection("Friends").document(id).delete().addOnSuccessListener(new OnSuccessListener<Void>() {
                @Override
                public void onSuccess(Void aVoid) {
                    FirebaseFirestore.getInstance()
                            .collection("Users")
                            .document(id)
                            .collection("Friends")
                            .document(currentUser.getUid())
                            .delete()
                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                @Override
                                public void onSuccess(Void aVoid) {
                                    Toasty.success(rootView.getContext(), "Friend removed successfully", Toasty.LENGTH_SHORT, true).show();
                                    remove_friend.animate()
                                            .alpha(0.0f)
                                            .setDuration(200)
                                            .setListener(new AnimatorListenerAdapter() {
                                                @Override
                                                public void onAnimationEnd(Animator animation) {
                                                    super.onAnimationEnd(animation);
                                                    remove_friend.setVisibility(View.GONE);
                                                    showAddButton();
                                                }
                                            }).start();
                                }
                            });

                }
            }).addOnFailureListener(e -> Log.e("Error", e.getMessage()));

        }

        @SuppressLint("SetTextI18n")
        private void addToNotification(String admin_id, String user_id, String profile, String username, String message, String type) {
            Notification notification = new Notification(admin_id,admin_id, username, profile, message, String.valueOf(System.currentTimeMillis()), type, user_id, false);
            if (!admin_id.equals(user_id)) {
                mFirestore.collection("Users")
                        .document(admin_id)
                        .collection("Info_Notifications").document(notification.getId())
                        .set(notification)
                        .addOnSuccessListener(documentReference -> {
                            new SendNotificationAsyncTask(notification).execute();
                            if (type.equals("friend_req")) {
                                req_sent.setText("Friend request sent");
                                Toasty.success(rootView.getContext(), "Friend request sent.", Toasty.LENGTH_SHORT, true).show();
                                add_friend.animate()
                                        .alpha(0.0f)
                                        .setDuration(200)
                                        .setListener(new AnimatorListenerAdapter() {
                                            @Override
                                            public void onAnimationEnd(Animator animation) {
                                                super.onAnimationEnd(animation);
                                                add_friend.setVisibility(View.GONE);
                                                req_sent.setVisibility(View.VISIBLE);
                                                req_sent.setAlpha(0.0f);
                                                req_sent.animate()
                                                        .setDuration(200)
                                                        .alpha(1.0f)
                                                        .start();
                                            }
                                        }).start();
                            } else {
                                mDialog.dismiss();
                                Toasty.success(rootView.getContext(), "Friend request accepted", Toasty.LENGTH_SHORT, true).show();

                                req_layout.animate()
                                        .alpha(0.0f)
                                        .setDuration(200)
                                        .setListener(new AnimatorListenerAdapter() {
                                            @Override
                                            public void onAnimationEnd(Animator animation) {
                                                super.onAnimationEnd(animation);
                                                req_layout.setVisibility(View.GONE);
                                                showRemoveButton();
                                            }
                                        }).start();
                            }

                        })
                        .addOnFailureListener(e -> Log.e("Error", e.getLocalizedMessage()));
            }
        }
    }

    @SuppressWarnings("NullableProblems")
    private static class SendNotificationAsyncTask extends AsyncTask<Void, Void, Void> {
        final APIService apiService;
        final Notification notification;

        private SendNotificationAsyncTask(Notification notification) {
            this.notification = notification;
            apiService = Client.getClient("https://fcm.googleapis.com/").create(APIService.class);
        }

        @Override
        protected Void doInBackground(Void... jk) {
            FirebaseDatabase.getInstance().getReference().child("Tokens").child(notification.getId()).child("token").addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    String usertoken = dataSnapshot.getValue(String.class);
                    NotificationSender sender = new NotificationSender(notification, usertoken);
                    apiService.sendNotifcation(sender).enqueue(new Callback<MyResponse>() {
                        @Override
                        public void onResponse(@NonNull Call<MyResponse> call, @NonNull Response<MyResponse> response) {
                        }

                        @Override
                        public void onFailure(@NonNull Call<MyResponse> call, Throwable t) {

                        }
                    });
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {

                }
            });
            return null;
        }
    }

    @Override
    protected void onDestroy() {
        id=namee=imagee=null;
        isFriend=false;
        super.onDestroy();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.chat, menu);

        MenuItem chat = menu.getItem(0);
        return true;
    }
    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.chat) {
            if(isFriend) {
                if (id != null && namee != null && imagee != null) {
                    try {
                        Intent intent = new Intent(getApplicationContext(), MessageActivity.class);
                        intent.putExtra("userid", id);
                        intent.putExtra("name", namee);
                        intent.putExtra("image", imagee);
                        startActivity(intent);
                    } catch (Exception ignored) {

                    }
                }
            }else{
                Toasty.info(this, "You are not Friend with "+namee+ ". Be friend with him to start chat", Toast.LENGTH_SHORT).show();
            }
        }else if(item.getItemId() == R.id.copy){
            if(id!=null && namee != null && imagee != null) {
                String text = "http://3.208.28.247:3000/user/"+id;
                setClipboard(getApplicationContext(), text);
            }
        }
        return super.onOptionsItemSelected(item);
    }
    @SuppressLint("ObsoleteSdkInt")
    private void setClipboard(Context context, String text) {
        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.HONEYCOMB) {
            android.text.ClipboardManager clipboard = (android.text.ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
            clipboard.setText(text);
        } else {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("Copied Text", text);
            clipboard.setPrimaryClip(clip);
        }
        Toast.makeText(context, "Profile link copied", Toast.LENGTH_SHORT).show();
    }
}