package com.quantum_guys.dncc_eco_sync.notification;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface APIService {
    @Headers(
            {
                    "Content-Type:application/json",
                    "Authorization:key=AAAAcDvvQik:APA91bEZQY_fjBThPHDPzfDcmh6opOQ6syB6hj4Gh7ZVJjW15PKkAJc48X7l5PZK55XTmX3-IOoQSBm-krGrx2ke6GkA3wQrM1zyLLvL7t6pBg6dRHDX7NR1raLRTr2ZwmmxRgfVa5w0"
            }
    )

    @POST("fcm/send")
    Call<MyResponse> sendNotifcation(@Body NotificationSender body);
}

