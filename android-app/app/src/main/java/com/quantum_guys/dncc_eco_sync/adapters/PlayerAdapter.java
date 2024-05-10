package com.quantum_guys.dncc_eco_sync.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.Player;
import com.quantum_guys.dncc_eco_sync.ui.activities.quiz.SelectTopic;

import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;


/**
 * Created by Jahangir .
 */

public class PlayerAdapter extends RecyclerView.Adapter<PlayerAdapter.ViewHolder> {

    private final List<Player> usersList;
    private final Context context;

    public PlayerAdapter(List<Player> usersList, Context context) {
        this.usersList = usersList;
        this.context = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_quiz_profile, parent, false);
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
    public void onBindViewHolder(@NonNull final ViewHolder holder, int position) {
        Player users = usersList.get(position);
        holder.name.setText(users.getName());
        holder.institute.setText(users.getDept() + ", " + users.getInstitute());
        String dept = users.getDept();
        String institute = users.getInstitute();
        if (!dept.equals("") && !institute.equals("")) {
            holder.institute.setText(dept + ", " + institute);
        } else if (institute.equals("")) {
            holder.institute.setText(dept);
        } else if (dept.equals("")) {
            holder.institute.setText(institute);
        }

        int score = (int) users.getScore();
        holder.level.setText(String.valueOf(getLevelNum(score)));
        Glide.with(context)
                .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.ic_logo))
                .load(users.getImage())
                .into(holder.image);
        final String userid = users.getId();
        holder.mView.setOnClickListener(view -> {
            Intent goBattle = new Intent(context, SelectTopic.class);
            goBattle.putExtra("otherUid", userid);
            context.startActivity(goBattle);
        });
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

        public final View mView;
        public final CircleImageView image;
        public final TextView name;
        public final TextView institute;
        public final TextView level, time;
        public final TextView rank;
        public final ConstraintLayout back;

        public ViewHolder(View itemView) {
            super(itemView);
            mView = itemView;
            image = mView.findViewById(R.id.image);
            name = mView.findViewById(R.id.name);
            institute = mView.findViewById(R.id.institute);
            level = mView.findViewById(R.id.levelCount);
            rank = mView.findViewById(R.id.rank);
            back = mView.findViewById(R.id.back);
            time = mView.findViewById(R.id.textView4);
        }
    }
}
