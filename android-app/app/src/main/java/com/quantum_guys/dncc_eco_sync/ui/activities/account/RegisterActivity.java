package com.quantum_guys.dncc_eco_sync.ui.activities.account;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.transition.Fade;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import com.google.android.material.textfield.TextInputLayout;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.utils.AnimationUtil;
import com.yalantis.ucrop.UCrop;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import de.hdodenhof.circleimageview.CircleImageView;
import es.dmoral.toasty.Toasty;


public class RegisterActivity extends AppCompatActivity {

    private static final int PICK_IMAGE = 100;
    public int type = -1;
    public Uri imageUri = Uri.parse("android.resource://com.quantum_guys.dncc_eco_sync/" + R.drawable.logo);
    public StorageReference storageReference;
    public ProgressDialog mDialog;
    public String name_, pass_, mobile_, email_, address_, ward_, gender_;
    
    TextInputLayout deptT;
    private EditText name, email, institute, password, number, address;
    private CircleImageView profile_image;
    private FirebaseAuth mAuth;
    private FirebaseFirestore firebaseFirestore;

    public static void startActivity(Context context) {
        context.startActivity(new Intent(context, RegisterActivity.class));
    }


    private void askPermission() {
        Dexter.withActivity(this)
                .withPermissions(
                        Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.READ_EXTERNAL_STORAGE
                )
                .withListener(new MultiplePermissionsListener() {

                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        if (report.isAnyPermissionPermanentlyDenied()) {
                             Toasty.info(RegisterActivity.this, "You have denied some permissions permanently, if the app force close try granting permission from settings.", Toasty.LENGTH_LONG, true).show();
                        }
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                })
                .check();

    }

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


        setContentView(R.layout.activity_register);

        askPermission();
        mAuth = FirebaseAuth.getInstance();
        storageReference = FirebaseStorage.getInstance().getReference().child("images");
        firebaseFirestore = FirebaseFirestore.getInstance();
        name = findViewById(R.id.name);
        email = findViewById(R.id.email);
        number = findViewById(R.id.number);
        address = findViewById(R.id.address); 
        password = findViewById(R.id.password);
         
        List<String> wards = Arrays.asList(getResources().getStringArray(R.array.wards));
        List<String> genders = Arrays.asList(getResources().getStringArray(R.array.genders));


        Spinner spinner_class = findViewById(R.id.spinner_class_level);
        Spinner spinner_groups = findViewById(R.id.spinner_group); 
        
