package com.quantum_guys.dncc_eco_sync.adapters.searchFriends;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.google.firebase.firestore.FirebaseFirestore;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.Friends;
import com.quantum_guys.dncc_eco_sync.ui.activities.friends.FriendProfile;

import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

/**
 * Created by Jahangir .
 */

public class SearchFriendAdapter extends RecyclerView.Adapter<SearchFriendAdapter.ViewHolder> {

    private final List<Friends> usersList;
    private final Context context;
    int lastPosition = -1;

    public SearchFriendAdapter(List<Friends> usersList, Context context) {
        this.usersList = usersList;
        this.context = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_friend, parent, false);
        return new ViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, int position) {
        Friends friends = usersList.get(position);
        //checkIfReqSent(holder);

        Animation animation = AnimationUtils.loadAnimation(context,
                (position > lastPosition) ? R.anim.up_from_bottom
                        : R.anim.down_from_top);
        holder.itemView.startAnimation(animation);
        lastPosition = position;

        // int lastPosition = -1;
        holder.name.setText(friends.getName());
        holder.levelTv.setText(String.valueOf(getLevelNum(friends.getScore())));



        if(friends.getDept().length() > 1 && friends.getInstitute().length() > 1) {
            holder.username.setText(friends.getDept() + ", " + friends.getInstitute());
        }else if (friends.getDept().length()<2) {
            holder.username.setText(friends.getInstitute());
        } else if (friends.getInstitute().length()<2) {
            holder.username.setText(friends.getDept());
        }
        if(friends.getDept().length()<1 && friends.getInstitute().length() < 1){
            holder.username.setVisibility(View.GONE);
        }


        try {
            Glide.with(context)
                    .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                    .load(friends.getImage())
                    .into(holder.image);
        } catch (NullPointerException ignored) {

        }
        holder.mView.setOnClickListener(view -> FriendProfile.startActivity(context, friends.getId()));
    }

    private void checkIfReqSent(final ViewHolder holder) {
        FirebaseFirestore.getInstance()
                .collection("Users")
                .document(usersList.get(holder.getAdapterPosition()).getId())
                .collection("Friends")
                .document(userId)
                .get().addOnSuccessListener(documentSnapshot -> {
            if (documentSnapshot.exists()) {
                //  holder.exist_icon.setVisibility(View.GONE);
                holder.friend_icon.setVisibility(View.VISIBLE);
            } else {
                FirebaseFirestore.getInstance()
                        .collection("Users")
                        .document(usersList.get(holder.getAdapterPosition()).getId())
                        .collection("Friend_Requests")
                        .document(userId)
                        .get().addOnSuccessListener(documentSnapshot1 -> {
                    if (documentSnapshot1.exists()) {
                        holder.friend_icon.setVisibility(View.GONE);
                        // holder.exist_icon.setVisibility(View.VISIBLE);
                    } else {
                        // holder.exist_icon.setVisibility(View.GONE);
                        holder.friend_icon.setVisibility(View.GONE);
                    }
                });
            }
        });

    }


    @Override
    public int getItemCount() {
        return usersList.size();
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public int getItemViewType(int position) {
        return position;
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

        public final CircleImageView image;
        final View mView;
        final TextView name;
        final TextView username;
        final TextView levelTv;
        ImageView friend_icon;

        ViewHolder(View itemView) {
            super(itemView);

            mView = itemView;
            image = mView.findViewById(R.id.duibgseab);
            name = mView.findViewById(R.id.name);
            levelTv = mView.findViewById(R.id.levelTv);
            username = mView.findViewById(R.id.username);
        }
    }
}
