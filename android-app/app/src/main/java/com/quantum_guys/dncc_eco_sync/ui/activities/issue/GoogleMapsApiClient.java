package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class GoogleMapsApiClient {
    private static final String BASE_URL = "https://maps.googleapis.com/";
    private GoogleMapsApiService service;

    public GoogleMapsApiClient() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        service = retrofit.create(GoogleMapsApiService.class);
    }

    public String reverseGeocode(String latlng, String apiKey) throws IOException {
        Call<GeocodingResponse> call = service.reverseGeocode(latlng, apiKey);
        GeocodingResponse response = call.execute().body();

        if (response != null && response.getResults().size() > 0) {
            return response.getResults().get(0).getFormattedAddress();
        } else {
            return "No results found";
        }
    }
}
