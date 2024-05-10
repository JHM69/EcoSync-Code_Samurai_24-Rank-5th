package com.quantum_guys.dncc_eco_sync.adapters;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.ADMIN_UID_LIST;
import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityOptions;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.ViewPager;

import com.afollestad.materialdialogs.MaterialDialog;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.Issue;
import com.quantum_guys.dncc_eco_sync.models.MultipleImage;
import com.quantum_guys.dncc_eco_sync.models.Notification;
import com.quantum_guys.dncc_eco_sync.notification.APIService;
import com.quantum_guys.dncc_eco_sync.notification.Client;
import com.quantum_guys.dncc_eco_sync.notification.MyResponse;
import com.quantum_guys.dncc_eco_sync.notification.NotificationSender;
import com.quantum_guys.dncc_eco_sync.ui.activities.volunteer.FriendProfile;
import com.quantum_guys.dncc_eco_sync.ui.activities.issue.IssuesDetailsActivity;
import com.quantum_guys.dncc_eco_sync.ui.fragment.Home;
import com.quantum_guys.dncc_eco_sync.utils.MathView;
import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Timer;
import java.util.TimerTask;

import de.hdodenhof.circleimageview.CircleImageView;
import es.dmoral.toasty.Toasty;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

@SuppressWarnings("ConstantConditions")
public class IssueViewHolder extends RecyclerView.ViewHolder {
    private final FirebaseFirestore mFirestore;
    private final FirebaseUser mCurrentUser;
    private final CircleImageView user_image;
    private final TextView user_name;

    private final TextView timestamp;
    private final TextView institute_dept;
    CollectionReference IssueDb = FirebaseFirestore.getInstance().collection("Issues");
    private final MathView Issue_desc;



    private final ConstraintLayout pager_layout;
    private final RelativeLayout indicator_holder;
    private final ImageView delete;
    private final ImageView menu;
    private final ViewPager pager;
    private final DotsIndicator indicator2;
    int position;

    private Context context;
    private boolean isOwner;
    private boolean alreadyLiked=false;
    private Activity activity;
    private View mView;
    int IssueLikes;

    public IssueViewHolder(@NonNull View holder) {
        super(holder);

        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();
        mCurrentUser = mAuth.getCurrentUser();
        user_image = holder.findViewById(R.id.post_user_image);
        user_name = holder.findViewById(R.id.post_username);
        institute_dept = holder.findViewById(R.id.dept_institute);

        timestamp = holder.findViewById(R.id.post_timestamp);
        Issue_desc = holder.findViewById(R.id.post_desc);
        pager = holder.findViewById(R.id.pager);
        pager_layout = holder.findViewById(R.id.pager_layout);

        delete = holder.findViewById(R.id.delete_button);

        indicator2 = holder.findViewById(R.id.indicator);
        indicator_holder = holder.findViewById(R.id.indicator_holder);
        menu = holder.findViewById(R.id.menu_button);
    }


