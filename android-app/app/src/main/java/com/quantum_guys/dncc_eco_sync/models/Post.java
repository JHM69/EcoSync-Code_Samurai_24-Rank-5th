package com.quantum_guys.dncc_eco_sync.models;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

import java.io.Serializable;

/**
 * Created by Jahangir.
 */
@SuppressWarnings("NotNullFieldNotInitialized")
@Entity
public class Post implements Serializable {
    @PrimaryKey
    @NonNull
    private String postId;
    private String userId;
    private String name;
    private String timestamp;
    private String likes;
    private String favourites;
    private String description;
    private String username;
    private String institute;
    private String dept;
    private String userimage;
    private int image_count;
    private int liked_count;
    private int comment_count;
    private String tag;
    private String image_url_0, image_url_1, image_url_2, image_url_3, image_url_4, image_url_5, image_url_6;

    public Post(@NonNull String postId, String userId, String name, String timestamp, String likes, String favourites, String description, String username, String institute, String dept, String userimage, int image_count, String image_url_0, String image_url_1, String image_url_2, String image_url_3, String image_url_4, String image_url_5, String image_url_6, int liked_count, int comment_count) {
        this.postId = postId;
        this.userId = userId;
        this.name = name;
        this.timestamp = timestamp;
        this.likes = likes;
        this.favourites = favourites;
        this.description = description;
        this.username = username;
        this.institute = institute;
        this.dept = dept;
        this.userimage = userimage;
        this.image_count = image_count;
        this.image_url_0 = image_url_0;
        this.image_url_1 = image_url_1;
        this.image_url_2 = image_url_2;
        this.image_url_3 = image_url_3;
        this.image_url_4 = image_url_4;
        this.image_url_5 = image_url_5;
        this.image_url_6 = image_url_6;
        this.liked_count = liked_count;
        this.comment_count = comment_count;
    }

    @Ignore
    public Post(@NonNull String postId, String userId, String name, String timestamp, String description, String institute, String dept, String userimage, int liked_count, int comment_count) {
        this.postId = postId;
        this.userId = userId;
        this.name = name;
        this.timestamp = timestamp;
        this.description = description;
        this.institute = institute;
        this.dept = dept;
        this.userimage = userimage;
        this.liked_count = liked_count;
        this.comment_count = comment_count;
    }

    @Ignore
    public Post() {
    }

    @NonNull
    public String getPostId() {
        return postId;
    }

    public void setPostId(@NonNull String postId) {
        this.postId = postId;
    }

    public String getInstitute() {
        return institute;
    }

    public void setInstitute(String institute) {
        this.institute = institute;
    }

    public String getDept() {
        return institute;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getImage_url_0() {
        return image_url_0;
    }

    public void setImage_url_0(String image_url_0) {
        this.image_url_0 = image_url_0;
    }

    public String getImage_url_1() {
        return image_url_1;
    }

    public void setImage_url_1(String image_url_1) {
        this.image_url_1 = image_url_1;
    }

    public String getImage_url_2() {
        return image_url_2;
    }

    public void setImage_url_2(String image_url_2) {
        this.image_url_2 = image_url_2;
    }

    public String getImage_url_3() {
        return image_url_3;
    }

    public void setImage_url_3(String image_url_3) {
        this.image_url_3 = image_url_3;
    }

    public String getImage_url_4() {
        return image_url_4;
    }

    public void setImage_url_4(String image_url_4) {
        this.image_url_4 = image_url_4;
    }

    public String getImage_url_5() {
        return image_url_5;
    }

    public void setImage_url_5(String image_url_5) {
        this.image_url_5 = image_url_5;
    }

    public String getImage_url_6() {
        return image_url_6;
    }

    public void setImage_url_6(String image_url_6) {
        this.image_url_6 = image_url_6;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getLikes() {
        return likes;
    }

    public void setLikes(String likes) {
        this.likes = likes;
    }

    public String getFavourites() {
        return favourites;
    }

    public void setFavourites(String favourites) {
        this.favourites = favourites;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserimage() {
        return userimage;
    }

    public void setUserimage(String userimage) {
        this.userimage = userimage;
    }

    public int getImage_count() {
        return image_count;
    }

    public void setImage_count(int image_count) {
        this.image_count = image_count;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public int getLiked_count() {
        return liked_count;
    }

    public void setLiked_count(int liked_count) {
        this.liked_count = liked_count;
    }

    public void setLike_count(int liked_count) {
        this.liked_count = liked_count;
    }

    public int getComment_count() {
        return comment_count;
    }

    public void setComment_count(int comment_count) {
        this.comment_count = comment_count;
    }
}

