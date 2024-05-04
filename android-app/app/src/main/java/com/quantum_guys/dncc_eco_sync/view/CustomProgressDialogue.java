package com.quantum_guys.dncc_eco_sync.view;

import android.app.Dialog;
import android.content.Context;
import android.media.Image;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.RotateAnimation;
import android.widget.ImageView;

import com.quantum_guys.dncc_eco_sync.R;

public class CustomProgressDialogue extends Dialog {

    private ImageView imageView;
    private boolean isRotatedLeft = false;

    public CustomProgressDialogue(Context context) {
        super(context);

        WindowManager.LayoutParams wlmp = getWindow().getAttributes();

        wlmp.gravity = Gravity.CENTER_HORIZONTAL;
        getWindow().setAttributes(wlmp);
        setTitle(null);
        setCancelable(false);
        setOnCancelListener(null);
        View view = LayoutInflater.from(context).inflate(
                R.layout.dialog, null);



        setContentView(view);


        imageView = findViewById(R.id.animationView);

        if (isRotatedLeft) {
            rotateRight();
        } else {
            rotateLeft();
        }
        isRotatedLeft = !isRotatedLeft;




    }



    private void rotateLeft() {
        RotateAnimation rotate = new RotateAnimation(0, -45, Animation.RELATIVE_TO_SELF,
                0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        rotate.setDuration(500);
        rotate.setFillAfter(true);
        imageView.startAnimation(rotate);
    }

    private void rotateRight() {
        RotateAnimation rotate = new RotateAnimation(0, 45, Animation.RELATIVE_TO_SELF,
                0.5f, Animation.RELATIVE_TO_SELF, 0.5f);
        rotate.setDuration(500);
        rotate.setFillAfter(true);
        imageView.startAnimation(rotate);
    }
}