package com.quantum_guys.dncc_eco_sync.activity;


import static java.util.Objects.requireNonNull;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.github.marlonlom.utilities.timeago.TimeAgo;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapter.ResultEachQuestionAdapter;
import com.quantum_guys.dncc_eco_sync.viewmodel.BattleViewModel;


public class ResultActivity extends AppCompatActivity {
    public ProgressDialog mDialog;
    Button playAgain;
    RecyclerView mRecyclerView;
    ResultEachQuestionAdapter resultEachQuestionAdapter;
    @SuppressLint({"SetTextI18n", "InflateParams", "NotifyDataSetChanged"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        setContentView(R.layout.activity_result);
        Toolbar toolbar = findViewById(R.id.toolbar2);
        String id = getIntent().getStringExtra("id");

        setSupportActionBar(toolbar);
        requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        playAgain = findViewById(R.id.playAgain);



        mDialog = new ProgressDialog(this);
        mDialog.setMessage("Please wait..");
        mDialog.setIndeterminate(true);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.setCancelable(false);

        TextView topic = findViewById(R.id.topic);
        //score = findViewById(R.id.textView6);
        BattleViewModel battleViewModel = ViewModelProviders.of(this).get(BattleViewModel.class);
        mRecyclerView = findViewById(R.id.recv);

        battleViewModel.getBattle(id).observe(this, quiz -> {
            toolbar.setSubtitle("Played "+ TimeAgo.using(quiz.getTimestamp()));
            resultEachQuestionAdapter = new ResultEachQuestionAdapter(quiz.getQuestionList(), quiz.answers, quiz.answerList,ResultActivity.this);
            mRecyclerView.setItemAnimator(new DefaultItemAnimator());
            mRecyclerView.setLayoutManager(new LinearLayoutManager(getApplicationContext()));
            mRecyclerView.setHasFixedSize(true);
            mRecyclerView.setAdapter(resultEachQuestionAdapter);
            resultEachQuestionAdapter.notifyDataSetChanged();
            //score.setText(quiz.getScore());
            topic.setText("score : "+quiz.getScore());
           playAgain.setOnClickListener(view -> startActivity(new Intent(getApplication(), SelectCategory.class)));
        });

    }

}