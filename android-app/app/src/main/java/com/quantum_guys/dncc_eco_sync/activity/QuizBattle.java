package com.quantum_guys.dncc_eco_sync.activity;


import static com.quantum_guys.dncc_eco_sync.view.StepView.stepAnsList;

import android.animation.Animator;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.transition.Explode;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProviders;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.model.Question;
import com.quantum_guys.dncc_eco_sync.model.Quiz;
import com.quantum_guys.dncc_eco_sync.repository.QuizResultRepository;
import com.quantum_guys.dncc_eco_sync.retrofit.ApiUtils;
import com.quantum_guys.dncc_eco_sync.retrofit.QuestionService;
import com.quantum_guys.dncc_eco_sync.view.CustomProgressDialogue;
import com.quantum_guys.dncc_eco_sync.view.StepView;
import com.quantum_guys.dncc_eco_sync.viewmodel.BattleViewModel;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Response;


public class QuizBattle extends AppCompatActivity {

    public ArrayList<Boolean> answers;
    public ArrayList<Integer> answerList;
    public int position;
    boolean destroy = false;
    int question_number;
    String offlideID;
    final String battleId = Long.toHexString(Double.doubleToLongBits(Math.random()));
    private LinearLayout optionsContainer;
    private Button next;
    private ProgressBar progressBar;
    private  TextView topicTV;
    private TextView thisScore;
    private int count = 0;
    long timeLeftInMillis = 0;
    private LinearLayout question;
    private BattleViewModel battleViewModel;
    private QuizResultRepository quizResultRepository;
    private List<Question> list;
    private int score;
    private StepView stepView;
    private CustomProgressDialogue mDialog;
    private CountDownTimer countDownTimer;
    private Quiz quiz;
    private TextView textViewCountDown;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);
        getWindow().setEnterTransition(new Explode());
        getWindow().setExitTransition(new Explode());
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_quiz_battle);
        stepAnsList = new ArrayList<>();
        offlideID = getIntent().getStringExtra("id");
        question_number = 5 ;
        topicTV = findViewById(R.id.topic);
        thisScore = findViewById(R.id.myScore);
        answers = new ArrayList<>();
        answerList = new ArrayList<>();

        question = findViewById(R.id.questionQ);
        progressBar = findViewById(R.id.progress);
        progressBar.setMax(60*1000);
        stepView = findViewById(R.id.step_view);
        list = new ArrayList<>();
        next = findViewById(R.id.next);
        textViewCountDown = findViewById(R.id.textViewCountDown);
        optionsContainer = findViewById(R.id.contaner);

        mDialog =new CustomProgressDialogue(this);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.setCancelable(false);

        position = 0;
        thisScore.setText(String.valueOf(0));


        battleViewModel = ViewModelProviders.of(this).get(BattleViewModel.class);
        if (list.size() < 5) {
            loadQuestionData();
        } else {
            try {
                playAnim(question, list.get(position).getQuestion());
            } catch (ClassCastException svs) {
                Toast.makeText(this, "error", Toast.LENGTH_SHORT).show();
            }
        }
        for (int i = 0; i < 4; i++) {
            final int selected = i;
            optionsContainer.getChildAt(i).setOnClickListener(v -> {
                LinearLayout selectedLayout = (LinearLayout) v;
                elableOption(false);
                next.setEnabled(true);
                if (selected == list.get(position).getCorrectAnswerIndex()) {
                    score += 5;
                    quiz.score+=5;
                    answers.add(position, true);
                    thisScore.setText(String.valueOf(score));
                    GradientDrawable drawable = (GradientDrawable)selectedLayout.getBackground();
                    drawable.mutate();
                    drawable.setStroke(4,Color.parseColor("#21AA27"));
                    drawable.setColor(Color.parseColor("#DCFFDE"));
                    stepAnsList.add(position, true);
                }else{
                    GradientDrawable drawable = (GradientDrawable)optionsContainer.getChildAt(list.get(position).getCorrectAnswerIndex()).getBackground();
                    drawable.mutate();
                    drawable.setStroke(4,Color.parseColor("#21AA27"));
                    drawable.setColor(Color.parseColor("#DCFFDE"));
                    answers.add(position, false);
                    drawable = (GradientDrawable)selectedLayout.getBackground();
                    drawable.mutate();
                    drawable.setStroke(4,Color.parseColor("#B11C1C"));
                    drawable.setColor(Color.parseColor("#FCD4DA"));
                    stepAnsList.add(position, false);
                }
                answerList.add(position, selected);
                AsyncTask.execute(() -> {
                    quiz.setAnswers(answers);
                    quiz.setAnswerList(answerList);
                    quiz.completed = position+1;
                    quiz.setTimestamp(System.currentTimeMillis());
                    battleViewModel.insert(quiz);
                });
                countDownTimer.cancel();
                progressBar.setVisibility(View.GONE);
            });
        }
        next.setOnClickListener(v -> {
            position++;
            goToNext(position);
        });
    }


    private void playQuestion(final View view, final int value, final String data) {
        next.setEnabled(false);
        changeColor();
        view.animate().alpha(value).scaleX(value).scaleY(value).setDuration(500).setStartDelay(100)
                .setInterpolator(new DecelerateInterpolator()).setListener(new Animator.AnimatorListener() {
                    @Override
                    public void onAnimationStart(Animator animation) {
                        if (value == 0 && count < 4) {
                            String option = list.get(position).getOptions().get(count);
                            LinearLayout linearLayout = (LinearLayout) optionsContainer.getChildAt(count);
                            playQuestion(linearLayout, 0, option);
                            count++;
                        }
                    }

                    @Override
                    public void onAnimationEnd(Animator animation) {
                        if (value == 0) {
                            LinearLayout layout = (LinearLayout) view;
                            ((TextView) layout.getChildAt(0)).setText(data);
                            view.setTag(data);
                            playQuestion(view, 1, data);
                        }
                    }

                    @Override
                    public void onAnimationCancel(Animator animation) {

                    }

                    @Override
                    public void onAnimationRepeat(Animator animation) {

                    }
                });
    }

    private void playAnim(final View view, final String data) {
        Log.d("showResult", "weds");
        startCountDown(60);
        elableOption(true);
        playQuestion(view, 0, data);
    }

    private void startCountDown(int t) {
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
        progressBar.setVisibility(View.VISIBLE);
        countDownTimer = new CountDownTimer(t * 1000L, 1000) {
            @RequiresApi(api = Build.VERSION_CODES.N)
            @Override
            public void onTick(long millisUntilFinished) {
                if ((millisUntilFinished) < (t * 1000 * 0.4)) destroy = true;
                timeLeftInMillis = millisUntilFinished;
                progressBar.setProgress((int) timeLeftInMillis, true);
                updateCountDownText();
            }

            @Override
            public void onFinish() {
                timeLeftInMillis = 0;
                countDownTimer.cancel();
                updateCountDownText();
                next.setEnabled(true);
                elableOption(false);
                LinearLayout CorrectLayout;
                CorrectLayout = (LinearLayout) optionsContainer.getChildAt(list.get(position).getCorrectAnswerIndex());
                GradientDrawable drawable = (GradientDrawable) CorrectLayout.getBackground();
                drawable.mutate();
                drawable.setStroke(4,Color.parseColor("#21AA27"));
                drawable.setColor(Color.parseColor("#DCFFDE"));
                stepAnsList.add(position, false);
                progressBar.setVisibility(View.GONE);
                showResult();
            }
        }.start();
    }

    @SuppressLint({"ResourceAsColor", "SetTextI18n"})
    private void updateCountDownText() {
        int seconds = (int) (timeLeftInMillis / 1000) % 60;
        String timeFormatted = String.format(Locale.getDefault(), "%02d", seconds);
        textViewCountDown.setText(timeFormatted + " s");
        if (timeLeftInMillis < 10000) {
            textViewCountDown.setTextColor(Color.RED);
        } else {
            textViewCountDown.setTextColor(R.color.white);
        }
    }


    @SuppressLint("ResourceAsColor")
    private void changeColor() {
        for(int i=0; i<4; i++){
            LinearLayout option = (LinearLayout) optionsContainer.getChildAt(i);
            GradientDrawable drawable = (GradientDrawable) option.getBackground();
            drawable.mutate();
            drawable.setStroke(4,Color.parseColor("#848280"));
            drawable.setColor(Color.parseColor("#FCFDFD"));
        }
    }

    private void elableOption(boolean enable) {
        for (int i = 0; i < 4; i++) {
            LinearLayout linearLayout = (LinearLayout) optionsContainer.getChildAt(i);
            linearLayout.setEnabled(enable);
            if (enable) {
                LinearLayout layout = (LinearLayout) optionsContainer.getChildAt(i);
                GradientDrawable drawable = (GradientDrawable) layout.getBackground();
                drawable.mutate();
                drawable.setStroke(4,Color.parseColor("#848280"));
                drawable.setColor(Color.parseColor("#FCFDFD"));
            }
        }
    }

    @SuppressLint("CheckResult")
    private void loadQuestionData() {
        try {
            mDialog.show();
            if (offlideID != null) {
                try {
                    Toast.makeText(this, "Resuming battle...", Toast.LENGTH_SHORT).show();
                    quizResultRepository = new QuizResultRepository(getApplication());
                    quiz = quizResultRepository.getDeadBattleOffline(offlideID);
                    mDialog.dismiss();
                    if (!quiz.isCompleted()) {
                        position = quiz.getCompleted();
                        score = quiz.getScore();
                        question_number = list.size();
                        thisScore.setText(String.valueOf(score));
                        list = Objects.requireNonNull(quiz).getQuestionList();
                        for(int i=0; i<list.size(); i++){
                            list.get(i).setUpOptions();
                        }
                        question_number = Objects.requireNonNull(quiz).getQuestionList().size();
                        try {
                            playAnim(question, list.get(position).getQuestion());
                        } catch (Exception vhjkj) {
                            Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                        try {
                            stepView.getState()
                                    .animationType(StepView.ANIMATION_ALL)
                                    .nextStepCircleEnabled(true)
                                    .stepsNumber(list.size())
                                    .commit();
                        } catch (Exception xcz) {
                            Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                        answers = quiz.getAnswers();
                        answerList = quiz.getAnswerList();
                        for (int i = 0; i < question_number; i++) {
                            stepAnsList.add(false);
                        }
                        for (int i = 0; i < position; i++) {
                            stepAnsList.set(i, quiz.getAnswers().get(i));
                        }
                        stepView.go(position, true, true);
                    }
                } catch (Exception fd) {
                    Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT).show();
                    finish();
                }
            } else {
                try {
                    String type = getIntent().getStringExtra("category");
                    String difficulty = getIntent().getStringExtra("difficulty");
                    topicTV.setText(type);
                    QuestionService questionService;
                    questionService = ApiUtils.getQuestionService();
                    questionService.getQuestions(type, difficulty, "5").enqueue(new retrofit2.Callback() {
                        @Override
                        public void onResponse(@NotNull Call call, @NotNull Response response) {

                            if (response.isSuccessful()) {
                                list = (List<Question>) response.body();
                                position = 0;
                                for(int i = 0; i< Objects.requireNonNull(list).size(); i++){
                                    list.get(i).setUpOptions();
                                }
                                score = 0;
                                thisScore.setText("0");
                                question_number = list.size();
                                try {
                                    playAnim(question, list.get(position).getQuestion());
                                } catch (Exception vhjkj) {
                                    Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT).show();
                                    finish();
                                }
                                try {
                                    stepView.getState()
                                            .animationType(StepView.ANIMATION_ALL)
                                            .nextStepCircleEnabled(true)
                                            .stepsNumber(list.size())
                                            .commit();
                                } catch (Exception xcz) {
                                    Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT).show();
                                    finish();
                                }
                                answers = new ArrayList<>();
                                answerList = new ArrayList<>();
                                for (int i = 0; i < question_number; i++) {
                                    stepAnsList.add(false);
                                }
                                stepView.go(position, true, true);
                                quiz = new Quiz(type,
                                        difficulty,
                                        answers,
                                        System.currentTimeMillis(),
                                        list,
                                        battleId,
                                        0,
                                        0
                                );
                                mDialog.dismiss();
                            }
                        }

                        @Override
                        public void onFailure(@NonNull Call call, @NonNull Throwable t) {
                            mDialog.dismiss();
                            Log.d("Exep", String.valueOf(t.getCause()));
                            Toast.makeText(getApplicationContext(), "NO Network Connection, try again later", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                    });
                } catch (NullPointerException jj) {
                    Log.d("SSSF", jj.getMessage());
                    finish();
                    Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();
                }
            }
        } catch (Exception h) {
            Toast.makeText(getApplicationContext(), "Error", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    private void goToNext(int which) {
        try {
            progressBar.setVisibility(View.VISIBLE);
            stepView.go(which, true, answers.get(which - 1));
            next.setEnabled(false);
            elableOption(true);
            if (which == list.size()-1) {
                next.setText(R.string.submit);
            }if (which >= list.size()) {
                mDialog.show();
                startActivity(new Intent(getApplicationContext(), ResultActivity.class).putExtra("id", quiz.getBattleId()));
                finish();
            } else {
                playAnim(question, list.get(which).getQuestion());
            }
            count = 0;
        } catch (Exception d) {
            Log.d("Errorrr", d.getMessage());
            finish();
        }
    }

    private void showResult() {
        AsyncTask.execute(() -> {
            answers.add(position, false);
            quiz.completed++;
            quiz.setAnswers(answers);
            quiz.setCompleted(list.size());
            battleViewModel.insert(quiz);
        });
    }


    public void onPause() {
        super.onPause();
    }


    @Override
    protected void onDestroy() {
        try {
            if (destroy) showResult();
        } catch (Exception ignored) {

        }
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        new AlertDialog.Builder(this)
                .setTitle("Quite?")
                .setMessage("Are you sure want to quite and go back, if question time is less than 15s, this question will be count as wrong")
                .setPositiveButton("Yes", (dialog, which) -> {
                    int seconds = (int) (timeLeftInMillis / 1000) % 60;
                    if (seconds < 15) {
                        timeLeftInMillis = 0;
                        countDownTimer.cancel();
                        updateCountDownText();
                        stepAnsList.add(position, false);
                        showResult();
                    } else {
                        countDownTimer.cancel();
                    }
                    finish();
                })
                .setCancelable(false)
                .setNegativeButton("No", null)
                .show();
    }
}