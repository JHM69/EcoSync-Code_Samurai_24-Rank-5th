package com.quantum_guys.dncc_eco_sync.adapters.viewFriends;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.marcoscg.dialogsheet.DialogSheet;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.ViewFriends;
import com.quantum_guys.dncc_eco_sync.ui.activities.friends.FriendProfile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;

/**
 * Created by Jahangir .
 */

public class ViewFriendAdapter extends RecyclerView.Adapter<ViewFriendAdapter.ViewHolder> {

    private final List<ViewFriends> usersList;
    private final Context context;
    int lastPosition = -1;
    private HashMap<String, Object> userMap;
    private ProgressDialog mDialog;

    public ViewFriendAdapter(List<ViewFriends> usersList, Context context) {
        this.usersList = usersList;
        this.context = context;
    }


    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_friend_added, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public int getItemViewType(int position) {
        return position;
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {


        Animation animation = AnimationUtils.loadAnimation(context,
                (position > lastPosition) ? R.anim.up_from_bottom
                        : R.anim.down_from_top);
        holder.itemView.startAnimation(animation);
        lastPosition = position;

        // int lastPosition = -1;


        holder.name.setText(usersList.get(position).getName());


        holder.levelTv.setText(String.valueOf(getLevelNum(usersList.get(position).getScore())));
        // holder.institute.setText(usersList.get(position).getDept()+", "+usersList.get(position).getInstitute());

        Glide.with(context)
                .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                .load(usersList.get(position).getImage())
                .into(holder.image);

        try {

            FirebaseFirestore.getInstance().collection("Users")
                    .document(usersList.get(position).getId())
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {

                        try {
                            if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName()) &&
                                    !Objects.requireNonNull(documentSnapshot.getString("email")).equals(usersList.get(holder.getAdapterPosition()).getEmail()) &&
                                    !Objects.requireNonNull(documentSnapshot.getString("image")).equals(usersList.get(holder.getAdapterPosition()).getImage())) {

                                Map<String, Object> user = new HashMap<>();
                                user.put("name", documentSnapshot.getString("name"));
                                user.put("username", documentSnapshot.getString("dept") + ", " + documentSnapshot.getString("institute"));
                                user.put("image", documentSnapshot.getString("image"));

                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(userId)
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("friend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));

                                holder.name.setText(documentSnapshot.getString("name"));
                                holder.institute.setText(usersList.get(position).getDept() + ", " + usersList.get(position).getInstitute());

                                Glide.with(context)
                                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                        .load(documentSnapshot.getString("image"))
                                        .into(holder.image);


                            } else if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName()) &&
                                    !Objects.requireNonNull(documentSnapshot.getString("email")).equals(usersList.get(holder.getAdapterPosition()).getEmail())) {

                                Map<String, Object> user = new HashMap<>();
                                user.put("name", documentSnapshot.getString("name"));
                                user.put("institute", documentSnapshot.getString("institute"));

                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(userId)
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("friend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));

                                holder.name.setText(documentSnapshot.getString("name"));
                                holder.institute.setText(usersList.get(position).getDept() + ", " + usersList.get(position).getInstitute());


                            } else if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName()) &&
                                    !Objects.requireNonNull(documentSnapshot.getString("image")).equals(usersList.get(holder.getAdapterPosition()).getImage())) {

                                Map<String, Object> user = new HashMap<>();
                                user.put("name", documentSnapshot.getString("name"));
                                user.put("image", documentSnapshot.getString("image"));

                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(userId)
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("friend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));

                                holder.name.setText(documentSnapshot.getString("name"));

                                Glide.with(context)
                                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                        .load(documentSnapshot.getString("image"))
                                        .into(holder.image);


                            } else if (!Objects.requireNonNull(documentSnapshot.getString("image")).equals(usersList.get(holder.getAdapterPosition()).getImage())) {

                                Map<String, Object> user = new HashMap<>();
                                user.put("name", documentSnapshot.getString("name"));
                                user.put("image", documentSnapshot.getString("image"));

                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(Objects.requireNonNull(FirebaseAuth.getInstance().getCurrentUser()).getUid())
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("f" +
                                                "riend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));

                                holder.institute.setText(usersList.get(position).getDept() + ", " + usersList.get(position).getInstitute());

                                Glide.with(context)
                                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                        .load(documentSnapshot.getString("image"))
                                        .into(holder.image);


                            } else if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName())) {

                                Map<String, Object> user = new HashMap<>();
                                user.put("name", documentSnapshot.getString("name"));

                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(userId)
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("friend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));


                                holder.name.setText(documentSnapshot.getString("name"));

                            } else if (!Objects.requireNonNull(documentSnapshot.getString("image")).equals(usersList.get(holder.getAdapterPosition()).getImage())) {

                                Map<String, Object> user = new HashMap<>();
                                user.put("image", documentSnapshot.getString("image"));

                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(userId)
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("friend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));


                                Glide.with(context)
                                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                        .load(documentSnapshot.getString("image"))
                                        .into(holder.image);

                            } else if (!Objects.requireNonNull(documentSnapshot.getString("email")).equals(usersList.get(holder.getAdapterPosition()).getEmail())) {
                                Map<String, Object> user = new HashMap<>();
                                user.put("institute", documentSnapshot.getString("institute"));
                                FirebaseFirestore.getInstance().collection("Users")
                                        .document(userId)
                                        .collection("Friends")
                                        .document(usersList.get(holder.getAdapterPosition()).getId())
                                        .update(user)
                                        .addOnSuccessListener(aVoid -> Log.i("friend_update", "success"))
                                        .addOnFailureListener(e -> Log.i("friend_update", "failure"));
                                holder.institute.setText(usersList.get(position).getDept() + ", " + usersList.get(position).getInstitute());

                            }
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    });

        } catch (Exception ex) {
            Log.w("error", "fastscrolled", ex);
        }

