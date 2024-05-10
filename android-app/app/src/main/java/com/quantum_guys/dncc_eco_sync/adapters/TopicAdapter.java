package com.quantum_guys.dncc_eco_sync.adapters;

import android.app.Activity;
import android.app.ActivityOptions;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.ui.activities.quiz.SubTopic;

import java.util.List;

public class TopicAdapter extends RecyclerView.Adapter<TopicAdapter.MyViewHolder> {

    private final List<String> topicNameList;
    private final String otherUid;
    private final String type;
    final Context context;
    int lastPosition = -1;

    public TopicAdapter(List<String> topicNameList, Context context, String otherUid, String type) {
        this.topicNameList = topicNameList;
        this.otherUid = otherUid;
        this.type = type;
        this.context = context;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_topic, viewGroup, false);
        return new MyViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MyViewHolder viewHolder, int i) {
        Animation animation = AnimationUtils.loadAnimation(context,
                (i > lastPosition) ? R.anim.up_from_bottom
                        : R.anim.down_from_top);
        viewHolder.itemView.startAnimation(animation);
        lastPosition = i;
        // int lastPosition = -1;

        viewHolder.nameTV.setText(topicNameList.get(i));
        viewHolder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, SubTopic.class);
            intent.putExtra("topic", topicNameList.get(i));
            intent.putExtra("otherUid", otherUid);
            intent.putExtra("type", type);
            context.startActivity(intent, ActivityOptions.makeSceneTransitionAnimation((Activity) context).toBundle());
        });


    }

    @Override
    public int getItemCount() {
        return topicNameList.size();
    }


    public static class MyViewHolder extends RecyclerView.ViewHolder {
        final TextView nameTV;

        public MyViewHolder(View itemView) {
            super(itemView);
            nameTV = itemView.findViewById(R.id.textView);
        }
    }

}
