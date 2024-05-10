package com.quantum_guys.dncc_eco_sync.adapters;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.google.firebase.firestore.FirebaseFirestore;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.Users;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;

/**
 * Created by Jahangir.
 */

public class UsersAdapter extends RecyclerView.Adapter<UsersAdapter.ViewHolder> {

    private final List<Users> usersList;
    private final Context context;
    int lastPosition = -1;

    public UsersAdapter(List<Users> usersList, Context context) {
        this.usersList = usersList;
        this.context = context;
    }

    public static Long getNumericReferenceNumber(String str) {
        str = str.replaceAll("[^0-9]", "");
        return Long.parseLong(str);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_user, parent, false);
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

    @Override
    public int getItemCount() {
        return usersList.size();
    }

    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, @SuppressLint("RecyclerView") int position) {

        Animation animation = AnimationUtils.loadAnimation(context,
                (position > lastPosition) ? R.anim.up_from_bottom
                        : R.anim.down_from_top);
        holder.itemView.startAnimation(animation);
        lastPosition = position;
        // int lastPosition = -1;

        holder.name.setText(usersList.get(position).getName());

        Glide.with(context)
                .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                .load(usersList.get(position).getImage())
                .into(holder.image);

        FirebaseFirestore.getInstance().collection("Users")
                .document(usersList.get(position).getId())
                .get()
                .addOnSuccessListener(documentSnapshot -> {

                    try {
                        if (!Objects.requireNonNull(documentSnapshot.getString("name")).equals(usersList.get(holder.getAdapterPosition()).getName()) &&
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

                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });


        final String userid = usersList.get(position).getId();

        holder.mView.setOnClickListener(view -> {
          /* // Intent intent = new Intent(context, MessageActivity.class);
            intent.putExtra("userid", usersList.get(position).getId());
            intent.putExtra("name", usersList.get(position).getName());
            intent.putExtra("image", usersList.get(position).getImage());
            context.startActivity(intent);*/
        });
    }


    public static class ViewHolder extends RecyclerView.ViewHolder {

        private final View mView;
        private final CircleImageView image;
        private final TextView name;

        public ViewHolder(View itemView) {
            super(itemView);
            mView = itemView;
            image = mView.findViewById(R.id.image);
            name = mView.findViewById(R.id.name);

        }
    }

}
