package com.quantum_guys.dncc_eco_sync.activity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;


import com.quantum_guys.dncc_eco_sync.MainActivity;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.model.User;
import com.quantum_guys.dncc_eco_sync.retrofit.ApiUtils;
import com.quantum_guys.dncc_eco_sync.retrofit.AuthService;
import com.quantum_guys.dncc_eco_sync.view.CustomProgressDialogue;

import org.jetbrains.annotations.NotNull;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import retrofit2.Call;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private CustomProgressDialogue mDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mDialog =new CustomProgressDialogue(this);
        mDialog.setCanceledOnTouchOutside(false);
        mDialog.setCancelable(false);

        Button login = findViewById(R.id.buttonLogin);
        login.setOnClickListener(v -> {
            try {
                mDialog.show();
                EditText emailEd = findViewById(R.id.editTextEmail);

                EditText passEd = findViewById(R.id.editTextPassword);


                Map<String, String> loginRequestBody = new HashMap<>();
                loginRequestBody.put("email", emailEd.getText().toString());
                loginRequestBody.put("password", passEd.getText().toString());

                AuthService authService = ApiUtils.getAuthService();
                authService.login(loginRequestBody).enqueue(new retrofit2.Callback() {
                    @Override
                    public void onResponse(@NotNull Call call, @NotNull Response response) {

                        if (response.isSuccessful()) {

                            try{
                                User user = (User) response.body();

                                SharedPreferences sharedPreferences = getSharedPreferences("my_preferences", Context.MODE_PRIVATE);
                                SharedPreferences.Editor editor = sharedPreferences.edit();
                                editor.putBoolean("logged", true);
                                editor.putString("name", Objects.requireNonNull(user).getName());
                                editor.putString("token", user.getToken());
                                editor.apply();

                                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                                startActivity(intent);
                            }catch (Exception e){
                                Log.d("SSSF", e.getMessage());
                            }

//                          jahangirhossainm69@gmail.com




                            mDialog.dismiss();
                        }else{
                            mDialog.dismiss();
                            Toast.makeText(getApplicationContext(), "Invalid Credentials", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call call, @NonNull Throwable t) {
                        mDialog.dismiss();
                        Log.d("Error::", t.getMessage());
                        Toast.makeText(getApplicationContext(), "NO Network Connection, try again later", Toast.LENGTH_SHORT).show();
                    }
                });
            } catch (NullPointerException jj) {
                Log.d("SSSF", jj.getMessage());
                finish();
                Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();
            }

        });
    }
}
