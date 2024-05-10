package com.quantum_guys.dncc_eco_sync.ui.activities.account;

import static es.dmoral.toasty.Toasty.LENGTH_SHORT;
import static es.dmoral.toasty.Toasty.error;
import static es.dmoral.toasty.Toasty.info;
import static es.dmoral.toasty.Toasty.success;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.transition.Fade;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.lifecycle.ViewModelProviders;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FieldValue;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.iid.FirebaseInstanceId;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.marcoscg.dialogsheet.DialogSheet;
import com.shobhitpuri.custombuttons.GoogleSignInButton;

import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.Users;
import com.quantum_guys.dncc_eco_sync.notification.Token;
import com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity;
import com.quantum_guys.dncc_eco_sync.utils.AnimationUtil;
import com.quantum_guys.dncc_eco_sync.viewmodel.UserViewModel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import es.dmoral.toasty.Toasty;

public class LoginActivity extends AppCompatActivity implements GoogleApiClient.OnConnectionFailedListener {

    private static final String TAG = LoginActivity.class.getSimpleName();
    private static final int RC_SIGN_IN = 1;
    @SuppressLint("StaticFieldLeak")
    public static Activity activity;
    UserViewModel userViewModel;
    String image;
    String idToken;
    private EditText email, password;
    private FirebaseAuth mAuth;
    private FirebaseFirestore mFirestore;
    private ProgressDialog mDialog;
    private FirebaseAuth.AuthStateListener firebaseAuthListener;
    private GoogleApiClient googleApiClient;
    ProgressBar progressBar;

