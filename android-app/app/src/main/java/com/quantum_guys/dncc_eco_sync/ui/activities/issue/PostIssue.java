package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import static android.view.View.GONE;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationListener;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Parcelable;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.viewpager.widget.ViewPager;

import com.afollestad.materialdialogs.MaterialDialog;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.marcoscg.dialogsheet.DialogSheet;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.adapters.PagerPhotosAdapter;
import com.quantum_guys.dncc_eco_sync.models.Images;
import com.quantum_guys.dncc_eco_sync.service.UploadService;
import com.quantum_guys.dncc_eco_sync.utils.MathView;
import com.quantum_guys.dncc_eco_sync.utils.RichEditor;
import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;
import com.yalantis.ucrop.UCrop;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Random;

import es.dmoral.toasty.Toasty;

@SuppressWarnings("UnusedAssignment")
public class PostIssue extends AppCompatActivity implements LocationListener {

    List<Images> imagesList;
    ViewPager pager;
    Spinner type;
    PagerPhotosAdapter adapter;
    final ArrayList<String> uploadedImagesUrl = new ArrayList<>();
    String tag;
    RichEditor mRichEd;
    String address;
    private FirebaseUser mCurrentUser;
    private DotsIndicator indicator;
    private RelativeLayout indicator_holder;
    private int selectedIndex;
    private SharedPreferences sharedPreferences;
    private int serviceCount;
    private ConstraintLayout codeLayout;
    EditText latexText, codeText;
    EditText addressView;

    double lat, lon;
    public static void startActivity(Context context) {
        Intent intent = new Intent(context, PostIssue.class);
        context.startActivity(intent);
    }
    boolean isHead;
    @NonNull
    public static String random() {
        Random generator = new Random();
        StringBuilder randomStringBuilder = new StringBuilder();
        int randomLength = generator.nextInt(10);
        char tempChar;
        for (int i = 0; i < randomLength; i++) {
            tempChar = (char) (generator.nextInt(96) + 32);
            randomStringBuilder.append(tempChar);
        }
        return randomStringBuilder.toString();
    }

    public static void insertData(String latexData, RichEditor mEditor) {
        mEditor.insertLatex(latexData);
    }

    public static void addExtraLatex(String data, EditText latexText) {
        int start = Math.max(latexText.getSelectionStart(), 0);
        int end = Math.max(latexText.getSelectionEnd(), 0);
        latexText.getText().replace(Math.min(start, end), Math.max(start, end),
                data, 0, data.length());
    }

    @Override
    public boolean onSupportNavigateUp() {

        onBackPressed();

        return true;
    }

    @Override
    public void onBackPressed() {
        new MaterialDialog.Builder(this)
                .title("Discard")
                .content("Are you sure do you want to go back?")
                .positiveText("Yes")
                .canceledOnTouchOutside(false)
                .cancelable(false)
                .onPositive((dialog, which) -> finish())
                .negativeText("No")
                .show();
    }

    Switch postAnnounimasentSwitch;

