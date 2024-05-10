package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class GeocodingResponse {
    @SerializedName("results")
    private List<Result> results;

    public List<Result> getResults() {
        return results;
    }

    public static class Result {
        @SerializedName("formatted_address")
        private String formattedAddress;

        public String getFormattedAddress() {
            return formattedAddress;
        }
    }
}
