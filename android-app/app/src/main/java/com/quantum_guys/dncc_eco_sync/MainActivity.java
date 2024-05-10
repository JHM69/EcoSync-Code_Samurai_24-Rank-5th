package com.quantum_guys.dncc_eco_sync;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.tabs.TabLayout;
import com.quantum_guys.dncc_eco_sync.adapter.TabAdapter;
import com.quantum_guys.dncc_eco_sync.face.AddFace;
import com.quantum_guys.dncc_eco_sync.fragment.MainFragment;
import com.quantum_guys.dncc_eco_sync.fragment.NotificationFragment;
import com.quantum_guys.dncc_eco_sync.fragment.TripFragment;
import com.quantum_guys.dncc_eco_sync.global.UserDB;
import com.quantum_guys.dncc_eco_sync.model.User;

import java.util.Objects;

import es.dmoral.toasty.Toasty;

public class MainActivity extends AppCompatActivity {


    private TabAdapter adapter;
    private TabLayout tabLayout;


    boolean back = true;
    
    User user = new User();


    TextView authName;
 
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        user = UserDB.getAuthUser(getApplicationContext());

        if(user == null) {
            Toasty.error(getApplicationContext(), "User not found", Toasty.LENGTH_SHORT).show();
            finish();
        }
        if(user.getRoleId() == 5 && !user.isFaceVerificationAdded()) {
            //Show a uncancelable AlertDialog with a message "You need to add your face verification to access this page" and a button "Add Face Verification"
            AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            builder.setMessage("You need to add your face verification to access this page");
            builder.setCancelable(false);
            builder.setPositiveButton("Add Face Verification", (dialog, which) -> {
                //Start the activity FaceVerificationActivity
                Intent intent = new Intent(MainActivity.this, AddFace.class);
                startActivity(intent);
            });
            builder.show();

        }


        authName = findViewById(R.id.userName2);

        CardView cardViewVerify = findViewById(R.id.cardViewVerify);

        Button verifyEmail = findViewById(R.id.sentEmailBt);


        tabLayout = findViewById(R.id.tabLayout);
        ViewPager viewPager = findViewById(R.id.view_pager);
        adapter = new TabAdapter(getSupportFragmentManager(), getApplicationContext());

        adapter.addFragment(new MainFragment(user), "Home", R.drawable.ic_home_white_24dp);
        adapter.addFragment(new TripFragment(user), "Trips", R.drawable.outline_cable_24);
        adapter.addFragment(new NotificationFragment(user), "Notification", R.drawable.ic_notifications_none_black_24dp);

        viewPager.setAdapter(adapter);
        for (int i = 0; i < tabLayout.getTabCount(); i++) {
            TabLayout.Tab tab = tabLayout.getTabAt(i);
            Objects.requireNonNull(tab).setCustomView(null);
            tab.setCustomView(adapter.getTabView(i));
        }
        tabLayout.setupWithViewPager(viewPager);

        setTabWidth(3);


        highLightCurrentTab(0);
        try {
            viewPager.setOffscreenPageLimit(adapter.getCount());


            if(user != null)  {

                authName.setText(user.getName());
                new UpdateInfoAsyncTask(user.getId()).execute();
            }

            assert user != null;
            if (user.getRoleId()!=5) {
                 Toasty.error(getApplicationContext(), "You are not authorized to access this page", Toasty.LENGTH_SHORT).show();
            } else {

            }


        } catch (Exception ignored) {

        }


        viewPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
                highLightCurrentTab(position);
            }

            @Override
            public void onPageScrollStateChanged(int state) {
            }
        });
    }


    private void highLightCurrentTab(int position) {
        for (int i = 0; i < tabLayout.getTabCount(); i++) {
            TabLayout.Tab tab = tabLayout.getTabAt(i);
            assert tab != null;
            tab.setCustomView(null);
            tab.setCustomView(adapter.getTabView(i));
        }
        TabLayout.Tab tab = tabLayout.getTabAt(position);
        assert tab != null;
        tab.setCustomView(null);
        tab.setCustomView(adapter.getSelectedTabView(position, false));

        back = position == 0;
    }


    private static class UpdateInfoAsyncTask extends AsyncTask<Void, Void, Void> {

        Integer uid;

        private UpdateInfoAsyncTask(Integer uid) {
            this.uid = uid;
        }

        @Override
        protected Void doInBackground(Void... jk) {
            try {
//                String refreshToken = FirebaseInstanceId.getInstance().getToken();
//                Token token = new Token(refreshToken);
                //Update the Notification Token
                

            } catch (NullPointerException ignored) {

            }
            return null;
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        //Fetch the user data from the database
        
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if (back) {
            finish();
        } else {
            tabLayout.getTabAt(0).select();
            back = true;
        }
    }

    private void setTabWidth(int position) {
        try{
            for (int i = 0; i < tabLayout.getTabCount(); i++) {
                LinearLayout layout = ((LinearLayout) ((LinearLayout) tabLayout.getChildAt(0)).getChildAt(i));
                LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) layout.getLayoutParams();
                layoutParams.weight = 1;
                layout.setLayoutParams(layoutParams);
            }
        } catch (Exception ignored) {
            Toasty.error(getApplicationContext(), "Error", Toasty.LENGTH_SHORT).show();
        }
    }
}