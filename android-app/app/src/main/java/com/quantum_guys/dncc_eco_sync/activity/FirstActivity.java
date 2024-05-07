 package com.quantum_guys.dncc_eco_sync.activity;


 import static com.quantum_guys.dncc_eco_sync.global.UserDB.TYPE_ADMIN;
 import static com.quantum_guys.dncc_eco_sync.global.UserDB.TYPE_DRIVER;
 import static com.quantum_guys.dncc_eco_sync.global.UserDB.TYPE_LANDFILL_MANAGER;
 import static com.quantum_guys.dncc_eco_sync.global.UserDB.TYPE_STS_MANAGER;

 import android.content.Intent;
 import android.os.Bundle;
 import android.transition.Explode;
 import android.view.View;
 import android.view.Window;

 import androidx.appcompat.app.AppCompatActivity;
 import androidx.appcompat.widget.SwitchCompat;

 import com.quantum_guys.dncc_eco_sync.MainActivity;
 import com.quantum_guys.dncc_eco_sync.R;
 import com.quantum_guys.dncc_eco_sync.global.LanguageSetting;
 import com.quantum_guys.dncc_eco_sync.global.UserDB;


 public class FirstActivity extends AppCompatActivity {


     @Override
     protected void onCreate(Bundle savedInstanceState) {
         requestWindowFeature(Window.FEATURE_NO_TITLE);
         getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);
         getWindow().setEnterTransition(new Explode().setDuration(1000L));

         super.onCreate(savedInstanceState);
         setContentView(R.layout.activity_first);

         View sts = findViewById(R.id.sts);
         View lanfill = findViewById(R.id.landfill);
         View admin = findViewById(R.id.btUsingBal);
         SwitchCompat bangla = findViewById(R.id.bangla);
         View driver = findViewById(R.id.btPre);
         if (LanguageSetting.getLanguage(getApplicationContext()).equals("bn"))
             bangla.setChecked(true);

         bangla.setOnCheckedChangeListener((compoundButton, b) -> {
             if (b) {
                 LanguageSetting.setLanguage(getApplicationContext(), "bn");
                 recreate();
             } else {
                 LanguageSetting.setLanguage(getApplicationContext(), "en");
                 recreate();
             }
         });


         sts.setOnClickListener(v -> {
             UserDB.saveData(getApplicationContext(), TYPE_STS_MANAGER);
             startActivity(new Intent(FirstActivity.this, MainActivity.class));
             finish();
         });

         driver.setOnClickListener(v -> {
             UserDB.saveData(getApplicationContext(), TYPE_DRIVER);
             startActivity(new Intent(FirstActivity.this, MainActivity.class));
             finish();
         });

         lanfill.setOnClickListener(v -> {
             UserDB.saveData(getApplicationContext(), TYPE_LANDFILL_MANAGER);
             startActivity(new Intent(FirstActivity.this, MainActivity.class));
             finish();
         });

         admin.setOnClickListener(v -> {
             UserDB.saveData(getApplicationContext(), TYPE_ADMIN);
             startActivity(new Intent(FirstActivity.this, MainActivity.class));
             finish();
         });

    }
}