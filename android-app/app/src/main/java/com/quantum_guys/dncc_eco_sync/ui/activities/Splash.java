package com.quantum_guys.dncc_eco_sync.ui.activities;

import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.constraintlayout.motion.widget.MotionLayout;

import com.google.firebase.auth.FirebaseAuth;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.ui.activities.account.LoginActivity;

public class Splash extends AppCompatActivity {
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
        setContentView(R.layout.activity_splash);

        MotionLayout motionLayout = findViewById(R.id.ertyu);
        motionLayout.setTransitionListener(new MotionLayout.TransitionListener() {
            @Override
            public void onTransitionStarted(MotionLayout motionLayout, int i, int i1) {

            }

            @Override
            public void onTransitionChange(MotionLayout motionLayout, int i, int i1, float v) {

            }

            @Override
            public void onTransitionCompleted(MotionLayout motionLayout, int i) {
                if (FirebaseAuth.getInstance().getCurrentUser() != null) {
                    startActivity(new Intent(getApplicationContext(), MainActivity.class).setFlags(FLAG_ACTIVITY_NEW_TASK));
                } else {
                    startActivity(new Intent(getApplicationContext(), LoginActivity.class).setFlags(FLAG_ACTIVITY_NEW_TASK));
                }
            }

            @Override
            public void onTransitionTrigger(MotionLayout motionLayout, int i, boolean b, float v) {

            }
        });

    }


}