    Boolean isAnonymous;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.AppTheme);
        setContentView(R.layout.activity_issue_image);
        imagesList = getIntent().getParcelableArrayListExtra("imagesList");

        askPermission();

        if (imagesList.isEmpty()) {
            finish();
        }
        Window window = this.getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(ContextCompat.getColor(getApplicationContext(), R.color.statusBar));
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setTitle("Issue with Image");
        latexText = findViewById(R.id.latex_equation);
        codeText = findViewById(R.id.code);
        type = findViewById(R.id.spinner_type);
        addressView = findViewById(R.id.address);
        postAnnounimasentSwitch = findViewById(R.id.switch1);
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(getApplicationContext(), android.R.layout.simple_list_item_1, getResources().getStringArray(R.array.issues));
        arrayAdapter.setDropDownViewResource(android.R.layout.simple_expandable_list_item_1);
        type.setAdapter(arrayAdapter);
        type.setOnItemSelectedListener(new TypeXSpinnerClass());

        try {
            Objects.requireNonNull(getSupportActionBar()).setTitle("Issue with Image");
        } catch (Exception e) {
            e.printStackTrace();
        }
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);

        pager = findViewById(R.id.pager);
        indicator = findViewById(R.id.indicator);
        indicator_holder = findViewById(R.id.indicator_holder);

        postAnnounimasentSwitch.setOnCheckedChangeListener((compoundButton, b) -> {
            isAnonymous = b;
        });

        indicator.setDotsClickable(true);
        adapter = new PagerPhotosAdapter(this, imagesList);
        pager.setAdapter(adapter);
        mRichEd = findViewById(R.id.editPost);
        setUpLaTexEditor(mRichEd,null, 200);
        if (imagesList.size() > 1) {
            indicator_holder.setVisibility(View.VISIBLE);
            indicator.setViewPager(pager);
        } else {
            indicator_holder.setVisibility(GONE);
        }

        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        mCurrentUser = mAuth.getCurrentUser();

        sharedPreferences = getSharedPreferences("uploadservice", MODE_PRIVATE);
        serviceCount = sharedPreferences.getInt("count", 0);

    }

    public void setUpLaTexEditor(RichEditor mEditor, MathView mathView, int height) {
        mEditor.setEditorHeight(height);
        mEditor.setEditorFontSize(18);
        mEditor.setPadding(10, 10, 10, 10);
        mEditor.setPlaceholder("Start Witting your issue/complain here...");
        mEditor.setOnTextChangeListener(text -> {
            try {
                mathView.setDisplayText(text);
            } catch (NullPointerException ignored) {

            }
        });
        codeLayout = findViewById(R.id.code_editor);

        findViewById(R.id.action_undo).setOnClickListener(v -> mEditor.undo());

        findViewById(R.id.action_redo).setOnClickListener(v -> mEditor.redo());

        findViewById(R.id.action_bold).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_bold).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_bold).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setBold();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_italic).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_italic).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_italic).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setItalic();
                isChanged = !isChanged;
            }
        });


        findViewById(R.id.action_subscript).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_subscript).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_subscript).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setSubscript();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_superscript).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_superscript).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_superscript).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setSuperscript();
                isChanged = !isChanged;
            }
        });


        findViewById(R.id.action_strikethrough).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_strikethrough).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_strikethrough).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setStrikeThrough();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_underline).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_underline).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_underline).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setUnderline();
                isChanged = !isChanged;
            }
        });


        findViewById(R.id.action_heading1).setOnClickListener(v ->{
            if(!isHead){
                findViewById(R.id.action_heading1).setBackgroundColor(getResources().getColor(R.color.selectted));
            }else{
                findViewById(R.id.action_heading1).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
            }
            isHead=!isHead;
            mEditor.setHeading(1);
        });

        findViewById(R.id.action_heading2).setOnClickListener(v -> {
            if(!isHead){
                findViewById(R.id.action_heading2).setBackgroundColor(getResources().getColor(R.color.selectted));
            }else{
                findViewById(R.id.action_heading2).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
            }
            isHead=!isHead;
            mEditor.setHeading(2);
        });

        findViewById(R.id.action_heading3).setOnClickListener(v -> {
            if(!isHead){
                findViewById(R.id.action_heading3).setBackgroundColor(getResources().getColor(R.color.selectted));
            }else{
                findViewById(R.id.action_heading3).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
            }
            isHead=!isHead;
            mEditor.setHeading(3);

        });

        findViewById(R.id.action_heading4).setOnClickListener(v -> {
            if(!isHead){
                findViewById(R.id.action_heading4).setBackgroundColor(getResources().getColor(R.color.selectted));
            }else{
                findViewById(R.id.action_heading4).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
            }
            isHead=!isHead;
            mEditor.setHeading(4);
        });

        findViewById(R.id.action_heading5).setOnClickListener(v -> {
            if(!isHead){
                findViewById(R.id.action_heading5).setBackgroundColor(getResources().getColor(R.color.selectted));
            }else{
                findViewById(R.id.action_heading5).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
            }
            isHead=!isHead;
            mEditor.setHeading(5);
        });

        findViewById(R.id.action_heading6).setOnClickListener(v -> {
            if(!isHead){
                findViewById(R.id.action_heading6).setBackgroundColor(getResources().getColor(R.color.selectted));
            }else{
                findViewById(R.id.action_heading6).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
            }
            isHead=!isHead;
            mEditor.setHeading(6);
        });


        findViewById(R.id.action_txt_color).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @SuppressLint("ResourceType")
            @Override
            public void onClick(View v) {
                if(!isChanged){
                    findViewById(R.id.action_txt_color).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_txt_color).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setTextColor(isChanged ? Color.BLACK : getResources().getColor(R.color.colorAccentt));
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_bg_color).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @SuppressLint("ResourceType")
            @Override
            public void onClick(View v) {
                if(!isChanged){
                    findViewById(R.id.action_bg_color).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_bg_color).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setTextBackgroundColor(isChanged ? Color.TRANSPARENT : getResources().getColor(R.color.backG));
                isChanged = !isChanged;
            }
        });


        findViewById(R.id.action_indent).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_indent).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_indent).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setIndent();
                isChanged = !isChanged;
            }
        });


        findViewById(R.id.action_outdent).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_outdent).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_outdent).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setOutdent();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_align_left).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_align_left).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_align_left).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setAlignLeft();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_align_center).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_align_center).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_align_center).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setAlignCenter();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.insert_code).setOnClickListener(view -> {
            if (codeLayout.getVisibility() == View.GONE) {
                findViewById(R.id.insert_code).setBackgroundColor(getResources().getColor(R.color.selectted));
                codeLayout.setVisibility(View.VISIBLE);
                findViewById(R.id.submit_code).setOnClickListener(view115 -> {
                    String data1 = codeText.getText().toString();
                    mRichEd.setCode(data1);
                    data1 = "";
                    codeText.setText("");
                    codeLayout.setVisibility(View.GONE);
                });
            } else {
                findViewById(R.id.insert_code).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                codeLayout.setVisibility(View.GONE);
            }
        });

        findViewById(R.id.action_align_right).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_align_right).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_align_right).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setAlignRight();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_blockquote).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_blockquote).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_blockquote).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setBlockquote();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_insert_bullets).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_insert_bullets).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_insert_bullets).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setBullets();
                isChanged = !isChanged;
            }
        });

        findViewById(R.id.action_insert_numbers).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_insert_numbers).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_insert_numbers).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.setNumbers();
                isChanged = !isChanged;
            }
        });


        View latexView = findViewById(R.id.latext_editor);


        findViewById(R.id.insert_latex).setOnClickListener(view -> {
            if (latexView.getVisibility() == View.GONE) {
                latexView.setVisibility(View.VISIBLE);
                findViewById(R.id.insert_latex).setBackgroundColor(getResources().getColor(R.color.selectted));
                MathView mathView1 = findViewById(R.id.mathView);
                latexText.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                    }

                    @Override
                    public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                        mathView1.setDisplayText("\\(" + charSequence.toString() + "\\)");
                    }

                    @Override
                    public void afterTextChanged(Editable editable) {

                    }
                });
                findViewById(R.id.submit_latex).setOnClickListener(view115 -> {
                    String data1 = latexText.getText().toString();
                    data1 = data1.replace(" ", "");
                    //Toast.makeText(PostText.this, data, Toast.LENGTH_SHORT).show();
                    insertData(data1, mEditor);
                    latexText.setText("");
                    data1 = "";
                    latexView.setVisibility(View.GONE);
                });
                findViewById(R.id.action_frac).setOnClickListener(view116 -> addExtraLatex("\\frac{}{}", latexText));
                findViewById(R.id.action_power).setOnClickListener(view117 -> addExtraLatex("^", latexText));
                findViewById(R.id.action_sub).setOnClickListener(view118 -> addExtraLatex("_", latexText));
                findViewById(R.id.action_root).setOnClickListener(view119 -> addExtraLatex("\\sqrt{a}", latexText));
                findViewById(R.id.action_alpha).setOnClickListener(view114 -> addExtraLatex("\\alpha", latexText));
                findViewById(R.id.action_diff).setOnClickListener(view113 -> addExtraLatex("\\frac{d}{dx}()", latexText));
                findViewById(R.id.action_int).setOnClickListener(view112 -> addExtraLatex("\\int_{}^{}", latexText));
                findViewById(R.id.action_therefore).setOnClickListener(view111 -> addExtraLatex("\\therefore", latexText));
                findViewById(R.id.action_theta).setOnClickListener(view110 -> addExtraLatex("\\theta", latexText));
                findViewById(R.id.action_mu).setOnClickListener(view19 -> addExtraLatex("\\mu", latexText));
                findViewById(R.id.action_pi).setOnClickListener(view18 -> addExtraLatex("\\pi", latexText));
                findViewById(R.id.action_lanbda).setOnClickListener(view17 -> addExtraLatex("\\lambda", latexText));
                findViewById(R.id.action_ohm).setOnClickListener(view16 -> addExtraLatex("\\ohm", latexText));
                findViewById(R.id.action_omega).setOnClickListener(view15 -> addExtraLatex("\\omega", latexText));
                findViewById(R.id.action_hat).setOnClickListener(view13 -> addExtraLatex("\\hat{A}", latexText));
                findViewById(R.id.action_over).setOnClickListener(view14 -> addExtraLatex("\\vec{A}", latexText));
                findViewById(R.id.action_enter).setOnClickListener(view12 -> addExtraLatex("\\\\", latexText));
                findViewById(R.id.action_space).setOnClickListener(view1 -> addExtraLatex("\\;", latexText));
            } else {
                findViewById(R.id.insert_latex).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                latexView.setVisibility(View.GONE);
            }
        });

        findViewById(R.id.action_insert_checkbox).setOnClickListener(new View.OnClickListener() {
            private boolean isChanged;
            @Override
            public void onClick(View view) {
                if(!isChanged){
                    findViewById(R.id.action_insert_checkbox).setBackgroundColor(getResources().getColor(R.color.selectted));
                }else{
                    findViewById(R.id.action_insert_checkbox).setBackgroundColor(getResources().getColor(R.color.colorAccentt));
                }
                mEditor.insertTodo();
                isChanged = !isChanged;
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.menu_image_post, menu);
        return true;
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        if (item.getItemId() == R.id.action_post) {
            if (tag != null) {
                new DialogSheet(this)
                        .setRoundedCorners(true)
                        .setColoredNavigationBar(true)
                        .setPositiveButton("Yes", v -> {
                            sharedPreferences.edit().putInt("count", ++serviceCount).apply();
                            Intent intent = new Intent(PostIssue.this, UploadService.class);
                            intent.putExtra("count", serviceCount);
                            intent.putStringArrayListExtra("uploadedImagesUrl", uploadedImagesUrl);
                            intent.putParcelableArrayListExtra("imagesList", (ArrayList<? extends Parcelable>) imagesList);
                            intent.putExtra("notification_id", (int) System.currentTimeMillis());
                            intent.putExtra("current_id", mCurrentUser.getUid());
                            intent.putExtra("isAnonymous", isAnonymous);
                            intent.putExtra("address", addressView.getText().toString());
                            intent.putExtra("lat", lat);
                            intent.putExtra("lon", lon);

                            intent.putExtra("posttype", "issue");

                            try {
                                intent.putExtra("description", mRichEd.getHtml());
                            } catch (NullPointerException h) {
                                intent.putExtra("description", " ");
                            }
                            intent.putExtra("tag", tag);
                            intent.setAction(UploadService.ACTION_START_FOREGROUND_SERVICE);
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                startForegroundService(intent);
                            } else {
                                startService(intent);
                            }
                            Toasty.info(PostIssue.this, "Uploading images..", Toasty.LENGTH_SHORT, true).show();
                            finish();
                        })
                        .setNegativeButton("No", v -> {
                        })
                        .setTitle("Upload")
                        .setMessage("Are you sure is this the content you want to upload?")
                        .show();
            } else {
                Toasty.error(this, "Select a tag", Toast.LENGTH_SHORT).show();
            }
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    public void deleteItem() {

        new MaterialDialog.Builder(this)
                .title("Remove")
                .content("Are you sure do you want to remove this image?")
                .positiveText("Yes")
                .onPositive((dialog, which) -> {

                    if (imagesList.size() == 1) {
                        finish();
                        return;
                    }

                    imagesList.remove(pager.getCurrentItem());

                    adapter = new PagerPhotosAdapter(PostIssue.this, imagesList);
                    pager.setAdapter(adapter);
                    indicator.setViewPager(pager);

                    if (imagesList.size() > 1) {
                        indicator_holder.setVisibility(View.VISIBLE);
                        indicator.setViewPager(pager);
                    } else {
                        indicator_holder.setVisibility(GONE);
                    }

                })
                .negativeText("No")
                .show();
    }

    public void openCropItem() {

        selectedIndex = pager.getCurrentItem();
        UCrop.Options options = new UCrop.Options();
        options.setCompressionFormat(Bitmap.CompressFormat.PNG);
        options.setCompressionQuality(90);
        options.setShowCropGrid(true);


        UCrop.of(Uri.fromFile(new File(imagesList.get(selectedIndex).getOg_path())), Uri.fromFile(new File(getCacheDir(), imagesList.get(selectedIndex).getName() + "_" + random() + "_edit.png")))
                .withAspectRatio(1, 1)
                .withOptions(options)
                .start(this);

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == UCrop.REQUEST_CROP && resultCode == RESULT_OK) {

            long old_id = imagesList.get(selectedIndex).getId();
            String old_name = imagesList.get(selectedIndex).getName();
            String old_path = imagesList.get(selectedIndex).getOg_path();

            imagesList.remove(selectedIndex);
            imagesList.add(selectedIndex, new Images(old_name, old_path, Objects.requireNonNull(UCrop.getOutput(Objects.requireNonNull(data))).getPath(), old_id));
            adapter = new PagerPhotosAdapter(this, imagesList);
            pager.setAdapter(adapter);
            indicator.setViewPager(pager);
            adapter.notifyDataSetChanged();
            pager.setCurrentItem(selectedIndex, true);

        } else if (resultCode == UCrop.RESULT_ERROR) {
            Throwable throwable = UCrop.getError(Objects.requireNonNull(data));
            Objects.requireNonNull(throwable).printStackTrace();
            Toasty.error(this, "Error cropping : " + throwable.getMessage(), Toasty.LENGTH_SHORT, true).show();
        }


    }


    public void deleteItem(View view) {

        new MaterialDialog.Builder(this)
                .title("Remove")
                .content("Are you sure want to remove this image?")
                .positiveText("Yes")
                .onPositive((dialog, which) -> {

                    if (imagesList.size() == 1) {
                        finish();
                        return;
                    }

                    imagesList.remove(pager.getCurrentItem());

                    adapter = new PagerPhotosAdapter(PostIssue.this, imagesList);
                    pager.setAdapter(adapter);
                    indicator.setViewPager(pager);

                    if (imagesList.size() > 1) {
                        indicator_holder.setVisibility(View.VISIBLE);
                        indicator.setViewPager(pager);
                    } else {
                        indicator_holder.setVisibility(GONE);
                    }

                })
                .negativeText("No")
                .show();
    }

    public void openCropItem(View view) {

        selectedIndex = pager.getCurrentItem();
        UCrop.Options options = new UCrop.Options();
        options.setCompressionFormat(Bitmap.CompressFormat.PNG);
        options.setCompressionQuality(90);
        options.setShowCropGrid(true);

        UCrop.of(Uri.fromFile(new File(imagesList.get(selectedIndex).getOg_path())), Uri.fromFile(new File(getCacheDir(), imagesList.get(selectedIndex).getName() + "_" + random() + "_edit.png")))
                .withAspectRatio(4, 3)
                .withOptions(options)
                .start(this);
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        Toast.makeText(this, "Fetching Location...", Toast.LENGTH_SHORT).show();
        lat = location.getLatitude();
        lon = location.getLongitude();


        OpenMapsApiClient client = new OpenMapsApiClient();
        String latlng = lat  + ", " + lon; // "40.714224,-73.961452"; // Sample latitude and longitude la
        String apiKey = getString(R.string.google_api_key);

        try {
            address = client.reverseGeocode(String.valueOf(lat), String.valueOf(lon) , "663e63f38c3ea151466018jwcc4155c");
            System.out.println("Address: " + address);

            addressView.setText(address);
        } catch (IOException e) {
            addressView.setText(e.toString());
            e.printStackTrace();
        }



//        call place api to get Place
    }


    class TypeXSpinnerClass implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
            tag = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> adapterView) {

        }
    }
    private void addExtraCode(EditText codeText) {
        int start = Math.max(codeText.getSelectionStart(), 0);
        int end = Math.max(codeText.getSelectionEnd(), 0);
        codeText.getText().replace(Math.min(start, end), Math.max(start, end),
                "    ", 0, "    ".length());
    }

    private void askPermission() {



        Dexter.withActivity(this)
                .withPermissions(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.READ_EXTERNAL_STORAGE
                )
                .withListener(new MultiplePermissionsListener() {
                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        // Toasty.info(RegisterActivity.this, "You have denied some permissions permanently, if the app force close try granting permission from settings.", Toasty.LENGTH_LONG, true).show();
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                })
                .check();
    }
}