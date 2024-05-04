package com.quantum_guys.dncc_eco_sync.utils;import androidx.room.TypeConverter;import com.google.gson.Gson;import com.google.gson.reflect.TypeToken;import java.lang.reflect.Type;import java.util.ArrayList;import java.util.List;public class BooleanLiatConverter {    private static final Gson gson = new Gson();    @TypeConverter    public static ArrayList<Boolean> stringToList(String data) {        if (data == null) {            return null;        }        Type listType = new TypeToken<ArrayList<Boolean>>() {        }.getType();        return gson.fromJson(data, listType);    }    @TypeConverter    public static String ListToString(List<Boolean> someObjects) {        return gson.toJson(someObjects);    }}