package com.quantum_guys.dncc_eco_sync.adapters;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.firebase.firestore.FirebaseFirestore;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.FriendRequest;
import com.quantum_guys.dncc_eco_sync.ui.activities.friends.FriendProfile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;


public class FriendRequestAdapter extends RecyclerView.Adapter<FriendRequestAdapter.ViewHolder> {

    private final Context context;
    private final List<FriendRequest> usersList;
    int lastPosition = -1;

    public FriendRequestAdapter(List<FriendRequest> usersList, Context context) {
        this.usersList = usersList;
        this.context = context;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public int getItemViewType(int position) {
        return position;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_friend_req, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, int position) {
        Animation animation = AnimationUtils.loadAnimation(context,
                (position > lastPosition) ? R.anim.up_from_bottom
                        : R.anim.down_from_top);
        holder.itemView.startAnimation(animation);
        lastPosition = position;

        holder.name.setText(usersList.get(position).getName());

        Glide.with(context)
                .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.ic_logo_icon))
                .load(usersList.get(position).getImage())
                .into(holder.image);

        String timeAgo = TimeAgo.using(Long.parseLong(usersList.get(position).getTimestamp()));
        holder.timestamp.setText(timeAgo);

        try {
            FirebaseFirestore.getInstance().collection("Users")
                    .document(usersList.get(position).userId)
                    .get()
                    .addOnSuccessListener(documentSnapshot -> {

                        final String mCurrentId = userId;

                        if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName()) &&
                                !Objects.requireNonNull(documentSnapshot.getString("image")).equals(usersList.get(holder.getAdapterPosition()).getImage())) {

                            holder.mBar.setVisibility(View.VISIBLE);
                            Map<String, Object> user = new HashMap<>();
                            user.put("name", documentSnapshot.getString("name"));
                            user.put("image", documentSnapshot.getString("image"));

                            FirebaseFirestore.getInstance()
                                    .collection("Users")
                                    .document(mCurrentId)
                                    .collection("Friend_Requests")
                                    .document(Objects.requireNonNull(documentSnapshot.getString("id")))
                                    .update(user)
                                    .addOnSuccessListener(aVoid -> {
                                        Log.i("friend_req_update", "success");
                                        holder.mBar.setVisibility(View.GONE);
                                    })
                                    .addOnFailureListener(e -> Log.i("friend_req_update", "failure"));

                            holder.name.setText(documentSnapshot.getString("name"));

                            Glide.with(context)
                                    .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.ic_logo))
                                    .load(documentSnapshot.getString("image"))
                                    .into(holder.image);


                        } else if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName())) {

                            holder.mBar.setVisibility(View.VISIBLE);
                            Map<String, Object> user = new HashMap<>();
                            user.put("name", documentSnapshot.getString("name"));

                            FirebaseFirestore.getInstance()
                                    .collection("Users")
                                    .document(mCurrentId)
                                    .collection("Friend_Requests")
                                    .document(Objects.requireNonNull(documentSnapshot.getString("id")))
                                    .update(user)
                                    .addOnSuccessListener(aVoid -> {
                                        Log.i("friend_req_update", "success");
                                        holder.mBar.setVisibility(View.GONE);
                                    })
                                    .addOnFailureListener(e -> Log.i("friend_req_update", "failure"));


                            holder.name.setText(documentSnapshot.getString("name"));

                        } else if (!Objects.requireNonNull(documentSnapshot.getString("image")).equals(usersList.get(holder.getAdapterPosition()).getImage())) {

                            holder.mBar.setVisibility(View.VISIBLE);
                            Map<String, Object> user = new HashMap<>();
                            user.put("image", documentSnapshot.getString("image"));

                            FirebaseFirestore.getInstance()
                                    .collection("Users")
                                    .document(mCurrentId)
                                    .collection("Friend_Requests")
                                    .document(Objects.requireNonNull(documentSnapshot.getString("id")))
                                    .update(user)
                                    .addOnSuccessListener(aVoid -> {
                                        Log.i("friend_req_update", "success");
                                        holder.mBar.setVisibility(View.GONE);
                                    })
                                    .addOnFailureListener(e -> Log.i("friend_req_update", "failure"));


                            Glide.with(context)
                                    .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.ic_logo_icon))
                                    .load(documentSnapshot.getString("image"))
                                    .into(holder.image);

                        }

                    }).addOnFailureListener(e -> Log.e("Error", e.getMessage()));
        } catch (Exception ex) {
            Log.w("error", "fastscrolled", ex);
        }

        holder.mView.setOnClickListener(view -> FriendProfile.startActivity(context, usersList.get(holder.getAdapterPosition()).getId()));

    }


    @Override
    public int getItemCount() {
        return usersList.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        private final View mView;
        private final CircleImageView image;
        private final ProgressBar mBar;
        private final TextView name;
        private final TextView timestamp;

        public ViewHolder(View itemView) {
            super(itemView);

            mView = itemView;
            image = mView.findViewById(R.id.userimage);
            name = mView.findViewById(R.id.username);
            timestamp = mView.findViewById(R.id.timestamp);
            mBar = mView.findViewById(R.id.progressBar);

        }
    }
}