    @RequiresApi(api = Build.VERSION_CODES.R)
    @SuppressLint({"ResourceType", "SetTextI18n"})
    public void bind(Issue issue, final IssueViewHolder holder, int position, BottomSheetDialog mmBottomSheetDialog, View statsheetView, boolean approved) {
        Log.d("Approved", approved+" ");
        context = Home.context;
        this.position = position;




        if(issue.isAnonymous()){
            user_name.setText("Anonymous");
            user_image.setImageResource(R.drawable.logo_round);
        }else{
            user_name.setText(issue.getName());
            user_name.setOnClickListener(v -> {
                context.startActivity(new Intent(context, FriendProfile.class).putExtra("f_id", issue.getUserId()));
            });

            Glide.with(Home.context)
                    .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.placeholder))
                    .load(issue.getUserimage())
                    .into(holder.user_image);
        }




        try {
            if (issue.getInstitute() == null) {
                holder.institute_dept.setText(issue.getDept());
            } else if (issue.getDept() == null) {
                holder.institute_dept.setText(issue.getInstitute());
            } else {
                holder.institute_dept.setText(issue.getDept());
            }
        }catch (Exception j){
            holder.institute_dept.setText(issue.getDept());
        }


        String timeAgo = TimeAgo.using(Long.parseLong(issue.getTimestamp()));
        timestamp.setText(timeAgo);
        try {
            String descc = issue.getDescription();
            Issue_desc.setDisplayText((descc.length() > 597) ? descc.substring(0, 600) + "..." : descc);
            if(descc.contains("video_loading_bg.svg")){
                Issue_desc.setDisplayText((descc.length() > 1497) ? descc.substring(0, 1500) + "..." : descc);
            }
            if (issue.getImage_count() == 0) {
                pager_layout.setVisibility(View.GONE);
            }  else if (issue.getImage_count() == 1) {
                pager_layout.setVisibility(View.VISIBLE);
                ArrayList<MultipleImage> multipleImages = new ArrayList<>();
                PostPhotosAdapter photosAdapter = new PostPhotosAdapter(Home.context, activity, multipleImages, false, issue.getPostId(), null, issue.getUserId(), approved);
                setUrls(multipleImages, photosAdapter, issue);
                pager.setAdapter(photosAdapter);
                indicator_holder.setVisibility(View.GONE);
                photosAdapter.notifyDataSetChanged();
                pager_layout.setVisibility(View.VISIBLE);
                Issue_desc.setVisibility(View.VISIBLE);
            } else {
                ArrayList<MultipleImage> multipleImages = new ArrayList<>();
                PostPhotosAdapter photosAdapter = new PostPhotosAdapter(Home.context, activity, multipleImages, false, issue.getPostId(), null, issue.getUserId(), approved);
                setUrls(multipleImages, photosAdapter, issue);

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
                }, 100000, 100000);


                pager_layout.setVisibility(View.VISIBLE);
                indicator_holder.setVisibility(View.VISIBLE);
            }
        } catch (NullPointerException ignored) {

        }
        try {
            setupViews(issue);
        } catch (Exception ignored) {
        }
        menu.setOnClickListener(view -> {
           // FragmentManager fragmentManager = ((FragmentActivity) context).getSupportFragmentManager();
           // new PostMenu(issue.getPostId(), issue.getName()).show(fragmentManager, "");

        });

        if (issue.getUserId().equals(mCurrentUser.getUid()) || ADMIN_UID_LIST.contains(mCurrentUser.getUid())) {
            isOwner = true;
            delete.setVisibility(View.VISIBLE);
            delete.setOnClickListener(v -> new MaterialDialog.Builder(Home.context)
                    .title("Delete issue")
                    .content("Are you sure do you want to delete this issue?")
                    .positiveText("Yes")
                    .negativeText("No")
                    .onPositive((dialog, which) -> {

                        final ProgressDialog pdialog = new ProgressDialog(Home.context);
                        pdialog.setMessage("Please wait...");
                        pdialog.setIndeterminate(true);
                        pdialog.setCancelable(false);
                        pdialog.setCanceledOnTouchOutside(false);
                        pdialog.show();

                        dialog.dismiss();
                        IssueDb
                                .document(issue.getPostId())
                                .delete()
                                .addOnSuccessListener(aVoid -> {


                                    if (!TextUtils.isEmpty(issue.getImage_url_0())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_0());
                                        img.delete().addOnSuccessListener(aVoid1 ->
                                        {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    pdialog.show();
                                    if (!TextUtils.isEmpty(issue.getImage_url_1())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_1());
                                        img.delete().addOnSuccessListener(aVoid12 -> {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    pdialog.show();
                                    if (!TextUtils.isEmpty(issue.getImage_url_2())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_2());
                                        img.delete().addOnSuccessListener(aVoid13 -> {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    pdialog.show();
                                    if (!TextUtils.isEmpty(issue.getImage_url_3())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_3());
                                        img.delete().addOnSuccessListener(aVoid14 -> {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    pdialog.show();
                                    if (!TextUtils.isEmpty(issue.getImage_url_4())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_4());
                                        img.delete().addOnSuccessListener(aVoid15 -> {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    pdialog.show();
                                    if (!TextUtils.isEmpty(issue.getImage_url_5())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_5());
                                        img.delete().addOnSuccessListener(aVoid16 -> {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    pdialog.show();
                                    if (!TextUtils.isEmpty(issue.getImage_url_6())) {
                                        StorageReference img = FirebaseStorage.getInstance()
                                                .getReferenceFromUrl(issue.getImage_url_6());
                                        img.delete().addOnSuccessListener(aVoid17 -> {
                                            pdialog.dismiss();
                                            Log.i("issue Image", "deleted");
                                        })
                                                .addOnFailureListener(e -> Log.e("issue Image", e.getLocalizedMessage()));
                                    }

                                    Toasty.success(context, "issue deleted", Toasty.LENGTH_SHORT, true).show();

                                    pdialog.dismiss();


                                })
                                .addOnFailureListener(e -> {
                                    pdialog.dismiss();
                                    Log.e("error", e.getLocalizedMessage());
                                });

                    })
                    .onNegative((dialog, which) -> dialog.dismiss()).show());

        } else {
            isOwner = false;
            holder.delete.setVisibility(View.GONE);
        }
        try {
           if(issue.isAnonymous()){
                user_name.setText("Anonymous from "+issue.getAddress());
                user_image.setImageResource(R.drawable.logo_round);
           }else{
               mFirestore.collection("Users")
                       .document(issue.getUserId())
                       .get()
                       .addOnSuccessListener(documentSnapshot -> {
                           try {
                               if (!documentSnapshot.getString("image").equals(issue.getUserimage())) {
                                   Map<String, Object> IssueMap = new HashMap<>();
                                   IssueMap.put("name", documentSnapshot.getString("name"));
                                   IssueMap.put("userimage", documentSnapshot.getString("image"));

                                   IssueDb.document(issue.getPostId())
                                           .update(IssueMap)
                                           .addOnSuccessListener(aVoid -> Log.i("Issue_update", "success"))
                                           .addOnFailureListener(e -> Log.i("Issue_update", "failure"));

                                   user_name.setText(documentSnapshot.getString("name"));

                                   Glide.with(Home.context)
                                           .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                           .load(documentSnapshot.getString("image"))
                                           .into(user_image);
                               } else if (!Objects.equals(documentSnapshot.getString("userId"), issue.getUserId())) {
                                   Map<String, Object> IssueMap = new HashMap<>();
                                   IssueMap.put("name", documentSnapshot.getString("name"));
                                   IssueDb.document(issue.getPostId())
                                           .update(IssueMap)
                                           .addOnSuccessListener(aVoid -> Log.i("Issue_update", "success"))
                                           .addOnFailureListener(e -> Log.i("Issue_update", "failure"));

                                   user_name.setText(documentSnapshot.getString("name"));

                               } else if (!Objects.equals(documentSnapshot.getString("image"), issue.getUserimage())) {

                                   Map<String, Object> IssueMap = new HashMap<>();
                                   IssueMap.put("userimage", documentSnapshot.getString("image"));

                                   IssueDb.document(issue.getPostId())
                                           .update(IssueMap)
                                           .addOnSuccessListener(aVoid -> Log.i("Issue_update", "success"))
                                           .addOnFailureListener(e -> Log.i("Issue_update", "failure"));

                                   Glide.with(Home.context)
                                           .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                           .load(documentSnapshot.getString("image"))
                                           .into(user_image);

                               }

                           } catch (Exception e) {
                               e.printStackTrace();
                           }
                       })
                       .addOnFailureListener(e -> Log.e("Error", e.getMessage()));
           }
        } catch (Exception ex) {
            Log.w("error", "fastscrolled", ex);
        }


        holder.itemView.setOnClickListener(view -> context.startActivity(new Intent(Home.context, IssuesDetailsActivity.class).putExtra("issue", issue).putExtra("owner", isOwner).putExtra("approveStatus", approved).putExtra("alreadyLiked", alreadyLiked) , ActivityOptions.makeSceneTransitionAnimation((Activity) context).toBundle()));

    }

    @SuppressLint("SetTextI18n")
    private void setupViews(Issue Issue) {


       if(Issue.isAnonymous()) {
           user_name.setText("Anonymous from "+Issue.getAddress());
           user_image.setImageResource(R.drawable.logo_round);
       }else{
           Glide.with(Home.context)
                   .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.placeholder))
                   .load(Issue.getUserimage())
                   .into(user_image);

           user_name.setText(Issue.getName());
       }

        institute_dept.setText(Issue.getTag() + " at " + Issue.getInstitute() );


        String timeAgo = TimeAgo.using(Long.parseLong(Issue.getTimestamp()));
        timestamp.setText(timeAgo);
    }

    @SuppressLint("ClickableViewAccessibility")


    private void setUrls(ArrayList<MultipleImage> multipleImages, PostPhotosAdapter photosAdapter, Issue Issue) {
        String url0, url1, url2, url3, url4, url5, url6;
        url0 = Issue.getImage_url_0();
        url1 = Issue.getImage_url_1();
        url2 = Issue.getImage_url_2();
        url3 = Issue.getImage_url_3();
        url4 = Issue.getImage_url_4();
        url5 = Issue.getImage_url_5();
        url6 = Issue.getImage_url_6();

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

    private void addToNotification(String admin_id, Notification notification) {
        if (!admin_id.equals(userId)) {
            mFirestore.collection("Users")
                    .document(admin_id)
                    .collection("Info_Notifications").document(notification.getId())
                    .set(notification)
                    .addOnSuccessListener(documentReference -> new SendNotificationAsyncTask(notification).execute())
                    .addOnFailureListener(e -> Log.e("Error", e.getLocalizedMessage()));
        }
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