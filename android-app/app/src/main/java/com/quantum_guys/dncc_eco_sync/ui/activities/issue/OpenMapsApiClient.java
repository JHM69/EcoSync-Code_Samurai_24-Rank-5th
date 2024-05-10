package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class OpenMapsApiClient {
    private static final String BASE_URL = "https://geocode.maps.co/";
    private OpenMapsApiService service;

    public OpenMapsApiClient() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        service = retrofit.create(OpenMapsApiService.class);
    }

    public String reverseGeocode(String lat, String lon, String apiKey) throws IOException {
        Call<Address> call = service.reverseGeocode(lat, lon, apiKey);
        Address response = call.execute().body();

        if (response != null) {
            return response.getAdditionalProperties().get("display_name").toString();
        } else {
            return "No results found";
        }
    }
}
