package com.quantum_guys.dncc_eco_sync.retrofit;import com.quantum_guys.dncc_eco_sync.model.Question;import java.util.List;import retrofit2.Call;import retrofit2.http.GET;import retrofit2.http.Query;public interface QuestionService {    @GET("questions/")    Call<List<Question>> getQuestions(@Query("categories") String categories, @Query("difficulty") String difficulty, @Query("limit") String limit);}