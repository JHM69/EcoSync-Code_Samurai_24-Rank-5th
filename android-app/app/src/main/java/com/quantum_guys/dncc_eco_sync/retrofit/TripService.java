package com.quantum_guys.dncc_eco_sync.retrofit;import okhttp3.ResponseBody;import retrofit2.Call;import retrofit2.http.GET;import retrofit2.http.Header;public interface TripService {        @GET("mytripplans")        default Call<ResponseBody> getTripPlan(@Header("") String token){            throw new UnsupportedOperationException("Method not implemented");        }}