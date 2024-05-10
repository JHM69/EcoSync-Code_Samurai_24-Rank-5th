package com.quantum_guys.dncc_eco_sync.ui.views;

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;

public class SFImageView extends androidx.appcompat.widget.AppCompatImageView {

    public SFImageView(Context context) {
        super(context);
    }

    public SFImageView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public SFImageView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        Drawable d = getDrawable();
        if (d != null) {
            int w = MeasureSpec.getSize(widthMeasureSpec);
            int h = w * d.getIntrinsicHeight() / d.getIntrinsicWidth();
            setMeasuredDimension(w, h);
        } else super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }
}