        holder.mView.setOnClickListener(view -> FriendProfile.startActivity(context, usersList.get(holder.getAdapterPosition()).getId()));

    }


    public void removeItem(final int position) {

        new DialogSheet(context)
                .setTitle("Unfriend " + usersList.get(position).getName())
                .setMessage("Are you sure do you want to remove " + usersList.get(position).getName() + " from your friend list?")
                .setPositiveButton("Yes", v -> removeUser(position))
                .setNegativeButton("No", v -> notifyDataSetChanged())
                .setRoundedCorners(true)
                .setColoredNavigationBar(true)
                .show();

    }


    private void removeUser(final int position) {

        FirebaseFirestore.getInstance().collection("Users").document(userId)
                .collection("Friends").document(usersList.get(position).getId()).delete().addOnSuccessListener(aVoid -> FirebaseFirestore.getInstance()
                .collection("Users")
                .document(usersList.get(position).getId())
                .collection("Friends")
                .document(userId)
                .delete()
                .addOnSuccessListener(aVoid1 -> {
                    usersList.remove(position);
                    notifyItemRemoved(position);
                    notifyDataSetChanged();
                })).addOnFailureListener(Throwable::printStackTrace);

    }


    @Override
    public int getItemCount() {
        return usersList.size();
    }

    public Integer getLevelNum(int score) {
        final int level;
        if (score <= 500) {
            level = 1;
        } else if (score <= 1000) {
            level = 2;
        } else if (score <= 1500) {
            level = 3;
        } else if (score <= 2000) {
            level = 4;
        } else if (score <= 2500) {
            level = 5;
        } else if (score <= 3500) {
            level = 6;
        } else if (score <= 5000) {
            level = 7;
        } else {
            level = -1;
        }
        return level;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        final TextView name;
        final TextView listenerText;
        final TextView institute;
        final TextView levelTv;
        final RelativeLayout viewBackground;
        final RelativeLayout viewForeground;
        final View mView;
        final CircleImageView image;

        public ViewHolder(View itemView) {
            super(itemView);

            mView = itemView;
            image = mView.findViewById(R.id.image);
            institute = mView.findViewById(R.id.institute);
            name = mView.findViewById(R.id.name);
            viewBackground = mView.findViewById(R.id.view_background);
            viewForeground = mView.findViewById(R.id.view_foreground);
            listenerText = mView.findViewById(R.id.view_foreground_text);
            levelTv = mView.findViewById(R.id.levelTv);
        }
    }
}