    public static void startActivityy(Context context) {
        Intent intent = new Intent(context, LoginActivity.class);
        context.startActivity(intent);
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
                            Toasty.info(LoginActivity.this, "You have denied some permissions permanently, if the app force close try granting permission from settings.", Toasty.LENGTH_LONG, true).show();
                        }
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                })
                .check();

    }

    @SuppressLint("ObsoleteSdkInt")
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

        setContentView(R.layout.activity_login);

        activity = this;
        mAuth = FirebaseAuth.getInstance();
        mFirestore = FirebaseFirestore.getInstance();
        askPermission();
        mDialog = new ProgressDialog(this);
        mDialog.setMessage("Please wait..");
        mDialog.setIndeterminate(true);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.setCancelable(false);
        email = findViewById(R.id.email);
        password = findViewById(R.id.password);
        userViewModel = ViewModelProviders.of(this).get(UserViewModel.class);
        progressBar = findViewById(R.id.dfef);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            Fade fade = new Fade();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                fade.excludeTarget(findViewById(R.id.layout), true);
                fade.excludeTarget(android.R.id.statusBarBackground, true);
                fade.excludeTarget(android.R.id.navigationBarBackground, true);
                getWindow().setEnterTransition(fade);
                getWindow().setExitTransition(fade);
            }
        }

        firebaseAuthListener = firebaseAuth -> {
            FirebaseUser user = firebaseAuth.getCurrentUser();
            if (user != null) {
                Log.d(TAG, "onAuthStateChanged:signed_in:" + user.getUid());
            } else {
                Log.d(TAG, "onAuthStateChanged:signed_out");
            }
            //updateUI(user);
        };
        // callbackManager = CallbackManager.Factory.create();

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.web_client_id))//you can also use
                .requestEmail()
                .build();
        googleApiClient = new GoogleApiClient.Builder(getApplicationContext())
                .enableAutoManage(this, this)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .build();

        GoogleSignInButton signInButton = findViewById(R.id.sign_in_button);
        signInButton.setOnClickListener(view -> {
            Intent intent = Auth.GoogleSignInApi.getSignInIntent(googleApiClient);
            startActivityForResult(intent, RC_SIGN_IN);
        });


        mAuth = FirebaseAuth.getInstance();
        firebaseAuthListener = firebaseAuth -> {
            FirebaseUser user = firebaseAuth.getCurrentUser();
            if (user != null) {
                goMainScreen(user);
            }
        };
    }


    private void goMainScreen(FirebaseUser user) {
        try {
            FirebaseFirestore.getInstance().collection("Users").document(user.getUid()).get().addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    Users users = document.toObject(Users.class);
                    if (users == null) {
                        createNew(user);
                    } else {
                        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                        setUpMessaging(users, intent);
                    }
                }
            });
        } catch (Exception j) {
            mDialog.dismiss();
            progressBar.setVisibility(View.GONE);
            Toast.makeText(activity, "Error Occurred", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_SIGN_IN) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            assert result != null;
            handleSignInResultGoogle(result);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(firebaseAuthListener);
    }

    @Override
    protected void onStop() {
        super.onStop();
        mAuth.removeAuthStateListener(firebaseAuthListener);
    }

    public void performLogin() {
        final String email_, pass_;
        email_ = email.getText().toString();
        pass_ = password.getText().toString();

        if (!TextUtils.isEmpty(email_) && !TextUtils.isEmpty(pass_)) {
            mDialog.show();
            progressBar.setVisibility(View.VISIBLE);
            mAuth.signInWithEmailAndPassword(email_, pass_).addOnCompleteListener(task -> {
                if (task.isSuccessful()) {

                    Log.i(TAG, "Login Successful, continue to email verified");

                    if (Objects.requireNonNull(task.getResult().getUser()).isEmailVerified()) {

                        Log.i(TAG, "Email is verified Successful, continue to get token");
                        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(taskInstanceToken -> {
                            if (!taskInstanceToken.isSuccessful()) {
                                Log.w(TAG, "getInstanceId failed", taskInstanceToken.getException());
                                return;
                            }
                            final String token_id = taskInstanceToken.getResult().getToken();
                            Log.i(TAG, "Get Token Listener, Token ID (token_id): " + token_id);
                            final String current_id = task.getResult().getUser().getUid();
                            mFirestore.collection("Users").document(current_id).get().addOnSuccessListener(documentSnapshot -> {
                                final Map<String, Object> tokenMap = new HashMap<>();
                                tokenMap.put("token_ids", FieldValue.arrayUnion(token_id));
                                mFirestore.collection("Users")
                                        .document(current_id)
                                        .update(tokenMap)
                                        .addOnSuccessListener(aVoid -> FirebaseFirestore.getInstance().collection("Users").document(current_id).get().addOnCompleteListener(task1 -> {
                                            if (task1.isSuccessful()) {
                                                DocumentSnapshot document = task1.getResult();
                                                if (document.exists()) {
                                                    Users usersa = document.toObject(Users.class);
                                                    Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                                                    setUpMessaging(usersa, intent);
                                                }
                                            }
                                        }).addOnFailureListener(e -> {
                                            Log.e("Error", ".." + e.getMessage());
                                            mDialog.dismiss();
                                            progressBar.setVisibility(View.GONE);
                                        })).addOnFailureListener(e -> {
                                            mDialog.dismiss();
                                            progressBar.setVisibility(View.GONE);
                                            error(LoginActivity.this, "Error: " + e.getMessage(), LENGTH_SHORT, true).show();
                                        });

                            });

                        });

                    } else {
                        mDialog.dismiss();
                        new DialogSheet(LoginActivity.this)
                                .setTitle("Information")
                                .setCancelable(true)
                                .setRoundedCorners(true)
                                .setColoredNavigationBar(true)
                                .setMessage("Email has not been verified, please verify and continue.")
                                .setPositiveButton("Send again", v -> task.getResult()
                                        .getUser()
                                        .sendEmailVerification()
                                        .addOnSuccessListener(aVoid -> success(LoginActivity.this, "Verification email sent", LENGTH_SHORT, true).show())
                                        .addOnFailureListener(e -> Log.e("Error", Objects.requireNonNull(e.getMessage()))))
                                .setNegativeButton("Ok", v -> {

                                })
                                .show();

                        if (mAuth.getCurrentUser() != null) {
                            mAuth.signOut();
                        }

                    }

                } else {
                    if (Objects.requireNonNull(Objects.requireNonNull(task.getException()).getMessage()).contains("The password is invalid")) {
                        error(LoginActivity.this, "Error: The password you have entered is invalid.", LENGTH_SHORT, true).show();
                        mDialog.dismiss();
                    } else if (Objects.requireNonNull(task.getException().getMessage()).contains("There is no user record")) {
                        error(LoginActivity.this, "Error: Invalid user, Please register using the button below.", LENGTH_SHORT, true).show();
                        mDialog.dismiss();
                    } else {
                        error(LoginActivity.this, "Error: " + task.getException().getMessage(), LENGTH_SHORT, true).show();
                        mDialog.dismiss();
                    }

                }
            });

        } else if (TextUtils.isEmpty(email_)) {

            AnimationUtil.shakeView(email, this);

        } else if (TextUtils.isEmpty(pass_)) {

            AnimationUtil.shakeView(password, this);

        } else {

            AnimationUtil.shakeView(email, this);
            AnimationUtil.shakeView(password, this);

        }

    }


    public void onLogin() {
        performLogin();
    }

    public void onRegister() {
        RegisterActivity.startActivity(this);
    }

    public void onForgotPassword() {

        if (TextUtils.isEmpty(email.getText().toString())) {
            info(activity, "Enter your email to send reset password mail.", LENGTH_SHORT, true).show();
            AnimationUtil.shakeView(email, this);
        } else {

            mDialog.show();
            FirebaseAuth.getInstance().sendPasswordResetEmail(email.getText().toString())
                    .addOnSuccessListener(aVoid -> {
                        mDialog.dismiss();
                        success(LoginActivity.this, "Reset password mail sent", LENGTH_SHORT, true).show();
                    })
                    .addOnFailureListener(e -> {
                        mDialog.dismiss();
                        error(LoginActivity.this, "Error sending mail : " + e.getLocalizedMessage(), LENGTH_SHORT, true).show();
                    });
        }

    }


    private void handleSignInResultGoogle(GoogleSignInResult result) {
        if (result.isSuccess()) {
            GoogleSignInAccount account = result.getSignInAccount();
            assert account != null;
            idToken = account.getIdToken();
            // you can store user data to SharedPreference
            AuthCredential credential = GoogleAuthProvider.getCredential(idToken, null);
            firebaseAuthWithGoogle(credential);
        } else {
            // Google Sign In failed, update UI appropriately
            Log.e(TAG, "Login Unsuccessful. " + result);
            Toasty.error(this, "Login Unsuccessful", Toast.LENGTH_SHORT).show();
        }
    }

    private void firebaseAuthWithGoogle(AuthCredential credential) {
        progressBar.setVisibility(View.VISIBLE);

        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, task -> {
                    Log.d(TAG, "signInWithCredential:onComplete:" + task.isSuccessful());
                    if (task.isSuccessful()) {
                        Toasty.success(getApplicationContext(), "Login successful, Please wait some time.", Toast.LENGTH_SHORT).show();
                        goMainScreen(task.getResult().getUser());
                    } else {
                        Log.w(TAG, "signInWithCredential" + Objects.requireNonNull(task.getException()).getMessage());
                        task.getException().printStackTrace();
                        Toasty.error(getApplicationContext(), "Authentication failed.",
                                Toast.LENGTH_SHORT).show();
                        progressBar.setVisibility(View.GONE);
                    }

                });
    }


    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    public String getNickName(String fullname_) {
        String userName;
        try {
            String[] arr = fullname_.split(" ", 2);
            userName = arr[0];
        } catch (NullPointerException j) {
            userName = fullname_;
        }
        return userName;
    }

    void createNew(FirebaseUser user) {
        progressBar.setVisibility(View.VISIBLE);
        String name = user.getDisplayName();
        String email = user.getEmail();
        String institute = "";
        try {
            image = Objects.requireNonNull(user.getPhotoUrl()).toString();
        } catch (NullPointerException k) {
            image = "https://firebasestorage.googleapis.com/v0/b/porua-ea34a.appspot.com/o/ic_launcher.png?alt=media&token=551cbc5f-f2ba-4ea3-bbb5-bbb5ea23046e";
        }
        String dept = "";
        String location = "";
        String bio = "Hi, I am a ত্বারক user";
        Users user1 = new Users(user.getUid(), 500, System.currentTimeMillis(),
                0, 0, 0, 100, 3,
                name, Objects.requireNonNull(image),
                institute, dept, email, bio, getNickName(name), location);

        FirebaseFirestore.getInstance().collection("Users").document(user.getUid()).set(user1).addOnCompleteListener(task -> {
            Intent intent = new Intent(getApplicationContext(), MainActivity.class).putExtra("sss", "sss");
            setUpMessaging(user1, intent);
        });
    }

    void setUpMessaging(Users users, Intent intent) {
        String refreshToken = FirebaseInstanceId.getInstance().getToken();
        Token token = new Token(refreshToken);
        FirebaseDatabase.getInstance().getReference("Tokens").child(Objects.requireNonNull(FirebaseAuth.getInstance().getCurrentUser()).getUid()).setValue(token);
        userViewModel.insert(users);
        mDialog.dismiss();
        startActivity(intent);
        finish();
    }



    public void onLogin(View view) {
        performLogin();
    }

    public void onRegister(View view) {
        RegisterActivity.startActivity(this);
    }

    public void onForgotPassword(View view) {

        if (TextUtils.isEmpty(email.getText().toString())) {
            info(activity, "Enter your email to send reset password mail.", LENGTH_SHORT, true).show();
            AnimationUtil.shakeView(email, this);
        } else {

            mDialog.show();
            FirebaseAuth.getInstance().sendPasswordResetEmail(email.getText().toString())
                    .addOnSuccessListener(aVoid -> {
                        mDialog.dismiss();
                        success(LoginActivity.this, "Reset password mail sent", LENGTH_SHORT, true).show();
                    })
                    .addOnFailureListener(e -> {
                        mDialog.dismiss();
                        error(LoginActivity.this, "Error sending mail : " + e.getLocalizedMessage(), LENGTH_SHORT, true).show();
                    });
        }

    }
}
