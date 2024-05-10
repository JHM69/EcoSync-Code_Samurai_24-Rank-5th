package com.quantum_guys.dncc_eco_sync.ui.activities.quiz;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import com.quantum_guys.dncc_eco_sync.models.Question;
import com.quantum_guys.dncc_eco_sync.utils.BooleanLiatConverter;
import com.quantum_guys.dncc_eco_sync.utils.DataTypeConverterQuestion;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("NotNullFieldNotInitialized")
@Entity
public class BattleModel implements Serializable {

    public String topic;
    @TypeConverters(BooleanLiatConverter.class)
    public
    ArrayList<Boolean> receiverList;
    @TypeConverters(BooleanLiatConverter.class)
    public ArrayList<Boolean> senderAnswerList;
    String senderUid, receiverUid;
    String timestamp;
    String winner;
    Boolean scoreUpdated;
    @TypeConverters(DataTypeConverterQuestion.class)
    List<Question> questionList;
    @PrimaryKey
    @NonNull
    String battleId;

    @Ignore
    public BattleModel() {
    }

    public BattleModel(String senderUid, String receiverUid, List<Question> questionList, ArrayList<Boolean> senderAnswerList, ArrayList<Boolean> receiverList, String timestamp, String winner, @NonNull String battleId, String topic, Boolean scoreUpdated) {
        this.senderUid = senderUid;
        this.receiverUid = receiverUid;
        this.questionList = questionList;
        this.senderAnswerList = senderAnswerList;
        this.receiverList = receiverList;
        this.timestamp = timestamp;
        this.winner = winner;
        this.battleId = battleId;
        this.topic = topic;
        this.scoreUpdated = scoreUpdated;
    }

    public String getSenderUid() {
        return senderUid;
    }

    public void setSenderUid(String senderUid) {
        this.senderUid = senderUid;
    }

    public String getReceiverUid() {
        return receiverUid;
    }

    public void setReceiverUid(String receiverUid) {
        this.receiverUid = receiverUid;
    }

    public List<Question> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<Question> questionList) {
        this.questionList = questionList;
    }

    public ArrayList<Boolean> getSenderAnswerList() {
        return senderAnswerList;
    }

    public void setSenderAnswerList(ArrayList<Boolean> senderAnswerList) {
        this.senderAnswerList = senderAnswerList;
    }

    public List<Boolean> getReceiverList() {
        return receiverList;
    }

    public void setReceiverList(ArrayList<Boolean> receiverList) {
        this.receiverList = receiverList;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getWinner() {
        return winner;
    }

    public void setWinner(String winner) {
        this.winner = winner;
    }

    @SuppressWarnings("NullableProblems")
    public String getBattleId() {
        return battleId;
    }

    public void setBattleId(@NonNull String battleId) {
        this.battleId = battleId;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Boolean getScoreUpdated() {
        return scoreUpdated;
    }

    public void setScoreUpdated(Boolean scoreUpdated) {
        this.scoreUpdated = scoreUpdated;
    }
}