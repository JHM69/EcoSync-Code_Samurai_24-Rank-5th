package com.quantum_guys.dncc_eco_sync.util.SendNotificationPack;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface APIService {
    @Headers(
            {
                    "Content-Type:application/json",
                    "Authorization:key=AAAAfmgIXk0:APA91bG00zz6fWWTIFSMhKPH6UPHiN-dumrO2XiEWno7COu2siluwlOkCqsmXP6QSP9K54eiDDbEIZ76SMDzpnBe5pboKXLmrCDcIQDwH8NHTZL0zpgS14kJ-nb6ueQE7V-5sFjT-4pYAAAAfmgIXk0:APA91bG00zz6fWWTIFSMhKPH6UPHiN-dumrO2XiEWno7COu2siluwlOkCqsmXP6QSP9K54eiDDbEIZ76SMDzpnBe5pboKXLmrCDcIQDwH8NHTZL0zpgS14kJ-nb6ueQE7V-5sFjT-4pYAAAAfmgIXk0:APA91bG00zz6fWWTIFSMhKPH6UPHiN-dumrO2XiEWno7COu2siluwlOkCqsmXP6QSP9K54eiDDbEIZ76SMDzpnBe5pboKXLmrCDcIQDwH8NHTZL0zpgS14kJ-nb6ueQE7V-5sFjT-4pYAAAAfmgIXk0:APA91bG00zz6fWWTIFSMhKPH6UPHiN-dumrO2XiEWno7COu2siluwlOkCqsmXP6QSP9K54eiDDbEIZ76SMDzpnBe5pboKXLmrCDcIQDwH8NHTZL0zpgS14kJ-nb6ueQE7V-5sFjT-4pYAAAAfmgIXk0:APA91bG00zz6fWWTIFSMhKPH6UPHiN-dumrO2XiEWno7COu2siluwlOkCqsmXP6QSP9K54eiDDbEIZ76SMDzpnBe5pboKXLmrCDcIQDwH8NHTZL0zpgS14kJ-nb6ueQE7V-5sFjT-4pYAAAAfmgIXk0:APA91bG00zz6fWWTIFSMhKPH6UPHiN-dumrO2XiEWno7COu2siluwlOkCqsmXP6QSP9K54eiDDbEIZ76SMDzpnBe5pboKXLmrCDcIQDwH8NHTZL0zpgS14kJ-nb6ueQE7V-5sFjT-4pY"
            }
    )

    @POST("fcm/send")
    Call<MyResponse> sendNotifcation(@Body NotificationSender body);
}

