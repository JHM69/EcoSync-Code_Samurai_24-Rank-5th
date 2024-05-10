package com.quantum_guys.dncc_eco_sync.ui.activities.post;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.util.TypedValue;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;

import com.afollestad.materialdialogs.MaterialDialog;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.firestore.FirebaseFirestore;

import org.apache.commons.lang3.StringUtils;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.utils.MathView;
import com.quantum_guys.dncc_eco_sync.utils.RichEditor;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

import es.dmoral.toasty.Toasty;

public class PostText extends AppCompatActivity {
    FirebaseFirestore mFirestore;
    FirebaseUser mCurrentUser;
    DatabaseReference databaseReference;
    EditText latexText;
    RichEditor mRichEd;
    private ConstraintLayout codeLayout;
    private ConstraintLayout videoLayout;
    EditText codeText;
    EditText videoText;
    Spinner type;
    String tag;
    boolean isHead;

    public static void startActivity(Context context) {
        Intent intent = new Intent(context, PostText.class);
        context.startActivity(intent);
    }

    public static void startActivity(Context context, String preText) {
        Intent intent = new Intent(context, PostText.class).putExtra("preText", preText);
        context.startActivity(intent);
    }

    public static String getSaltString() {
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < 14) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        return salt.toString();

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
                .title("Discard Post")
                .content("Are you sure want to go back?")
                .positiveText("Yes")
                .canceledOnTouchOutside(false)
                .cancelable(false)
                .onPositive((dialog, which) -> finish())
                .negativeText("No")
                .show();
    }

    @SuppressLint("WrongViewCast")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.AppTheme);

        setContentView(R.layout.activity_post_text);
        databaseReference = FirebaseDatabase.getInstance().getReference();
        Window window = this.getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(ContextCompat.getColor(getApplicationContext(), R.color.statusBar));

        Toolbar toolbar = findViewById(R.id.toolbar4);
        setSupportActionBar(toolbar);
        toolbar.setTitle("New Article Post");

        latexText = findViewById(R.id.latex_equation);
        type = findViewById(R.id.spinner_type);
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(getApplicationContext(), android.R.layout.simple_list_item_1, getResources().getStringArray(R.array.item_type_x));
        arrayAdapter.setDropDownViewResource(android.R.layout.simple_expandable_list_item_1);
        type.setAdapter(arrayAdapter);
        type.setOnItemSelectedListener(new TypeXSpinnerClass());

        try {
            Objects.requireNonNull(getSupportActionBar()).setTitle("New Article");
            toolbar.setTitleTextColor(Color.WHITE);
        } catch (Exception e) {
            e.printStackTrace();
        }
        Objects.requireNonNull(getSupportActionBar()).setDisplayHomeAsUpEnabled(true);


        mFirestore = FirebaseFirestore.getInstance();
        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        mCurrentUser = mAuth.getCurrentUser();
        FrameLayout mImageholder = findViewById(R.id.image_holder);
        mRichEd = findViewById(R.id.editPost);
        setUpLaTexEditor(mRichEd, null, 200);

        StringUtils.isNotEmpty(getIntent().getStringExtra("preText"));


    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater menuInflater = getMenuInflater();
        menuInflater.inflate(R.menu.menu_text_post, menu);
        return true;
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_post) {
            sendPost();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void sendPost() {
        final ProgressDialog mDialog = new ProgressDialog(this);
        mDialog.setMessage("Posting...");
        mDialog.setIndeterminate(true);
        mDialog.setCancelable(false);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.show();
        mFirestore.collection("Users").document(mCurrentUser.getUid()).get().addOnSuccessListener(documentSnapshot -> {
            if (tag != null) {
                try {
                    String postID = getSaltString();
                    Map<String, Object> postMap = new HashMap<>();
                    postMap.put("userId", documentSnapshot.getString("id"));
                    postMap.put("username", documentSnapshot.getString("username"));
                    postMap.put("name", documentSnapshot.getString("name"));
                    postMap.put("institute", documentSnapshot.getString("institute"));
                    postMap.put("dept", documentSnapshot.getString("dept"));
                    postMap.put("userimage", documentSnapshot.getString("image"));
                    postMap.put("timestamp", String.valueOf(System.currentTimeMillis()));
                    postMap.put("image_count", 0);
                    postMap.put("description", mRichEd.getHtml());
                    postMap.put("postId", postID);
                    postMap.put("tag", tag);
                    postMap.put("liked_count", 0);
                    postMap.put("comment_count", 0);
                    Map<String, Object> postMapFinal = new HashMap<>();
                    postMapFinal.put(postID, postMap);

                    mFirestore.collection("PendingPosts")
                            .document(postID)
                            .set(postMap).addOnSuccessListener(aVoid -> {
                                mDialog.dismiss();
                                Toasty.success(PostText.this, "Post is sent to admin for review", Toasty.LENGTH_SHORT, true).show();
                                finish();
                            });
                } catch (NullPointerException ignored) {
                }
            } else {
                Toasty.error(getApplicationContext(), "Select a tag", Toast.LENGTH_SHORT).show();
            }
        }).addOnFailureListener(e -> mDialog.dismiss());
    }

    public void setUpLaTexEditor(RichEditor mEditor, MathView mathView, int height) {
        mEditor.setEditorHeight(height);
        mEditor.setEditorFontSize(18);
        TypedValue typedValue = new TypedValue();
        mEditor.setPadding(10, 10, 10, 10);
        mEditor.setPlaceholder("Start Witting your post here...");
        //mEditor.setInputEnabled(false);

        codeLayout = findViewById(R.id.code_editor);
        videoLayout = findViewById(R.id.video_editor);

        mEditor.setOnTextChangeListener(text -> {
            try {
                mathView.setDisplayText(text);
            } catch (NullPointerException ignored) {

            }
        });



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
        Button tab = findViewById(R.id.tab);
        tab.setOnClickListener(view -> {

        });
        findViewById(R.id.insert_code).setOnClickListener(view -> {
            if (codeLayout.getVisibility() == View.GONE) {
                findViewById(R.id.insert_code).setBackgroundColor(getResources().getColor(R.color.selectted));
                codeLayout.setVisibility(View.VISIBLE);
                findViewById(R.id.submit_code).setOnClickListener(view115 -> {
                    String data1 = codeText.getText().toString();
                    Log.d("CODEEE", "Step 1:"+ data1);
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
        findViewById(R.id.insert_video).setOnClickListener(view -> {
            if (videoLayout.getVisibility() == View.GONE) {
                findViewById(R.id.insert_video).setBackgroundColor(getResources().getColor(R.color.selectted));
                videoLayout.setVisibility(View.VISIBLE);
                findViewById(R.id.submit_video).setOnClickListener(view115 -> {
                    String data1 = videoText.getText().toString();
                    Log.d("CODEEE", "Step 1:"+ data1);
                    mRichEd.setVideo(data1);
                    data1 = "";
                    videoText.setText("");
                    videoLayout.setVisibility(View.GONE);
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

        codeText = findViewById(R.id.code);
        videoText = findViewById(R.id.video);

        findViewById(R.id.insert_code).setOnClickListener(view -> {
            if (codeLayout.getVisibility() == View.GONE) {
                codeLayout.setVisibility(View.VISIBLE);
                findViewById(R.id.insert_code).setBackgroundColor(getResources().getColor(R.color.selectted));
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

    public static void addExtraCode(String data, EditText codText) {
        int start = Math.max(codText.getSelectionStart(), 0);
        int end = Math.max(codText.getSelectionEnd(), 0);
        codText.getText().replace(Math.min(start, end), Math.max(start, end),
                data, 0, data.length());
    }


    class TypeXSpinnerClass implements AdapterView.OnItemSelectedListener {
        public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
            tag = parent.getItemAtPosition(position).toString();
        }

        @Override
        public void onNothingSelected(AdapterView<?> adapterView) {

        }
    }
}
