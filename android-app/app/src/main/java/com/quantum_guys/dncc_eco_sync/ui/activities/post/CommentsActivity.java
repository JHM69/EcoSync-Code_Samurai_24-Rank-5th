package com.quantum_guys.dncc_eco_sync.ui.activities.post;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.ADMIN_UID_LIST;
import static com.quantum_guys.dncc_eco_sync.ui.activities.post.PostText.getSaltString;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.transition.Explode;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.ViewPager;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.github.ivbaranov.mfb.MaterialFavoriteButton;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.CommentsAdapter;
import com.quantum_guys.dncc_eco_sync.adapters.PostPhotosAdapter;
import com.quantum_guys.dncc_eco_sync.models.Comment;
import com.quantum_guys.dncc_eco_sync.models.MultipleImage;
import com.quantum_guys.dncc_eco_sync.models.Notification;
import com.quantum_guys.dncc_eco_sync.models.Post;
import com.quantum_guys.dncc_eco_sync.models.Users;
import com.quantum_guys.dncc_eco_sync.notification.APIService;
import com.quantum_guys.dncc_eco_sync.notification.Client;
import com.quantum_guys.dncc_eco_sync.notification.MyResponse;
import com.quantum_guys.dncc_eco_sync.notification.NotificationSender;
import com.quantum_guys.dncc_eco_sync.repository.UserRepository;
import com.quantum_guys.dncc_eco_sync.ui.activities.volunteer.FriendProfile;
import com.quantum_guys.dncc_eco_sync.ui.fragment.Home;
import com.quantum_guys.dncc_eco_sync.utils.AnimationUtil;
import com.quantum_guys.dncc_eco_sync.utils.MathView;
import com.quantum_guys.dncc_eco_sync.utils.RichEditor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Timer;
import java.util.TimerTask;

import de.hdodenhof.circleimageview.CircleImageView;
import es.dmoral.toasty.Toasty;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


@RequiresApi(api = Build.VERSION_CODES.R)
public class CommentsActivity extends AppCompatActivity {

    String user_id, post_id;
    MathView post_desc;
    TextView likeCount, saveCount;
    int likCo, saveCo, comCo;
    ProgressBar mProgress;
    String userId;
    boolean owner;
    Post post;
    CollectionReference postDb;
    Users me;
    ImageView myImage;
    List<Comment> commentList = new ArrayList<>();
    TextView CommentCount;
    RecyclerView mCommentsRecycler;
    private FirebaseFirestore mFirestore;
    private FirebaseUser mCurrentUser;
    private CircleImageView user_image;
    private MaterialFavoriteButton sav_button, like_btn;
    private FrameLayout pager_layout;
    private RelativeLayout indicator_holder;
    private ViewPager pager;
    private RichEditor mCommentText;
    private DotsIndicator indicator2;
    private CommentsAdapter mAdapter;
    TextView p_nameTV, p_instTV, timestampTV;
    boolean approved = true;
    boolean alreadyLiked;
    FrameLayout mImageholder;
    LinearLayout adminActivity;
    View vBgLike;
    ImageView ivLike;
    @SuppressLint({"SetTextI18n", "RtlHardcoded"})
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
        setContentView(R.layout.activity_post_comments);
        mFirestore = FirebaseFirestore.getInstance();
        mCurrentUser = FirebaseAuth.getInstance().getCurrentUser();
        userId=FirebaseAuth.getInstance().getCurrentUser().getUid();
        user_image = findViewById(R.id.comment_admin);
        post_desc = findViewById(R.id.comment_post_desc);
        p_nameTV = findViewById(R.id.post_username);
        p_instTV = findViewById(R.id.dept_institute);
        postDb = FirebaseFirestore.getInstance().collection("Posts");
        timestampTV = findViewById(R.id.post_timestamp);
        likeCount = findViewById(R.id.like_count);
        saveCount = findViewById(R.id.save_count);
        CommentCount = findViewById(R.id.textView8);
        mCommentsRecycler = findViewById(R.id.coments);
        adminActivity = findViewById(R.id.adminActivity);
        like_btn = findViewById(R.id.like_button);
        vBgLike = findViewById(R.id.vBgLike);
        ivLike = findViewById(R.id.ivLike);
        pager = findViewById(R.id.pager);
        pager_layout = findViewById(R.id.pager_layout);
        sav_button = findViewById(R.id.save_button);
        me = new UserRepository(getApplication()).getStaticUser();
        mImageholder = findViewById(R.id.image_holder);
        indicator2 = findViewById(R.id.indicator);
        indicator_holder = findViewById(R.id.indicator_holder);


