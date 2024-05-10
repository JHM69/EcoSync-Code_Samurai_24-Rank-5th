package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface OpenMapsApiService {
    @GET("reverse")
    Call<Address> reverseGeocode(
            @Query("lat") String lat,
            @Query("lon") String lon,
            @Query("api_key") String apiKey
    );
}
