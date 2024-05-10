package com.quantum_guys.dncc_eco_sync.ui.activities.notification;

import android.annotation.SuppressLint;
import android.app.DownloadManager;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowInsets;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.NotificationCompat;

import com.afollestad.materialdialogs.MaterialDialog;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.DialogOnDeniedPermissionListener;
import com.karumi.dexter.listener.single.PermissionListener;

import com.quantum_guys.dncc_eco_sync.R;

import java.util.ArrayList;
import java.util.Objects;

import es.dmoral.toasty.Toasty;

public class ImagePreviewSave extends AppCompatActivity {


    String intent_URL;
    final ArrayList<Long> list = new ArrayList<>();


    public final BroadcastReceiver onComplete = new BroadcastReceiver() {

        public void onReceive(Context ctxt, Intent intent) {

            long referenceId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            list.remove(referenceId);
            if (list.isEmpty()) {
                NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

                NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(
                        ImagePreviewSave.this, "other_channel");

                android.app.Notification notification;
                notification = mBuilder
                        .setAutoCancel(true)
                        .setContentTitle("স্বচ্ছ ঢাকা")
                        .setColorized(true)
                        .setColor(Color.parseColor("#2591FC"))
                        .setSmallIcon(R.drawable.ic_file_download_accent_24dp)
                        .setContentText("Image saved at Downloads/battle_of_quiz/")
                        .build();

                notificationManager.notify(0, notification);
                Toasty.success(ctxt, "Image saved at Downloads/battle_of_quiz/", Toasty.LENGTH_LONG, true).show();
            }
        }

    };
    private long refid;
    private DownloadManager downloadManager;

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(onComplete);
    }


    @Override
    public void finish() {
        super.finish();
        overridePendingTransitionExit();
    }

    @Override
    public void startActivity(Intent intent) {
        super.startActivity(intent);
        overridePendingTransitionEnter();
    }

    /**
     * Overrides the pending Activity transition by performing the "Enter" animation.
     */
    protected void overridePendingTransitionEnter() {
        overridePendingTransition(R.anim.slide_from_right, R.anim.slide_to_left);
    }

    /**
     * Overrides the pending Activity transition by performing the "Exit" animation.
     */
    protected void overridePendingTransitionExit() {
        overridePendingTransition(R.anim.slide_from_left, R.anim.slide_to_right);
    }

    @SuppressLint("UseCompatLoadingForDrawables")
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


        setContentView(R.layout.activity_image_preview_save);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().getDecorView().getWindowInsetsController().hide(
                    WindowInsets.Type.statusBars()
            );
        }else{
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_FULLSCREEN;
            decorView.setSystemUiVisibility(uiOptions);
        }
        Toolbar toolbar = findViewById(R.id.toolbar5);
        setSupportActionBar(toolbar);
        toolbar.setTitle("Zoom Image");
        toolbar.setTitleTextColor(Color.WHITE);

        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        intent_URL = getIntent().getStringExtra("url");

        registerReceiver(onComplete,
                new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));

        downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);

        ImageView photoView = findViewById(R.id.photo_view);
        if (getSharedPreferences("Theme", MODE_PRIVATE).getBoolean("DarkTheme", false)) {
            Glide.with(this)
                    .setDefaultRequestOptions(new RequestOptions().placeholder(getResources().getDrawable(R.drawable.placeholder)))
                    .load(intent_URL)
                    .into(photoView);
        } else {
            Glide.with(this)
                    .setDefaultRequestOptions(new RequestOptions().placeholder(getResources().getDrawable(R.drawable.placeholder2)))
                    .load(intent_URL)
                    .into(photoView);
        }


    }

    public boolean isOnline() {
        ConnectivityManager cm =
                (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return netInfo != null && netInfo.isConnectedOrConnecting();
    }

    private void downloadImage(final String ImageURI) {

        new MaterialDialog.Builder(this)
                .title("Save Image")
                .content("Do you want to save this image?")
                .positiveText("YES")
                .negativeText("NO")
                .onPositive((dialog, which) -> {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(ImageURI));
                    request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI | DownloadManager.Request.NETWORK_MOBILE);
                    request.setAllowedOverRoaming(true);
                    request.setTitle("স্বচ্ছ ঢাকা");
                    request.setDescription("Downloading image...");
                    request.setVisibleInDownloadsUi(true);
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "/battle_of_quiz Images/" + "/dt_" + System.currentTimeMillis() + ".jpeg");
                    refid = downloadManager.enqueue(request);
                    list.add(refid);


                }).onNegative((dialog, which) -> dialog.dismiss()).show();

    }

    public void saveImage() {
        Dexter.withActivity(this)
                .withPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                .withListener(new PermissionListener() {
                    @Override
                    public void onPermissionGranted(PermissionGrantedResponse response) {
                        if (isOnline()) {
                            downloadImage(intent_URL);
                        } else {
                            Toasty.error(ImagePreviewSave.this, "No internet connection", Toasty.LENGTH_SHORT, true).show();
                        }
                    }

                    @Override
                    public void onPermissionDenied(PermissionDeniedResponse response) {
                        if (response.isPermanentlyDenied()) {
                            DialogOnDeniedPermissionListener.Builder
                                    .withContext(ImagePreviewSave.this)
                                    .withTitle("Storage permission")
                                    .withMessage("Storage permission is needed for downloading images.")
                                    .withButtonText(android.R.string.ok)
                                    .build();
                        }
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(PermissionRequest permission, PermissionToken token) {

                    }
                }).check();

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.save, menu);
        return true;
    }
    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.save) {
            saveImage();
        }
        return super.onOptionsItemSelected(item);
    }
    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }
}
