package com.quantum_guys.dncc_eco_sync.messege.Adapter;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.firebase.database.FirebaseDatabase;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.messege.activity.MessageActivity;
import com.quantum_guys.dncc_eco_sync.models.Users;
import com.quantum_guys.dncc_eco_sync.viewmodel.ChatViewModel;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class UserAdapter extends RecyclerView.Adapter<UserAdapter.ViewHolder> {

    private final Context mContext;
    private final List<Users> mUsers;
    private final boolean ischat;

    public UserAdapter(Context mContext, List<Users> mUsers, boolean ischat) {
        this.mUsers = mUsers;
        this.mContext = mContext;
        this.ischat = ischat;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(mContext).inflate(R.layout.user_item, parent, false);
        return new ViewHolder(view);
    }

    @SuppressLint({"UseCompatLoadingForDrawables", "SetTextI18n"})
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        final Users user = mUsers.get(position);
        holder.username.setText(user.getName());
        if (user.getImage().equals("default")) {
            holder.profile_image.setImageResource(R.drawable.ic_logo);
        } else {
            try {
                Glide.with(mContext).load(user.getImage()).placeholder(R.drawable.ic_logo).into(holder.profile_image);
            } catch (ArrayIndexOutOfBoundsException ignored) {
                holder.profile_image.setImageDrawable(mContext.getDrawable(R.drawable.ic_logo));
            }
        }

        if (ischat) {
            holder.last_msg.setText(user.getBio());
            long timestamp = user.getLastTimestamp();
            Date date = new Date(timestamp);
            try {
                @SuppressLint("SimpleDateFormat")
                SimpleDateFormat sdf = new SimpleDateFormat("Sep 4 13:41");
                sdf.setTimeZone(TimeZone.getTimeZone("GMT+6"));
                String formattedDate = sdf.format(date);
                holder.time.setText(formattedDate);
            } catch (Exception j) {
                holder.time.setText(TimeAgo.using(timestamp));
            }
        }

        holder.itemView.setOnClickListener(view -> {
            Intent intent = new Intent(mContext, MessageActivity.class);
            intent.putExtra("userid", user.getId());
            intent.putExtra("name", user.getName());
            intent.putExtra("image", user.getImage());
            mContext.startActivity(intent);
        });

        holder.itemView.setOnLongClickListener(view -> {
            AlertDialog.Builder builder = new AlertDialog.Builder(mContext);
            builder.setPositiveButton("Yes", (dialogInterface, i) -> {
                ProgressDialog pg = new ProgressDialog(mContext);
                pg.setCancelable(false);
                pg.setTitle("Deleting....");
                pg.show();
                FirebaseDatabase.getInstance().getReference().child("Chatlist").child(userId).child(user.getId()).removeValue().addOnCompleteListener(task -> {
                    ViewModelProviders.of((FragmentActivity) mContext).get(ChatViewModel.class).deleteAdmin(user.getId());
                    ViewModelProviders.of((FragmentActivity) mContext).get(UserViewModel.class).deleteUser(user.getId());
                    notifyDataSetChanged();
                    pg.dismiss();
                });

            }).setNegativeButton("No", (dialogInterface, i) -> {

            })
                    .setTitle("Delete?")
                    .setTitle("Delete Chat??")
                    .show();

            return true;
        });
    }

    @Override
    public int getItemCount() {
        return mUsers.size();
    }
    //check for last message
   /* private void lastMessage(final String userid, final TextView last_msg) {
        final String uidNum = String.valueOf(UserNumber.loadData(mContext));
        Query query = FirebaseDatabase.getInstance().getReference("Chats");
        query.addValueEventListener(new ValueEventListener() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Chat chat = snapshot.getValue(Chat.class);
                    if (chat != null) {
                        if (chat.getReceiver().equals(uidNum) && chat.getSender().equals(userid) ||
                                chat.getReceiver().equals(userid) && chat.getSender().equals(uidNum)) {
                            theLastMessage = chat.getMessage();
                        }
                    }
                }
                if (theLastMessage.equals("")) {
                    last_msg.setText("......");
                } else {
                    last_msg.setText(theLastMessage);
                }
                theLastMessage = "default";
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {

            }
        });
    }*/

    public static class ViewHolder extends RecyclerView.ViewHolder {

        private final TextView last_msg, time;
        public TextView username;
        public ImageView profile_image;

        public ViewHolder(View itemView) {
            super(itemView);

            username = itemView.findViewById(R.id.username);
            profile_image = itemView.findViewById(R.id.profile_image);
            time = itemView.findViewById(R.id.textView12);
            last_msg = itemView.findViewById(R.id.last_msg);
        }
    }

}
