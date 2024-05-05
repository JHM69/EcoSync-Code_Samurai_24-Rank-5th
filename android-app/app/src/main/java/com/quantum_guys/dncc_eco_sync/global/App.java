package com.quantum_guys.dncc_eco_sync.global;

import android.app.Application;

import java.util.Locale;

public class App extends Application {
    @Override
    public void onCreate() {
        LanguageSetting.setLanguage(this, "bn");
        String change = LanguageSetting.getLanguage(this);
        new Locale(change);
        super.onCreate();
    }
}
/*

class App : Application() {
    //English = 1
    //bangla = 2
    override fun onCreate() {
        super.onCreate()
        var change = ""
        val x = LanguageSetting.getLanguage(this)
        if(x==2){
            change="en"
        } else if (x==1){
            change = "bn"
        }else {
            change =""
        }
        MainActivity.dLocale = Locale(change) //set any locale you want here
        Diagnosis.dLocale = Locale(change)
    }
}*/
