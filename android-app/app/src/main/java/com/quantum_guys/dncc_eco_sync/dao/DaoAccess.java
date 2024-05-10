package com.quantum_guys.dncc_eco_sync.dao;


import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.quantum_guys.dncc_eco_sync.messege.model.Chat;
import com.quantum_guys.dncc_eco_sync.messege.model.Chatlist;
import com.quantum_guys.dncc_eco_sync.models.Post;
import com.quantum_guys.dncc_eco_sync.models.Users;

import java.util.List;

@Dao
public interface DaoAccess {

    //--------------for user handing
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Users member);

    @Query("SELECT * FROM Users WHERE id =:id")
    Users getTask(String id);

    @Query("SELECT * FROM Users WHERE id =:uid")
    LiveData<Users> getLiveTask(String uid);

    @Query("SELECT * FROM Users WHERE id =:uid")
    Users getStaticUser(String uid);

    @Update
    void update(Users users);

    @Query("UPDATE Users SET score=score+:score WHERE id = :id")
    void updateScore(int score, String id);

    @Query("UPDATE Users SET win=win+:score WHERE id = :id")
    void updateWin(int score, String id);

    @Query("UPDATE Users SET lose=lose+:score WHERE id = :id")
    void updateLose(int score, String id);

    @Query("UPDATE Users SET draw=draw+:score WHERE id = :id")
    void updateDraw(int score, String id);

    @Query("UPDATE Users SET image=:df WHERE id = :id")
    void updateUserImage(String df, String id);

    @Query("UPDATE Users SET reward=reward+:score WHERE id = :id")
    void updateXp(int score, String id);

    @Query("UPDATE Users SET reward=:score WHERE id = :id")
    void setReward(int score, String id);



    //-----------------------------------


    @Query("UPDATE Users SET score=:score WHERE id = :id")
    void setScore(int score, String id);

    @Query("UPDATE Users SET win=:score WHERE id = :id")
    void setWin(int score, String id);

    @Query("UPDATE Users SET lose=:score WHERE id = :id")
    void setLose(int score, String id);

    @Query("UPDATE Users SET draw=:score WHERE id = :id")
    void setDraw(int score, String id);

    @Query("UPDATE Users SET reward=:score WHERE id = :id")
    void setXp(int score, String id);


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertPost(Post post);

    @Query("SELECT * FROM Post WHERE postId =:taskId")
    LiveData<Post> getPost(String taskId);

    @Query("SELECT * FROM Post ORDER BY timestamp")
    LiveData<List<Post>> getAllSavedPost();

    @Delete
    void deletePost(Post result);


    @Query("SELECT * FROM Chatlist ORDER BY lastTimestamp DESC")
    LiveData<List<Chatlist>> getAllUser();

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertUser(Chatlist chatlist);


    @Query("DELETE FROM Chatlist WHERE id = :string")
    int deleteChat(String string);

    @Query("SELECT * FROM Chat WHERE sender = :u OR receiver = :u ORDER BY timestamp ASC")
    LiveData<List<Chat>> getAllChat(String u);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    Long insertMessage(Chat chat);

    @Query("DELETE FROM Users WHERE id = :id")
    void deleteUser(String id);
}
