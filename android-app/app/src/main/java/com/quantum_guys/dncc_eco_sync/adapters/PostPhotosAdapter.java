package com.quantum_guys.dncc_eco_sync.adapters;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Parcelable;
import android.util.Log;
import android.view.GestureDetector;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.DecelerateInterpolator;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ViewModelProviders;
import androidx.viewpager.widget.PagerAdapter;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.github.ivbaranov.mfb.MaterialFavoriteButton;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.MultipleImage;
import com.quantum_guys.dncc_eco_sync.models.Notification;
import com.quantum_guys.dncc_eco_sync.notification.APIService;
import com.quantum_guys.dncc_eco_sync.notification.Client;
import com.quantum_guys.dncc_eco_sync.notification.MyResponse;
import com.quantum_guys.dncc_eco_sync.notification.NotificationSender;
import com.quantum_guys.dncc_eco_sync.ui.activities.notification.ImagePreviewSave;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class PostPhotosAdapter extends PagerAdapter {
    private static final DecelerateInterpolator DECCELERATE_INTERPOLATOR = new DecelerateInterpolator();
    private static final AccelerateInterpolator ACCELERATE_INTERPOLATOR = new AccelerateInterpolator();
    private final ArrayList<MultipleImage> IMAGES;
    private final boolean local;
    private final LayoutInflater inflater;
    private final Context context;
    private final String postId;
    private final String adminId;
    private final MaterialFavoriteButton like_btn;
    boolean liked = false;

    public PostPhotosAdapter(Context context, Activity activity, ArrayList<MultipleImage> IMAGES, boolean local, String postId, MaterialFavoriteButton like_btn, String adminId, boolean approved) {
        this.context = context;
        this.IMAGES = IMAGES;
        this.local = local;
        inflater = LayoutInflater.from(context);
        this.postId = postId;
        this.like_btn = like_btn;
        this.adminId = adminId;
    }

    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
        container.removeView((View) object);
    }

    @Override
    public int getCount() {
        return IMAGES.size();
    }



    private void animatePhotoLike(final View vBgLike, final ImageView ivLike, boolean like) {
        vBgLike.setVisibility(View.VISIBLE);
        ivLike.setVisibility(View.VISIBLE);
        vBgLike.setScaleY(0.1f);
        vBgLike.setScaleX(0.1f);
        vBgLike.setAlpha(1f);
        ivLike.setScaleY(0.1f);
        ivLike.setScaleX(0.1f);

        AnimatorSet animatorSet = new AnimatorSet();

        ObjectAnimator bgScaleYAnim = ObjectAnimator.ofFloat(vBgLike, "scaleY", 0.1f, 1f);
        bgScaleYAnim.setDuration(600);
        bgScaleYAnim.setInterpolator(DECCELERATE_INTERPOLATOR);
        ObjectAnimator bgScaleXAnim = ObjectAnimator.ofFloat(vBgLike, "scaleX", 0.1f, 1f);
        bgScaleXAnim.setDuration(600);
        bgScaleXAnim.setInterpolator(DECCELERATE_INTERPOLATOR);
        ObjectAnimator bgAlphaAnim = ObjectAnimator.ofFloat(vBgLike, "alpha", 1f, 0f);
        bgAlphaAnim.setDuration(600);
        bgAlphaAnim.setStartDelay(150);
        bgAlphaAnim.setInterpolator(DECCELERATE_INTERPOLATOR);

        ObjectAnimator imgScaleUpYAnim = ObjectAnimator.ofFloat(ivLike, "scaleY", 0.1f, 1f);
        imgScaleUpYAnim.setDuration(600);
        imgScaleUpYAnim.setInterpolator(DECCELERATE_INTERPOLATOR);
        ObjectAnimator imgScaleUpXAnim = ObjectAnimator.ofFloat(ivLike, "scaleX", 0.1f, 1f);
        imgScaleUpXAnim.setDuration(600);
        imgScaleUpXAnim.setInterpolator(DECCELERATE_INTERPOLATOR);

        ObjectAnimator imgScaleDownYAnim = ObjectAnimator.ofFloat(ivLike, "scaleY", 1f, 0f);
        imgScaleDownYAnim.setDuration(600);
        imgScaleDownYAnim.setInterpolator(ACCELERATE_INTERPOLATOR);
        ObjectAnimator imgScaleDownXAnim = ObjectAnimator.ofFloat(ivLike, "scaleX", 1f, 0f);
        imgScaleDownXAnim.setDuration(600);
        imgScaleDownXAnim.setInterpolator(ACCELERATE_INTERPOLATOR);

        animatorSet.playTogether(bgScaleYAnim, bgScaleXAnim, bgAlphaAnim, imgScaleUpYAnim, imgScaleUpXAnim);
        animatorSet.play(imgScaleDownYAnim).with(imgScaleDownXAnim).after(imgScaleUpYAnim);

        animatorSet.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                resetLikeAnimationState(vBgLike, ivLike);
            }

            @Override
            public void onAnimationStart(Animator animation) {
                super.onAnimationStart(animation);
                like_btn.setFavorite(like, true);
                liked = like;
                Map<String, Object> likeMap = new HashMap<>();
                likeMap.put("liked", like);
                if (!like) {
                    updateLike(false, postId);
                    FirebaseFirestore.getInstance().collection("Posts")
                            .document(postId)
                            .collection("Liked_Users")
                            .document(userId)
                            .delete();
                } else {
                    try {
                        updateLike(true, postId);
                        FirebaseFirestore.getInstance().collection("Posts")
                                .document(postId)
                                .collection("Liked_Users")
                                .document(userId)
                                .set(likeMap)
                                .addOnSuccessListener(aVoid -> {
                                    UserViewModel userViewModel = ViewModelProviders.of((FragmentActivity) context).get(UserViewModel.class);
                                    userViewModel.user.observe((LifecycleOwner) context, users -> {
                                        Notification notification = new Notification(
                                                postId,
                                                postId,
                                                users.getUsername(),
                                                users.getImage(),
                                                "Liked your post",
                                                String.valueOf(System.currentTimeMillis())
                                                , "like"
                                                , postId, false
                                        );
                                        addToNotification(adminId, notification);
                                    });
                                    /*String image = userViewModel..getImage();
                                    String username = new UserRepository((Application) context).getUser().getName();*/

                                })
                                .addOnFailureListener(e -> Log.e("Error like", e.getMessage()));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }


            }
        });
        animatorSet.start();

    }

    private void addToNotification(String admin_id, Notification notification) {
        if (!admin_id.equals(userId)) {
            FirebaseFirestore.getInstance().collection("Users")
                    .document(admin_id)
                    .collection("Info_Notifications")
                    .document(notification.getId()).set(notification)
                    .addOnSuccessListener(documentReference -> new SendNotificationAsyncTask(notification).execute())
                    .addOnFailureListener(e -> Log.e("Error", e.getLocalizedMessage()));
        }
    }

    private void resetLikeAnimationState(View vBgLike, ImageView ivLike) {
        vBgLike.setVisibility(View.INVISIBLE);
        ivLike.setVisibility(View.INVISIBLE);
    }


    @SuppressLint("ClickableViewAccessibility")
    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup view, final int position) {
        final View imageLayout = inflater.inflate(R.layout.item_viewpager_image, view, false);
        assert imageLayout != null;
        ImageView imageView = imageLayout.findViewById(R.id.image);
        final View vBgLike = imageLayout.findViewById(R.id.vBgLike);
        final ImageView ivLike = imageLayout.findViewById(R.id.ivLike);

        if (!local) {
            final GestureDetector detector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {
                @Override
                public boolean onDown(MotionEvent e) {
                    return true;
                }

                @Override
                public void onLongPress(MotionEvent e) {
                    super.onLongPress(e);
                    Intent intent = new Intent(context, ImagePreviewSave.class)
                            //.putExtra("sender_name","Posts")
                            .putExtra("url", IMAGES.get(position).getUrl());
                    context.startActivity(intent);
                }

                @Override
                public boolean onContextClick(MotionEvent e) {

                    return super.onContextClick(e);
                }

                @Override
                public boolean onDoubleTap(MotionEvent e) {

                    animatePhotoLike(vBgLike, ivLike, !liked);

                    return true;
                }
            }
            );

            imageView.setOnTouchListener((v, event) -> detector.onTouchEvent(event));
            try {
                Glide.with(context)
                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.placeholder2))
                        .load(IMAGES.get(position).getUrl())
                        .fitCenter()
                        .into(imageView);
            } catch (NullPointerException nn) {
                Toast.makeText(context, "Error", Toast.LENGTH_SHORT).show();
            }
            imageView.setOnClickListener(view1 -> {
                Intent intent = new Intent(context, ImagePreviewSave.class)
                        .putExtra("url", IMAGES.get(position).getUrl());
                context.startActivity(intent);
            });
        } else {
            imageView.setImageURI(Uri.fromFile(new File(IMAGES.get(position).getLocal_path())));


        }

        view.addView(imageLayout, 0);

        return imageLayout;
    }
    private void updateLike(boolean like, String postId) {
        try {
            FirebaseFirestore.getInstance().collection("Posts").document(postId)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {
                        try {
                            int likeNew = 0;
                            likeNew = Objects.requireNonNull(documentSnapshot.getLong("liked_count")).intValue();
                            if (like){
                                likeNew++;
                            } else {
                                likeNew--;
                            }
                            HashMap<String, Object> scoreMap = new HashMap<>();
                            scoreMap.put("liked_count", likeNew);
                            FirebaseFirestore.getInstance()
                                    .collection("Posts")
                                    .document(postId)
                                    .update(scoreMap).addOnSuccessListener(aVoid -> {

                            });
                        } catch (NullPointerException ignored) {

                        }
                    });
        } catch (NullPointerException ignored) {

        }
    }
    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view.equals(object);
    }

    @Override
    public void restoreState(Parcelable state, ClassLoader loader) {
    }

    @Override
    public Parcelable saveState() {
        return null;
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