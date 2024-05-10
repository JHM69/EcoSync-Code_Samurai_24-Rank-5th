package com.quantum_guys.dncc_eco_sync.ui.activities.quiz;

import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;
import static java.util.Objects.requireNonNull;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.firestore.FirebaseFirestore;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.ResultEachQuestionAdapter;
import com.quantum_guys.dncc_eco_sync.models.QuestionEachResult;
import com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity;
import com.quantum_guys.dncc_eco_sync.ui.activities.friends.FriendProfile;
import com.quantum_guys.dncc_eco_sync.viewmodel.BattleViewModel;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.util.ArrayList;
import java.util.List;

import es.dmoral.toasty.Toasty;

public class ResultActivity extends AppCompatActivity {
    public ProgressDialog mDialog;
    String winnerId = "draw";
    Button playAgain;
    final List<QuestionEachResult> questionEachResultList = new ArrayList<>();
    RecyclerView mRecyclerView;
    ResultEachQuestionAdapter resultEachQuestionAdapter;
    private BattleModel battlep;
    private TextView thisUserName, thisUserLevel, otherUserName, otherUserLevel, thisScore, otherScore, topic, resultText, pointText;
    private ImageView otherUserImage, thisUserImage;

    @SuppressLint({"SetTextI18n", "InflateParams"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SharedPreferences sharedPreferences = getSharedPreferences("Theme", Context.MODE_PRIVATE);
        String themeName = sharedPreferences.getString("ThemeName", "Default");
        if (themeName.equalsIgnoreCase("TealTheme")) {
            setTheme(R.style.TealTheme);
        } else if (themeName.equalsIgnoreCase("VioleteTheme")) {
            setTheme(R.style.VioleteTheme);
        } else if (themeName.equalsIgnoreCase("PinkTheme")) {
            setTheme(R.style.PinkTheme);
        } else if (themeName.equalsIgnoreCase("DelRio")) {
            setTheme(R.style.DelRio);
        } else if (themeName.equalsIgnoreCase("DarkTheme")) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            setTheme(R.style.Dark);
        } else if (themeName.equalsIgnoreCase("Lynch")) {
            setTheme(R.style.Lynch);
        } else {
            setTheme(R.style.AppTheme);
        }
        setContentView(R.layout.activity_result);
        Toolbar toolbar = findViewById(R.id.toolbar2);


        setSupportActionBar(toolbar);
        requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        resultText = findViewById(R.id.resultText);
        pointText = findViewById(R.id.textView12);
        playAgain = findViewById(R.id.playAgain);
        thisUserName = findViewById(R.id.thisUserName);
        thisUserLevel = findViewById(R.id.thisUserLevel);
        thisUserImage = findViewById(R.id.thisUserImage);
        thisScore = findViewById(R.id.myScore);
        otherUserName = findViewById(R.id.otherUserName);

        mDialog = new ProgressDialog(this);
        mDialog.setMessage("Please wait..");
        mDialog.setIndeterminate(true);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.setCancelable(false);
        BattleModel battleResult = (BattleModel) getIntent().getSerializableExtra("FinalResult");
        otherUserLevel = findViewById(R.id.otherUserLevel);
        otherUserImage = findViewById(R.id.otherUserImage);
        otherScore = findViewById(R.id.otherScore);
        topic = findViewById(R.id.topic);
        BattleViewModel battleViewModel = ViewModelProviders.of(this).get(BattleViewModel.class);
        mRecyclerView = findViewById(R.id.jhm69);
        String battleIdNew = getIntent().getStringExtra("resultId");
        thisScore.setText(String.valueOf(0));
        resultEachQuestionAdapter = new ResultEachQuestionAdapter(questionEachResultList, ResultActivity.this);
        mRecyclerView.setItemAnimator(new DefaultItemAnimator());
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
        mRecyclerView.setHasFixedSize(true);
        thisScore.setText(String.valueOf(0));
        if (battleIdNew == null && battleResult == null) {
            battlep = (BattleModel) getIntent().getSerializableExtra("start");
            try {
                for (int i = 0; i < requireNonNull(battlep).questionList.size(); i++) {
                    QuestionEachResult questionEachResult = new QuestionEachResult(battlep.senderAnswerList.get(i), battlep.questionList.get(i));
                    questionEachResultList.add(questionEachResult);
                    mRecyclerView.setAdapter(resultEachQuestionAdapter);
                    resultEachQuestionAdapter.notifyDataSetChanged();
                }
            } catch (Exception h) {
                finish();
            }

            thisScore.setText(String.valueOf(getScoreCount(requireNonNull(battlep).senderAnswerList)));
            setUserData(thisUserImage, thisUserName, thisUserLevel, battlep.senderUid, true);
            setUserData(otherUserImage, otherUserName, otherUserLevel, battlep.getReceiverUid(), false);
            resultText.setTextColor(Color.parseColor("#5570A0"));
            playAgain.setText("Go Back to home");
            resultText.setText("Waiting for opponent to play");
            pointText.setText("");
            otherScore.setText("-");
            playAgain.setOnClickListener(view -> startActivity(new Intent(getApplication(), MainActivity.class)));
        } else if (battleResult != null) {
            try {
                doThings(battleResult);
            }catch (Exception f){
                Toasty.error(getApplicationContext(), "Battle Result not found", Toast.LENGTH_SHORT).show();
                finish();
            }
        } else {
            try {
                battleViewModel.get(battleIdNew).observe(this, battlep -> {
                    if(battlep!=null){
                        Log.d("TBUG", "fromElse");
                        doThingsForMe(requireNonNull(battlep));
                    }else{
                        Toasty.error(getApplicationContext(), "Battle Result not found", Toast.LENGTH_SHORT).show();
                        finish();
                    }
                });
            } catch (Exception j) {
                if (battlep == null && questionEachResultList.size()==0) {
                    mDialog.show();
                    DatabaseReference mDb = FirebaseDatabase.getInstance().getReference();
                    Query query = mDb.child("Play").orderByChild("battleId").equalTo(battleIdNew);
                    query.addListenerForSingleValueEvent(new ValueEventListener() {
                        @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
                        @Override
                        public void onDataChange(@NonNull DataSnapshot snapshot) {
                            for (DataSnapshot data : snapshot.getChildren()) {
                                battlep = data.getValue(BattleModel.class);
                            }
                            doThingsForMe(requireNonNull(battlep));
                            mDialog.dismiss();
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError error) {
                        }
                    });
                }
            }
        }
    }