        ArrayAdapter<String> spinnerArrayAdapter_type = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_dropdown_item, wards);
        spinner_class.setAdapter(spinnerArrayAdapter_type);


        ArrayAdapter<String> spinnerArrayAdapter_groups = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_dropdown_item, genders);
        spinner_groups.setAdapter(spinnerArrayAdapter_groups);

       
  

      

        spinner_groups.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                gender_ = genders.get(position);
            }

            public void onNothingSelected(AdapterView<?> parent) {
                gender_ = "";
            }
        });

        spinner_class.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                ward_ = wards.get(position);
            }

            public void onNothingSelected(AdapterView<?> parent) {
                ward_ = "";
            }
        });


        mDialog = new ProgressDialog(this);
        mDialog.setMessage("Please wait..");
        mDialog.setIndeterminate(true);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.setCancelable(false);

        Button register = findViewById(R.id.button);

        profile_image = findViewById(R.id.profile_image);

        Fade fade = new Fade();
        fade.excludeTarget(findViewById(R.id.layout), true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            fade.excludeTarget(android.R.id.statusBarBackground, true);
            fade.excludeTarget(android.R.id.navigationBarBackground, true);
            getWindow().setEnterTransition(fade);
            getWindow().setExitTransition(fade);
        }

        register.setOnClickListener(view -> {
            name_ = name.getText().toString();
            address_ = institute.getText().toString(); 
            email_ = email.getText().toString();
            pass_ = password.getText().toString();
            mDialog.show();

            if (TextUtils.isEmpty(name_) && !name_.matches("[a-zA-Z ]*")) {
                Toasty.error(getApplicationContext(), "Invalid name", Toasty.LENGTH_SHORT, true).show();
                AnimationUtil.shakeView(name, RegisterActivity.this);
                mDialog.dismiss();

            }
            if (TextUtils.isEmpty(email_)) {

                AnimationUtil.shakeView(email, RegisterActivity.this);
                mDialog.dismiss();

            }
            if (TextUtils.isEmpty(pass_)) {

                AnimationUtil.shakeView(password, RegisterActivity.this);
                mDialog.dismiss();

            }
            if (type < 0) {
                AnimationUtil.shakeView(spinner_groups, RegisterActivity.this);
                mDialog.dismiss();
            }

            if (!TextUtils.isEmpty(name_) && !TextUtils.isEmpty(email_) && !TextUtils.isEmpty(pass_) && type > 0) {
                registerUser();
            } else {
                AnimationUtil.shakeView(spinner_groups, RegisterActivity.this);
                AnimationUtil.shakeView(email, RegisterActivity.this);
                AnimationUtil.shakeView(name, RegisterActivity.this);
                AnimationUtil.shakeView(email, RegisterActivity.this);
                AnimationUtil.shakeView(password, RegisterActivity.this);
              /*    AnimationUtil.shakeView(institute, RegisterActivity.this);
                    AnimationUtil.shakeView(dept, RegisterActivity.this);
                    AnimationUtil.shakeView(spinner_zila, RegisterActivity.this);*/
                mDialog.dismiss();
            }

        });


    }

    @SuppressLint("CheckResult")
    private void registerUser() {
        mAuth.createUserWithEmailAndPassword(email_, pass_).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                Objects.requireNonNull(task.getResult()
                        .getUser())
                        .sendEmailVerification()
                        .addOnSuccessListener(aVoid -> {
                            final String userUid = task.getResult().getUser().getUid();
                            final StorageReference user_profile = storageReference.child(userUid + ".png");
                            user_profile.putFile(imageUri).addOnCompleteListener(task1 -> {
                                if (task1.isSuccessful()) {
                                    user_profile.getDownloadUrl().addOnSuccessListener(uri -> {
                                        Map<String, Object> userMap = new HashMap<>();
                                        userMap.put("id", userUid);
                                        userMap.put("name", name_);
                                        userMap.put("address", address_); 
                                        userMap.put("image", uri.toString());
                                        userMap.put("email", email_);
                                        userMap.put("gender", gender_);
                                        userMap.put("ward", ward_);
                                        userMap.put("bio", getString(R.string.default_bio));
                                        userMap.put("username", getNickName(name_));
                                        userMap.put("score", 100);
                                        userMap.put("win", 0);
                                        userMap.put("lose", 0);
                                        userMap.put("draw", 0);
                                        userMap.put("type", type);
                                        userMap.put("reward", 100);
                                        userMap.put("solved", 0);
                                        userMap.put("answers", 0);
                                        userMap.put("vote", 0);
                                        userMap.put("lastTimestamp", System.currentTimeMillis());
                                        firebaseFirestore.collection("Users").document(userUid).set(userMap).addOnCompleteListener(task11 -> {
                                            mDialog.dismiss();
                                            Toasty.success(getApplicationContext(), "Signing up success!, Check your email to verify.", Toasty.LENGTH_SHORT, true);
                                            finish();
                                        });
                                    }).addOnFailureListener(e -> mDialog.dismiss());


                                } else {
                                    mDialog.dismiss();
                                }
                            });

                        })
                        .addOnFailureListener(e -> task.getResult().getUser().delete());

            } else {
                mDialog.dismiss();
                Toasty.error(RegisterActivity.this, String.format("Error: %s", Objects.requireNonNull(task.getException()).getMessage()), Toasty.LENGTH_SHORT, true).show();
            }
        });

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE) {
            if (resultCode == RESULT_OK) {
                imageUri = data.getData();
                // start crop activity
                UCrop.Options options = new UCrop.Options();
                options.setCompressionFormat(Bitmap.CompressFormat.PNG);
                options.setCompressionQuality(70);
                options.setShowCropGrid(true);

                UCrop.of(imageUri, Uri.fromFile(new File(getCacheDir(), "dncc_user_profile_picture.png")))
                        .withAspectRatio(1, 1)
                        .withOptions(options)
                        .start(this);

            }
        }
        if (requestCode == UCrop.REQUEST_CROP) {
            if (resultCode == RESULT_OK) {
                imageUri = UCrop.getOutput(data);
                profile_image.setImageURI(imageUri);

            } else if (resultCode == UCrop.RESULT_ERROR) {
                Log.e("Error", "Crop error:" + Objects.requireNonNull(UCrop.getError(data)).getMessage());
            }
        }


    }

    public void setProfilepic() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Profile Picture"), PICK_IMAGE);
    }

    public void onLogin() {
        onBackPressed();
    }

    public String getNickName(String fullname_) {
        String[] arr = fullname_.split(" ", 2);
        return arr[0];
    }

    public void setProfilepic(View view) {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(Intent.createChooser(intent, "Select Profile Picture"), PICK_IMAGE);
    }

    public void onLogin(View view) {
        onBackPressed();
    }
}