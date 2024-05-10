package com.quantum_guys.dncc_eco_sync.retrofit;

import android.content.Context;

public class ApiUtils {
    public static final String BASE_URL = "http://10.33.27.140:5000";

    public static AuthService getAuthService(Context context) {
        return RetrofitClient.getClient(BASE_URL ).create(AuthService.class);
    }

    public static TripService getTripService(Context context) {
        return RetrofitClient.getClient(BASE_URL ).create(TripService.class);
    }

}


