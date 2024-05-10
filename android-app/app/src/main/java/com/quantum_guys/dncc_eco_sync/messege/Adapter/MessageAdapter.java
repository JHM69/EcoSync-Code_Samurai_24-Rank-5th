package com.quantum_guys.dncc_eco_sync.messege.Adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
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
import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.google.firebase.auth.FirebaseAuth;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.messege.model.Chat;
import com.quantum_guys.dncc_eco_sync.ui.activities.notification.ImagePreviewSave;

import java.util.List;
import java.util.Objects;

public class MessageAdapter extends RecyclerView.Adapter<MessageAdapter.ViewHolder> {

    public static final int MSG_TYPE_LEFT = 0;
    public static final int MSG_TYPE_RIGHT = 1;
    private final Context mContext;
    private final List<Chat> mChat;

    String fuser = Objects.requireNonNull(FirebaseAuth.getInstance().getCurrentUser()).getUid();;

    public MessageAdapter(Context mContext, List<Chat> mChat) {
        this.mChat = mChat;
        this.mContext = mContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view;
        if (viewType == MSG_TYPE_RIGHT) {
            view = LayoutInflater.from(mContext).inflate(R.layout.chat_item_right, parent, false);
        } else {
            view = LayoutInflater.from(mContext).inflate(R.layout.chat_item_left, parent, false);
        }
        return new ViewHolder(view);
    }

    @SuppressLint({"SetTextI18n", "UseCompatLoadingForDrawables"})
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Chat chat = mChat.get(position);
        Animation animation = AnimationUtils.loadAnimation(mContext, R.anim.my_anim);

        holder.show_message.setText(chat.getMessage());

        if (chat.getImage() != null) {
            holder.imageView.setVisibility(View.VISIBLE);
            Glide.with(mContext).load(chat.getImage()).into(holder.imageView);
            holder.show_message.setVisibility(View.GONE);
            holder.imageView.setOnClickListener(view -> {
                Intent intent = new Intent(mContext, ImagePreviewSave.class)
                        .putExtra("url", chat.getImage());
                mContext.startActivity(intent);
            });
        } else {
            holder.imageView.setVisibility(View.GONE);
            holder.show_message.setVisibility(View.VISIBLE);
        }

        holder.itemView.setOnClickListener(view -> {
            holder.itemView.startAnimation(animation);
            holder.time.setVisibility(holder.time.getVisibility() == View.VISIBLE ? View.GONE : View.VISIBLE);
            //delivered_status_txt_id.visibility = dateTextView.visibility;
        });

        try {
            String time = TimeAgo.using(chat.getTimestamp()).replace(" minutes ago", "m");
            time = time.replace(" minutes ago", "m");
            time = time.replace("yesterday", "1d");
            time = time.replace("one minute ago", "1m");
            time = time.replace(" hours ago", "h");
            time = time.replace(" days ago", "d");
            time = time.replace("just now", "");
            time = time.replace("about an hour ago", "1h");
            holder.time.setText(time);
        } catch (NullPointerException ignored) {

        }
        if (position == mChat.size() - 1) {
            if (chat.isIsseen()) {
                holder.itemView.startAnimation(animation);
                holder.txt_seen.setImageDrawable(mContext.getResources().getDrawable(R.drawable.ic_check_circle));
            } else {
                holder.txt_seen.setImageDrawable(mContext.getResources().getDrawable(R.drawable.ic_check_circle_outline_24px__1_));
            }
        } else {
            holder.txt_seen.setVisibility(View.GONE);
        }

    }

    @Override
    public int getItemCount() {
        return mChat.size();
    }

    @Override
    public int getItemViewType(int position) {
        try {
            if (mChat.get(position).getSender().equals(fuser)) {
                return MSG_TYPE_RIGHT;
            } else {
                return MSG_TYPE_LEFT;
            }
        }catch (Exception x){
            return MSG_TYPE_LEFT;
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView show_message, time;
        public ImageView txt_seen;
        public ImageView imageView;

        public ViewHolder(View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.imageView);
            show_message = itemView.findViewById(R.id.show_message);
            txt_seen = itemView.findViewById(R.id.imageView14);
            time = itemView.findViewById(R.id.time);
        }
    }
}