        approved = getIntent().getBooleanExtra("approveStatus", true);
        alreadyLiked = getIntent().getBooleanExtra("alreadyLiked", false);



        post = (Post) getIntent().getSerializableExtra("post");
        if(userId==null) finish();
        if(post != null) {
            setUpData(post);
        }else{
            ProgressDialog mDialog = new ProgressDialog(this);
            mDialog.setMessage("Please wait. Loading post...");
            mDialog.setIndeterminate(true);
            mDialog.setCanceledOnTouchOutside(false);
            mDialog.setCancelable(false);
            mDialog.show();
            String link = getIntent().getData().toString();
            String id = link.substring(link.lastIndexOf("/") + 1);

            FirebaseFirestore.getInstance().collection("Posts")
                    .document(id)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        mDialog.dismiss();
                        try {
                            post = documentSnapshot.toObject(Post.class);
                            if(post!=null) setUpData(post);
                            else{
                                Log.d("ErrorPost", id);
                                Toast.makeText(this, "Error Post", Toast.LENGTH_SHORT).show();
                                finish();
                            }
                        }catch (Exception a){
                            Log.d("ErrorPost", a.getLocalizedMessage());
                            Toast.makeText(this, "Error Post", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                }).addOnFailureListener(e -> {
                mDialog.dismiss();
                    Toast.makeText(CommentsActivity.this, "Post not found", Toast.LENGTH_SHORT).show();
                    finish();
                });
        }
    }

    @SuppressLint("SetTextI18n")
    void setUpData(Post post){
        if (!approved && ADMIN_UID_LIST.contains(userId)) {
            Toast.makeText(this, "Approve or Delete this Post", Toast.LENGTH_SHORT).show();
            adminActivity.setVisibility(View.VISIBLE);
            findViewById(R.id.approvePost).setOnClickListener(view -> approvePost(post));
            findViewById(R.id.deletePost).setOnClickListener(view -> deletePost(post.getPostId()));
        } else {
            adminActivity.setVisibility(View.GONE);
        }

        if (post.getImage_count() > 0) {
            mImageholder.setVisibility(View.VISIBLE);
        } else {
            mImageholder.setVisibility(View.GONE);
        }


        user_id = post.getUserId();
        post_desc.setDisplayText(post.getDescription());
        // p_instTV.setText(post.getDept() + ", " + post.getInstitute());


        try {
            if (post.getInstitute() == null) {
                p_instTV.setText(post.getDept());
            } else if (post.getDept() == null) {
                p_instTV.setText(post.getInstitute());
            } else {
                p_instTV.setText(post.getDept() + ", " + post.getInstitute());
            }
        }catch (Exception j){
            p_instTV.setText(post.getDept());
        }

        p_nameTV.setText(post.getName());
        timestampTV.setText(TimeAgo.using(Long.parseLong(Objects.requireNonNull(post.getTimestamp()))));
        setupCommentView();
        getLikeandFav(post);
        setStatData(post);

        likeCount.setOnClickListener(view -> view.getContext().startActivity(new Intent(view.getContext(), WhoLikedActivity.class).putExtra("postId", post.getPostId()).putExtra("type", "Liked_Users")));



        mCommentText = findViewById(R.id.text);
        mCommentText.setPlaceholder("Type your comment here...");
        ImageView mCommentsSend = findViewById(R.id.send);
        mProgress = findViewById(R.id.progressBar5);

        myImage = findViewById(R.id.imageView7);

        commentList = new ArrayList<>();
        mAdapter = new CommentsAdapter(commentList, this, owner, post.getComment_count());
        mCommentsSend.setOnClickListener(view -> {
            String comment = mCommentText.getHtml();
            if (!TextUtils.isEmpty(comment))
                sendComment(comment, mProgress);
            else
                AnimationUtil.shakeView(mCommentText, CommentsActivity.this);
        });

        mCommentsRecycler.setItemAnimator(new DefaultItemAnimator());
        mCommentsRecycler.setLayoutManager(new LinearLayoutManager(this));
        mCommentsRecycler.setHasFixedSize(true);
        mCommentsRecycler.setAdapter(mAdapter);

        getComments(mProgress);

        Glide.with(getApplicationContext())
                .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                .load(me.getImage())
                .into(myImage);
    }

    private void approvePost(Post post) {
        post.setLike_count(0);
        final ProgressDialog mDialog = new ProgressDialog(this);
        mDialog.setMessage("Approving...");
        mDialog.setIndeterminate(true);
        mDialog.setCancelable(false);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.show();
        postDb
                .document(post.getPostId())
                .set(post).addOnSuccessListener(aVoid -> {
            addToNotification("An Admin Approved Your Post", "post");
            mFirestore.collection("PendingPosts")
                    .document(post.getPostId()).delete();
            mDialog.dismiss();
            Toasty.success(getApplicationContext(), "Approved", Toasty.LENGTH_SHORT, true).show();
            finish();
        });

    }

    private void deletePost(String Id) {
        final ProgressDialog mDialog = new ProgressDialog(this);
        mDialog.setMessage("Removing from Approval List...");
        mDialog.setIndeterminate(true);
        mDialog.setCancelable(false);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.show();
        mFirestore.collection("PendingPosts")
                .document(Id).delete().addOnSuccessListener(aVoid -> {
                    addToNotification("An Admin Deleted Your Post, Try posting good contents only.", "");
                    mDialog.dismiss();
                    Toasty.success(getApplicationContext(), "Done", Toasty.LENGTH_SHORT, true).show();
                    finish();
                });
    }


    @SuppressLint("SetTextI18n")
    private void setupCommentView() {
        if (post.getImage_count() == 0) {
            pager_layout.setVisibility(View.GONE);
        } else if (post.getImage_count() == 1) {
            pager_layout.setVisibility(View.VISIBLE);
            ArrayList<MultipleImage> multipleImages = new ArrayList<>();
            PostPhotosAdapter photosAdapter = new PostPhotosAdapter(Home.context, this, multipleImages, false, post.getPostId(), like_btn, post.getUserId(), true);
            setUrls(multipleImages, photosAdapter, post);
            pager.setAdapter(photosAdapter);
            indicator_holder.setVisibility(View.GONE);
            photosAdapter.notifyDataSetChanged();
            pager_layout.setVisibility(View.VISIBLE);
        } else {
            ArrayList<MultipleImage> multipleImages = new ArrayList<>();
            PostPhotosAdapter photosAdapter = new PostPhotosAdapter(Home.context, this, multipleImages, false, post.getPostId(), like_btn, post.getUserId(), true);
            setUrls(multipleImages, photosAdapter, post);

            pager.setAdapter(photosAdapter);
            photosAdapter.notifyDataSetChanged();
            indicator2.setDotsClickable(true);
            indicator2.setViewPager(pager);

            final Handler handler = new Handler();
            final Runnable slide = () -> {
                if (pager.getCurrentItem() == multipleImages.size()) {
                    pager.setCurrentItem(0, true);
                    return;
                }
                pager.setCurrentItem(pager.getCurrentItem() + 1, true);
            };
            Timer slideTimer = new Timer();
            slideTimer.schedule(new TimerTask() {
                @Override
                public void run() {
                    handler.post(slide);
                }
            }, 3000, 3000);

            pager_layout.setVisibility(View.VISIBLE);
            indicator_holder.setVisibility(View.VISIBLE);
        }

        mFirestore.collection("Users")
                .document(user_id)
                .get()
                .addOnSuccessListener(documentSnapshot -> Glide.with(getApplicationContext())
                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                        .load(documentSnapshot.getString("image"))
                        .into(user_image))
                .addOnFailureListener(e -> Log.e("error", e.getLocalizedMessage()));
        p_nameTV.setOnClickListener(view -> {
            startActivity(new Intent(getApplicationContext(), FriendProfile.class).putExtra("f_id", post.getUserId()));
        });
        p_instTV.setOnClickListener(view -> {
            startActivity(new Intent(getApplicationContext(), FriendProfile.class).putExtra("f_id", post.getUserId()));
        });

    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransitionExit();
    }

    @Override
    public void startActivity(Intent intent) {
        super.startActivity(intent);
        overridePendingTransitionEnter();
    }

    protected void overridePendingTransitionEnter() {
        overridePendingTransition(R.anim.slide_from_right, R.anim.slide_to_left);
    }

    protected void overridePendingTransitionExit() {
        overridePendingTransition(R.anim.slide_from_left, R.anim.slide_to_right);
    }

    private void setUrls(ArrayList<MultipleImage> multipleImages, PostPhotosAdapter photosAdapter, Post post) {
        String url0, url1, url2, url3, url4, url5, url6;

        url0 = post.getImage_url_0();
        url1 = post.getImage_url_1();
        url2 = post.getImage_url_2();
        url3 = post.getImage_url_3();
        url4 = post.getImage_url_4();
        url5 = post.getImage_url_5();
        url6 = post.getImage_url_6();

        if (!TextUtils.isEmpty(url0)) {
            MultipleImage image = new MultipleImage(url0);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("url0", url0);
        }

        if (!TextUtils.isEmpty(url1)) {
            MultipleImage image = new MultipleImage(url1);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("url1", url1);
        }

        if (!TextUtils.isEmpty(url2)) {
            MultipleImage image = new MultipleImage(url2);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("url2", url2);
        }

        if (!TextUtils.isEmpty(url3)) {
            MultipleImage image = new MultipleImage(url3);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("url3", url3);
        }

        if (!TextUtils.isEmpty(url4)) {
            MultipleImage image = new MultipleImage(url4);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("url4", url4);
        }

        if (!TextUtils.isEmpty(url5)) {
            MultipleImage image = new MultipleImage(url5);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("url5", url5);
        }

        if (!TextUtils.isEmpty(url6)) {
            MultipleImage image = new MultipleImage(url6);
            multipleImages.add(image);
            photosAdapter.notifyDataSetChanged();
            Log.i("ur6", url6);
        }


    }

    public boolean isOnline() {
        ConnectivityManager cm =
                (ConnectivityManager) Home.context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return netInfo != null && netInfo.isConnectedOrConnecting();
    }

    private void getLikeandFav(Post post) {
        like_btn.setFavorite(alreadyLiked);
        like_btn.setOnFavoriteChangeListener((buttonView, favorite) -> {
            updateLike(post.getPostId());
        });


        try {
            postDb.document(post.getPostId())
                    .collection("Saved_Users")
                    .document(mCurrentUser.getUid())
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {

                        if (documentSnapshot.exists()) {
                            boolean fav = documentSnapshot.getBoolean("Saved");

                            sav_button.setFavorite(fav, false);
                        } else {
                            Log.e("Fav", "No document found");

                        }

                        if (isOnline()) {
                            sav_button.setOnFavoriteChangeListener((buttonView, favorite) -> {
                                Map<String, Object> favMap = new HashMap<>();
                                if (favorite) {
                                    favMap.put("Saved", true);

                                    try {

                                        mFirestore.collection("Posts")
                                                .document(post.getPostId())
                                                .collection("Saved_Users")
                                                .document(mCurrentUser.getUid())
                                                .set(favMap)
                                                .addOnSuccessListener(aVoid -> {
                                                    saveCo++;
                                                    saveCount.setText(String.valueOf(saveCo));

                                                    Map<String, Object> postMap = new HashMap<>();
                                                    postMap.put("postId", post.getPostId());
                                                    postMap.put("userId", post.getUserId());
                                                    postMap.put("name", post.getName());
                                                    postMap.put("username", post.getUsername());
                                                    postMap.put("institute", post.getInstitute());
                                                    postMap.put("dept", post.getDept());
                                                    postMap.put("timestamp", post.getTimestamp());
                                                    postMap.put("image_count", post.getImage_count());
                                                    postMap.put("description", post.getDescription());

                                                    try {
                                                        postMap.put("image_url_0", post.getImage_url_0());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    try {
                                                        postMap.put("image_url_1", post.getImage_url_1());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    try {
                                                        postMap.put("image_url_2", post.getImage_url_2());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    try {
                                                        postMap.put("image_url_3", post.getImage_url_3());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    try {
                                                        postMap.put("image_url_4", post.getImage_url_4());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    try {
                                                        postMap.put("image_url_5", post.getImage_url_5());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    try {
                                                        postMap.put("image_url_6", post.getImage_url_6());
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }

                                                    mFirestore.collection("Users")
                                                            .document(mCurrentUser.getUid())
                                                            .collection("Saved_Posts")
                                                            .document(post.getPostId())
                                                            .set(postMap)
                                                            .addOnSuccessListener(aVoid12 -> {
                                                                // Toast.makeText(context, "Added to Saved_Posts, post '" + post.postId, Toast.LENGTH_SHORT).show();
                                                            }).addOnFailureListener(e -> Log.e("Error add fav", e.getMessage()));
                                                })
                                                .addOnFailureListener(e -> Log.e("Error fav", e.getMessage()));
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                } else {
                                    favMap.put("Saved", false);
                                    try {
                                        mFirestore.collection("Posts")
                                                .document(post.getPostId())
                                                .collection("Saved_Users")
                                                .document(mCurrentUser.getUid())
                                                //.set(favMap)
                                                .delete()
                                                .addOnSuccessListener(aVoid -> {
                                                    saveCo--;
                                                    saveCount.setText(String.valueOf(saveCo));
                                                    mFirestore.collection("Users")
                                                            .document(mCurrentUser.getUid())
                                                            .collection("Saved_Posts")
                                                            .document(post.getPostId())
                                                            .delete()
                                                            .addOnSuccessListener(aVoid1 -> {
                                                                // Toast.makeText(context, "Removed from Saved_Posts, post '" + post.postId, Toast.LENGTH_SHORT).show();
                                                            })
                                                            .addOnFailureListener(e -> Log.e("Error remove fav", e.getMessage()));

                                                })
                                                .addOnFailureListener(e -> Log.e("Error fav", e.getMessage()));

                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                            });
                        }
                    })
                    .addOnFailureListener(e -> Log.e("Error Fav", e.getMessage()));
        } catch (NullPointerException ignored) {
        }
    }

    @SuppressLint("SetTextI18n")
    void setStatData(Post post) {
        likeCount.setText(String.valueOf(post.getLiked_count()));
    }

    @SuppressLint("SetTextI18n")
    public void updateLike(String postId) {
        int postLikes = post.getLiked_count();
        if(!alreadyLiked){
            postLikes++;
            try {
                Map<String, Boolean> likeMap = new HashMap<>();
                likeMap.put("liked", true);
                postDb.document(postId)
                        .collection("Liked_Users")
                        .document(mCurrentUser.getUid())
                        .set(likeMap)
                        .addOnSuccessListener(aVoid -> {
                            alreadyLiked=true;
                                addToNotification("Liked your post", "like");
                        })
                        .addOnFailureListener(e -> Log.e("Error like", e.getMessage()));
            } catch (Exception ignored) {
            }
        }else{
            postLikes--;
            try {
                mFirestore.collection("Posts")
                        .document(postId)
                        .collection("Liked_Users")
                        .document(mCurrentUser.getUid())
                        //.set(likeMap)
                        .delete()
                        .addOnSuccessListener(aVoid -> {
                            alreadyLiked=true;
                            //holder.like_count.setText(String.valueOf(Integer.parseInt(holder.like_count.getText().toString())-1));
                            //Toast.makeText(context, "Unliked post '" + post.postId, Toast.LENGTH_SHORT).show();
                        })
                        .addOnFailureListener(e -> Log.e("Error unlike", e.getMessage()));
            } catch (Exception ignored) {
            }
        }
        likeCount.setText(String.valueOf(postLikes));
        HashMap<String, Object> scoreMap = new HashMap<>();
        scoreMap.put("liked_count", postLikes);
        mFirestore
                .collection("Posts")
                .document(postId)
                .update(scoreMap).addOnSuccessListener(aVoid -> {
        });
    }

    @SuppressLint("SetTextI18n")
    public void updateComment() {
        try {
            int com_count = post.getComment_count()+1;
            HashMap<String, Object> scoreMap = new HashMap<>();
            scoreMap.put("comment_count", com_count);
            mFirestore.collection("Posts")
                    .document(post.getPostId())
                    .update(scoreMap).addOnSuccessListener(aVoid -> {
                        CommentCount.setText("   "+com_count);
            });
        } catch (NullPointerException ignored) {

        }
    }
    private void addToNotification(String message, String type) {
        if (!post.getUserId().equals(me.getId())) {
            Notification notification = new Notification(post.getPostId(),post.getUserId(), me.getName(), me.getImage(), message, String.valueOf(System.currentTimeMillis()), type, post.getPostId(), false);
            mFirestore.collection("Users")
                    .document(post.getUserId())
                    .collection("Info_Notifications")
                    .document(notification.getId()).set(notification)
                    .addOnSuccessListener(documentReference -> new SendNotificationAsyncTask(notification).execute())
                    .addOnFailureListener(e -> Log.e("Error", e.getLocalizedMessage()));
        }
    }

    public void finishThis(View v) {
        finish();
        overridePendingTransitionExit();
    }

    @SuppressLint("NotifyDataSetChanged")
    private void sendComment(final String comment, final ProgressBar mProgress) {
        mProgress.setVisibility(View.VISIBLE);
        String commentId = getSaltString();
        Comment comment1 = new Comment(me.getId(), me.getName(), me.getImage(), post.getPostId(), comment, String.valueOf(System.currentTimeMillis()), commentId);
        mCommentText.setHtml("");
        mFirestore.collection("Posts")
                .document(post.getPostId())
                .collection("Comments")
                .document(commentId)
                .set(comment1)
                .addOnSuccessListener(documentReference -> {
                    mProgress.setVisibility(View.GONE);
                    addToNotification("Commented on your post", "comment");
                    updateComment();
                    Toasty.success(CommentsActivity.this, "Comment added", Toasty.LENGTH_SHORT, true).show();
                    mAdapter.notifyDataSetChanged();
                })
                .addOnFailureListener(e -> {
                    mCommentText.setHtml(comment1.getComment());
                    mProgress.setVisibility(View.GONE);
                    Toasty.error(CommentsActivity.this, "Error adding comment: " + e.getMessage(), Toasty.LENGTH_SHORT, true).show();
                    Log.e("Error sending comment", Objects.requireNonNull(e.getMessage()));
                });

    }


    @SuppressLint({"SetTextI18n", "NotifyDataSetChanged"})
    private void getComments(final ProgressBar mProgress) {
        CommentCount.setText("   " + post.getComment_count());
        mProgress.setVisibility(View.VISIBLE);
        mFirestore.collection("Posts")
                .document(post.getPostId())
                .collection("Comments")
                .orderBy("timestamp", Query.Direction.DESCENDING).limit(15)
                .addSnapshotListener(this, (querySnapshot, e) -> {
                    if (e != null) {
                        mProgress.setVisibility(View.GONE);
                        e.printStackTrace();
                        return;
                    }
                    assert querySnapshot != null;
                    if (!querySnapshot.isEmpty()) {
                        for (DocumentChange doc : querySnapshot.getDocumentChanges()) {
                            if (doc.getDocument().exists()) {
                                if (doc.getType() == DocumentChange.Type.ADDED) {
                                    mProgress.setVisibility(View.GONE);
                                    Comment comment = doc.getDocument().toObject(Comment.class);
                                    commentList.add(comment);
                                    mAdapter.notifyDataSetChanged();
                                }
                            }
                        }
                        if (commentList.isEmpty()) {
                            mProgress.setVisibility(View.GONE);
                        }
                    } else {
                        mProgress.setVisibility(View.GONE);
                    }


                });
    }

    private static class SendNotificationAsyncTask extends AsyncTask<Void, Void, Void> {
        final APIService apiService;
        final Notification notification;

        private SendNotificationAsyncTask(Notification notification) {
            this.notification = notification;
            apiService = Client.getClient("https://fcm.googleapis.com/").create(APIService.class);
        }

        @Override
        protected Void doInBackground(Void... jk) {
            FirebaseDatabase.getInstance().getReference().child("Tokens").child(notification.getNotifyTo()).child("token").addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    String usertoken = dataSnapshot.getValue(String.class);
                    NotificationSender sender = new NotificationSender(notification, usertoken);
                    apiService.sendNotifcation(sender).enqueue(new Callback<MyResponse>() {
                        @Override
                        public void onResponse(@NonNull Call<MyResponse> call, @NonNull Response<MyResponse> response) {
                        }

                        @Override
                        public void onFailure(@NonNull Call<MyResponse> call, @NonNull Throwable t) {

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

}