    private void setUserData(ImageView proPic, TextView name, TextView level, String uid, boolean me) {
        try {
            if (me) {
                UserViewModel userViewModel = ViewModelProviders.of(this).get(UserViewModel.class);
                userViewModel.user.observe(this, me1 -> {
                    name.setText(me1.getUsername());
                    setLevelByScore(level, (int) me1.getScore());
                    Glide.with(getApplicationContext())
                            .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                            .load(me1.getImage())
                            .into(proPic);
                });
            } else {
                FirebaseFirestore.getInstance().collection("Users")
                        .document(uid)
                        .get()
                        .addOnSuccessListener(documentSnapshot -> {
                            name.setText(documentSnapshot.getString("username"));
                            try {
                                setLevelByScore(level, Integer.parseInt(String.valueOf(documentSnapshot.getLong("score"))));
                                Glide.with(getApplicationContext())
                                        .setDefaultRequestOptions(new RequestOptions().placeholder(R.drawable.logo_round))
                                        .load(documentSnapshot.getString("image"))
                                        .into(proPic);
                            }catch (Exception ignored){

                            }
                        });
            }
        } catch (NullPointerException ignored) {

        }
        name.setOnClickListener(v ->{
            startActivity(new Intent(getApplicationContext(), FriendProfile.class).putExtra("f_id", uid));
        });
        proPic.setOnClickListener(v -> {
            startActivity(new Intent(getApplicationContext(), FriendProfile.class).putExtra("f_id", uid));
        });
    }

