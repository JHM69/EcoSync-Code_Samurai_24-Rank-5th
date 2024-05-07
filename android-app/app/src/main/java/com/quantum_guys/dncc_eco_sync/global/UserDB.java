package com.quantum_guys.dncc_eco_sync.global;import static android.content.Context.MODE_PRIVATE;import android.content.Context;import android.content.SharedPreferences;import android.util.Log;import com.quantum_guys.dncc_eco_sync.model.User;public class UserDB {    private static final String SHARED_PREFS = "sharedPrefs";    private static final String KEY = "roleId";    private static final String LOG_KEY = "logged";    public static int TYPE_ADMIN = 0;    public static int TYPE_DRIVER = 5;    public static int TYPE_STS_MANAGER = 1;    public static int TYPE_LANDFILL_MANAGER = 3;    public static void saveData(Context context, int TEXT) {        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);        SharedPreferences.Editor editor = sharedPreferences.edit();        editor.putInt(KEY, TEXT);        editor.apply();    }    public static int loadData(Context context) {        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);        return sharedPreferences.getInt(KEY, 0);    }    public static boolean loggedIn (Context context){        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);        return sharedPreferences.getBoolean(LOG_KEY, false);    }    public static void login(Context context, User user) {        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);        SharedPreferences.Editor editor = sharedPreferences.edit();        editor.putBoolean(LOG_KEY, true);        editor.putString("token", user.getToken());        editor.putString("image", user.getImage());        editor.putString("password", user.getPassword());        editor.putString("name", user.getName());        editor.putInt("id", user.getId());        editor.putString("email", user.getEmail());        editor.putBoolean("changedAdminPassword", user.isChangedAdminPassword());        editor.putInt("roleId", user.getRoleId());        editor.apply();    }    public static User getAuthUser(Context context) {        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);        boolean isLoggedIn = sharedPreferences.getBoolean(LOG_KEY, false);        if (isLoggedIn) {            // User is logged in, retrieve authentication details and user attributes            User user = new User();            user.setToken(sharedPreferences.getString("token", ""));            user.setImage(sharedPreferences.getString("image", ""));            user.setPassword(sharedPreferences.getString("password", ""));            user.setName(sharedPreferences.getString("name", ""));            user.setId(sharedPreferences.getInt("id", 0));            user.setEmail(sharedPreferences.getString("email", ""));            user.setChangedAdminPassword(sharedPreferences.getBoolean("changedAdminPassword", false));            user.setRoleId(sharedPreferences.getInt("roleId", 0));            return user;        } else {            Log.d("Auth", "No User Logged In");            // User is not logged in, return null or handle appropriately            return null;        }    }    public static void logout(Context context) {        SharedPreferences sharedPreferences = context.getSharedPreferences(SHARED_PREFS, MODE_PRIVATE);        SharedPreferences.Editor editor = sharedPreferences.edit();        editor.clear(); // Clear all data        editor.apply();    }}