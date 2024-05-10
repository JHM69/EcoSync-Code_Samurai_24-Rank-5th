package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface GoogleMapsApiService {
    @GET("maps/api/geocode/json")
    Call<GeocodingResponse> reverseGeocode(
            @Query("latlng") String latlng,
            @Query("key") String apiKey
    );
}