    private int getScoreCount(List<Boolean> scoreList) {
        int score = 0;
        try {
            for (int i = 0; i < scoreList.size(); i++) {
                if (scoreList.get(i)) {
                    score++;
                }
            }
        }catch (Exception ignored){

        }
        return score;
    }


    @SuppressLint("SetTextI18n")
    private void doThings(BattleModel battlePlay) {
        int reScore, seScore;
        reScore = getScoreCount(battlePlay.receiverList); //me
        seScore = getScoreCount(battlePlay.senderAnswerList); //other
        topic.setText(battlePlay.getTopic());
        if (battlePlay.receiverUid.equals(userId)) {
            thisScore.setText(String.valueOf(reScore));
            otherScore.setText(String.valueOf(seScore));
            try {
                questionEachResultList.clear();
                for (int i = 0; i < battlePlay.questionList.size(); i++) {
                    QuestionEachResult questionEachResult = new QuestionEachResult(battlePlay.receiverList.get(i), battlePlay.senderAnswerList.get(i), battlePlay.questionList.get(i));
                    questionEachResultList.add(questionEachResult);
                    mRecyclerView.setAdapter(resultEachQuestionAdapter);
                    resultEachQuestionAdapter.notifyDataSetChanged();
                }
            } catch (Exception ignored) {

            }
            setUserData(thisUserImage, thisUserName, thisUserLevel, battlePlay.receiverUid, true);
            setUserData(otherUserImage, otherUserName, otherUserLevel, battlePlay.senderUid, false);
            if (reScore > seScore) {
                resultText.setText("Congratulations, You Won!");
                winnerId = battlePlay.receiverUid;
                resultText.setTextColor(Color.parseColor("#4BBB4F"));
                pointText.setText("you have got 5 point");
            } else if (seScore > reScore) {
                winnerId = battlePlay.senderUid;
                resultText.setText("Damn, You Lost!");
                resultText.setTextColor(Color.parseColor("#D32F2F"));
                pointText.setText("Better luck next time");
            } else {
                resultText.setText("Match Drawn!");
                resultText.setTextColor(Color.parseColor("#5570A0"));
                pointText.setText("You were too close winning. got 2 point");
            }
            playAgain.setOnClickListener(view -> {
                Intent goBattle = new Intent(getApplicationContext(), SelectTopic.class);
                goBattle.putExtra("otherUid", battlePlay.senderUid);
                startActivity(goBattle);
            });
        }
        topic.setText(battlePlay.topic);
    }

