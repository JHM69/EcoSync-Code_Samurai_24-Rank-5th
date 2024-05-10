package com.quantum_guys.dncc_eco_sync.models;



import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.quantum_guys.dncc_eco_sync.utils.BooleanLiatConverter;
import com.quantum_guys.dncc_eco_sync.utils.DataTypeConverterQuestion;
import com.quantum_guys.dncc_eco_sync.utils.IntLiatConverter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("NotNullFieldNotInitialized")

@Entity
public class Quiz implements Serializable {

    public String topic;
    public String difficulty;
    @TypeConverters(BooleanLiatConverter.class)
    public ArrayList<Boolean> answers;

    @TypeConverters(IntLiatConverter.class)
    public ArrayList<Integer> answerList;

    long timestamp;
    @TypeConverters(DataTypeConverterQuestion.class)
    List<Question> questionList;
    @PrimaryKey
    @NonNull
    String battleId;

    public int score=0;
    public int completed=0;

    @Ignore
    public Quiz() {
    }

    public Quiz(String topic, String difficulty, ArrayList<Boolean> answers, long timestamp, List<Question> questionList, @NonNull String battleId, int score, int completed) {
        this.topic = topic;
        this.difficulty = difficulty;
        this.answers = answers;
        this.timestamp = timestamp;
        this.questionList = questionList;
        this.battleId = battleId;
        this.score = score;
        this.completed = completed;
    }

    public String getTopic() {
        topic = topic.replaceAll("_", " ");
        if(topic.length()> 25){
            return topic.substring(0, 25).replaceAll(",$", "")+"...";
        }
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public ArrayList<Boolean> getAnswers() {
        return answers;
    }

    public void setAnswers(ArrayList<Boolean> answers) {
        this.answers = answers;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public List<Question> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<Question> questionList) {
        this.questionList = questionList;
    }

    @NonNull
    public String getBattleId() {
        return battleId;
    }

    public void setBattleId(@NonNull String battleId) {
        this.battleId = battleId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getCompleted() {
        return completed;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }

    public boolean isCompleted() {
        return completed==questionList.size();
    }

    public ArrayList<Integer> getAnswerList() {
        return answerList;
    }

    public void setAnswerList(ArrayList<Integer> answerList) {
        this.answerList = answerList;
    }
}