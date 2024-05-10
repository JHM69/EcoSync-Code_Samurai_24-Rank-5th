package com.quantum_guys.dncc_eco_sync.ui.activities.quiz;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import java.io.Serializable;

@SuppressWarnings("NotNullFieldNotInitialized")
@Entity
public class Result implements Serializable {
    @PrimaryKey
    @NonNull
    String battleId;
    String myUid;
    String otherUid;
    int myScore, otherScore;
    String topic;
    String timestamp;
    int action;

    @Ignore
    public Result() {
    }

    public Result(@NonNull String battleId, String myUid, String otherUid, int myScore, int otherScore, String topic, String timestamp, int action) {
        this.battleId = battleId;
        this.myUid = myUid;
        this.otherUid = otherUid;
        this.myScore = myScore;
        this.otherScore = otherScore;
        this.topic = topic;
        this.timestamp = timestamp;
        this.action = action;
    }

    @NonNull
    public String getBattleId() {
        return battleId;
    }

    public void setBattleId(@NonNull String battleId) {
        this.battleId = battleId;
    }

    public String getMyUid() {
        return myUid;
    }

    public void setMyUid(String senderUid) {
        this.myUid = senderUid;
    }

    public String getOtherUid() {
        return otherUid;
    }

    public void setOtherUid(String otherUid) {
        this.otherUid = otherUid;
    }

    public int getMyScore() {
        return myScore;
    }

    public void setMyScore(int myScore) {
        this.myScore = myScore;
    }

    public int getOtherScore() {
        return otherScore;
    }

    public void setOtherScore(int otherScore) {
        this.otherScore = otherScore;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }
}