    @SuppressLint("SetTextI18n")
    private void doThingsForMe(BattleModel battlePlay) {
        if (battlePlay.receiverUid.equals(userId)) {
            try {
                int reScore, seScore;
                reScore = getScoreCount(battlePlay.receiverList); //me
                seScore = getScoreCount(battlePlay.senderAnswerList); //other
                topic.setText(battlePlay.getTopic());
                thisScore.setText(String.valueOf(reScore));
                otherScore.setText(String.valueOf(seScore));
                try {
                    questionEachResultList.clear();
                    for (int i = 0; i < battlePlay.questionList.size(); i++) {
                        QuestionEachResult questionEachResult = new QuestionEachResult(battlePlay.receiverList.get(i), battlePlay.senderAnswerList.get(i), battlePlay.questionList.get(i));
                        questionEachResultList.add(questionEachResult);
                        mRecyclerView.setAdapter(resultEachQuestionAdapter);
                        resultEachQuestionAdapter.notifyDataSetChanged();
                    }
                } catch (Exception ignored) {

                }
                setUserData(thisUserImage, thisUserName, thisUserLevel, battlePlay.receiverUid, true);
                setUserData(otherUserImage, otherUserName, otherUserLevel, battlePlay.senderUid, false);
                if (reScore > seScore) {
                    resultText.setText("Congratulations, You Won!");
                    winnerId = battlePlay.receiverUid;
                    resultText.setTextColor(Color.parseColor("#4BBB4F"));
                    pointText.setText("you have got 5 point");
                } else if (seScore > reScore) {
                    winnerId = battlePlay.senderUid;
                    resultText.setText("Damn, You Lost!");
                    resultText.setTextColor(Color.parseColor("#D32F2F"));
                    pointText.setText("Better luck next time");
                } else {
                    resultText.setText("Match Drawn!");
                    resultText.setTextColor(Color.parseColor("#5570A0"));
                    pointText.setText("You were too close winning, Still 2 point");
                }
                playAgain.setOnClickListener(view -> {
                    Intent goBattle = new Intent(getApplicationContext(), SelectTopic.class);
                    goBattle.putExtra("otherUid", battlePlay.senderUid);
                    startActivity(goBattle);
                });
            }catch (Exception ignored){

            }
        } else {
            int reScore, seScore;
            reScore = getScoreCount(battlePlay.receiverList);
            seScore = getScoreCount(battlePlay.senderAnswerList);
            topic.setText(battlePlay.topic);
            thisScore.setText(String.valueOf(seScore));
            otherScore.setText(String.valueOf(reScore));
            setUserData(thisUserImage, thisUserName, thisUserLevel, battlePlay.senderUid, true);
            setUserData(otherUserImage, otherUserName, otherUserLevel, battlePlay.receiverUid, false);
            try {
                questionEachResultList.clear();
                for (int i = 0; i < battlePlay.questionList.size(); i++) {
                    QuestionEachResult questionEachResult = new QuestionEachResult(battlePlay.senderAnswerList.get(i), battlePlay.receiverList.get(i), battlePlay.questionList.get(i));
                    questionEachResultList.add(questionEachResult);
                    mRecyclerView.setAdapter(resultEachQuestionAdapter);
                    resultEachQuestionAdapter.notifyDataSetChanged();
                }
                if (seScore > reScore) {
                    resultText.setText("Congratulations, You Won!");
                    winnerId = battlePlay.senderUid;
                    resultText.setTextColor(Color.parseColor("#4BBB4F"));
                    pointText.setText("you have got 5 point");
                } else if (reScore > seScore) {
                    winnerId = battlePlay.receiverUid;
                    resultText.setText("Damn, You Lost!");
                    resultText.setTextColor(Color.parseColor("#D32F2F"));
                    pointText.setText("Better luck next time");
                } else {
                    resultText.setText("Match Drawn!");
                    resultText.setTextColor(Color.parseColor("#5570A0"));
                    pointText.setText("You were too close winning, Still 2 point");
                }
                playAgain.setOnClickListener(view -> {
                    Intent goBattle = new Intent(getApplicationContext(), SelectTopic.class);
                    goBattle.putExtra("otherUid", battlePlay.receiverUid);
                    startActivity(goBattle);
                });
            } catch (Exception k) {
                questionEachResultList.clear();
                for (int i = 0; i < battlePlay.questionList.size(); i++) {
                    QuestionEachResult questionEachResult = new QuestionEachResult(battlePlay.senderAnswerList.get(i), null, battlePlay.questionList.get(i));
                    questionEachResultList.add(questionEachResult);
                    mRecyclerView.setAdapter(resultEachQuestionAdapter);
                    resultEachQuestionAdapter.notifyDataSetChanged();
                }
                otherScore.setText("-");
                resultText.setText("Waiting...");
                resultText.setTextColor(Color.parseColor("#4BBB4F"));
                pointText.setText("Waiting for opponent to play");
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private void setLevelByScore(TextView levelTV, int score) {
        if (score <= 500) {
            levelTV.setText("Level: 1");
        } else if (score <= 1000) {
            levelTV.setText("Level: 2");
        } else if (score <= 1500) {
            levelTV.setText("Level: 3");
        } else if (score <= 2000) {
            levelTV.setText("Level: 4");
        } else if (score <= 2500) {
            levelTV.setText("Level: 5");
        } else if (score <= 3500) {
            levelTV.setText("Level: 6");
        } else if (score <= 5000) {
            levelTV.setText("Level: 7");
        } else {
            levelTV.setText("Level: unknown");
        }
    }

    @Override
    public void onBackPressed() {
        finish();
        super.onBackPressed();
    }
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return true;
    }
}