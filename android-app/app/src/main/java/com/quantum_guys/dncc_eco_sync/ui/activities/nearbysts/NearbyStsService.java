package com.quantum_guys.dncc_eco_sync.ui.activities.nearbysts;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface NearbyStsService {
    @GET("nearbysts")
    Call<STSResponse> getNearbySts(
        @Query("lat") String latitude,
        @Query("lon") String longitude
    );
}
