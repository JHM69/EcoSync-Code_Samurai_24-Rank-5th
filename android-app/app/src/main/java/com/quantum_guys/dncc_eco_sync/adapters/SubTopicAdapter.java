package com.quantum_guys.dncc_eco_sync.adapters;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityOptions;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.chip.Chip;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.SubTopicModel;
import com.quantum_guys.dncc_eco_sync.ui.activities.quiz.QuizBattle;

import java.util.List;

public class SubTopicAdapter extends RecyclerView.Adapter<SubTopicAdapter.MyViewHolder> {

    private final List<SubTopicModel> subTopicNameList;
    private final String otherUid;
    private final String type;
    final Context context;
    final String topic;
    int lastPosition = -1;

    public SubTopicAdapter(List<SubTopicModel> subTopicNameList, String topic, Context context, String otherUid, String type) {
        this.subTopicNameList = subTopicNameList;
        this.topic = topic;
        this.otherUid = otherUid;
        this.context = context;
        this.type = type;
    }

    @NonNull
    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.item_topic, viewGroup, false);
        return new MyViewHolder(view);

    }

    @Override
    public void onBindViewHolder(MyViewHolder viewHolder, @SuppressLint("RecyclerView") int i) {
        Animation animation = AnimationUtils.loadAnimation(context,
                (i > lastPosition) ? R.anim.up_from_bottom
                        : R.anim.down_from_top);
        viewHolder.itemView.startAnimation(animation);
        lastPosition = i;
        // int lastPosition = -1;
        viewHolder.nameTV.setText(subTopicNameList.get(i).name);
        viewHolder.itemView.setOnClickListener(v -> {
            ViewDialog alert = new ViewDialog();
            alert.showDialog((Activity) context, topic, subTopicNameList.get(i).id, otherUid, type);
        });
    }

    @Override
    public int getItemCount() {
        return subTopicNameList.size();
    }


    public static class MyViewHolder extends RecyclerView.ViewHolder {
        final TextView nameTV;

        public MyViewHolder(View itemView) {
            super(itemView);
            nameTV = itemView.findViewById(R.id.textView);
        }
    }

    public static class ViewDialog {

        public void showDialog(Activity activity, String topic, String subTopic, String otherUid, String type) {
            final Dialog dialog = new Dialog(activity);
            dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
            dialog.setCancelable(true);
            dialog.setContentView(R.layout.dialouge_select_question_count);

            TextView text = dialog.findViewById(R.id.textView7);
            Chip chip10 = dialog.findViewById(R.id.ten);
            chip10.setOnClickListener(v -> {
                Intent intent = new Intent(v.getContext(), QuizBattle.class);
                intent.putExtra("topic", topic);
                intent.putExtra("type", type);
                intent.putExtra("subtopic", subTopic);
                intent.putExtra("otherUid", otherUid);
                intent.putExtra("question_number", 10);
                v.getContext().startActivity(intent,  ActivityOptions.makeSceneTransitionAnimation(activity).toBundle());
                dialog.dismiss();
            });
            Chip chip5 = dialog.findViewById(R.id.five);
            chip5.setOnClickListener(v -> {
                Intent intent = new Intent(v.getContext(), QuizBattle.class);
                intent.putExtra("topic", topic);
                intent.putExtra("type", type);
                intent.putExtra("subtopic", subTopic);
                intent.putExtra("otherUid", otherUid);
                intent.putExtra("question_number", 5);
                v.getContext().startActivity(intent, ActivityOptions.makeSceneTransitionAnimation((activity)).toBundle());
                dialog.dismiss();
            });

            dialog.show();

        }
    }

}
