package com.quantum_guys.dncc_eco_sync.models;

public class McqAnswered {
    int position, myAns, real_ans;
    boolean hoise_naki;

    public McqAnswered(int position, int myAns, int real_ans, boolean hoise_naki) {
        this.position = position;
        this.myAns = myAns;
        this.real_ans = real_ans;
        this.hoise_naki = hoise_naki;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getReal_ans() {
        return real_ans;
    }

    public void setReal_ans(int real_ans) {
        this.real_ans = real_ans;
    }

    public int getMyAns() {
        return myAns;
    }

    public void setMyAns(int myAns) {
        this.myAns = myAns;
    }

    public boolean isHoise_naki() {
        return hoise_naki;
    }

    public void setHoise_naki(boolean hoise_naki) {
        this.hoise_naki = hoise_naki;
    }
}
