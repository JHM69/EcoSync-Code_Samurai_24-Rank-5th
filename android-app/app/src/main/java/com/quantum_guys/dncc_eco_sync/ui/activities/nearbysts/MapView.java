package com.quantum_guys.dncc_eco_sync.ui.activities.nearbysts;


import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.location.Location;
import android.os.Bundle;
import android.provider.Settings;
import android.transition.Explode;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.directions.route.RouteException;
import com.directions.route.Routing;
import com.directions.route.RoutingListener;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.api.internal.ConnectionCallbacks;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.models.Trip;
import com.quantum_guys.dncc_eco_sync.models.VehicleEntry;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

import es.dmoral.toasty.Toasty;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;


public class MapView extends AppCompatActivity implements ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener,
        LocationListener, GoogleApiClient.ConnectionCallbacks, OnMapReadyCallback, RoutingListener {
    GoogleMap map;
    Marker busLocation;
    private List<Polyline> polyLines = new ArrayList<>();


    private static final String BASE_URL = "http://3.12.32.123:5000/";
    private NearbyStsService nearbyStsService;


    Trip trip = new Trip();

    // Populate the trip object

    List<LatLng> stsList = new ArrayList<>();
    PendingResult<LocationSettingsResult> result;
    final static int REQUEST_LOCATION = 199;
    int gap = 10;
    LocationRequest mLocationRequest;
    private final static int CONNECTION_FAILURE_RESOLUTION_REQUEST = 9000;
    private GoogleApiClient mGoogleApiClient;

    private static final int REQUEST_CODE_PERMISSION = 2;
    String mPermission = Manifest.permission.ACCESS_FINE_LOCATION;


    TextView speed, stationCurrent;
    private TextView totalAmount;
    private TextView cashAmount;
    private TextView emptySeat;
    private ImageView stop;

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().requestFeature(Window.FEATURE_ACTIVITY_TRANSITIONS);
        getWindow().setEnterTransition(new Explode());
        getWindow().setExitTransition(new Explode());
        super.onCreate(savedInstanceState);
        askPermission();
        setContentView(R.layout.activity_map);


        buildGoogleApiClient();


//        for (STS sts : trip.getVisitedSTSs()) {
//            stsList.add(new LatLng(
//                    sts.getLat(),
//                    sts.getLon()
//            ));
//        }

        stsList.add(
                new LatLng(23.7085685, 90.4086507) // CSE JnU
        );
        stsList.add(
                new LatLng( 23.72866, 90.396453) // CSE DU
        );







        cashAmount = findViewById(R.id.textView27);
        emptySeat = findViewById(R.id.textView28);
        stop = findViewById(R.id.imageView2);
        stop.setVisibility(View.VISIBLE);
        speed = findViewById(R.id.textView35);
        stationCurrent = findViewById(R.id.textView34);


        SupportMapFragment mapFragment =
                (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);

        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        } else {
            Toast.makeText(
                    this,
                    "Map Fragment is null",
                    Toast.LENGTH_SHORT
            ).show();
        }

        try {
            Routing routing = new Routing.Builder()
                    .travelMode(Routing.TravelMode.DRIVING)
                    .withListener(this)
                    .waypoints(stsList)
                    .key(getString(R.string.google_maps_key))
                    .build();

            routing.execute();
        } catch (Exception d) {
            Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();

            Toast.makeText(this, d.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
        }
    }


    @Override
    public void onBackPressed() {
        super.onBackPressed();
        new AlertDialog.Builder(this)
                .setTitle("Quite?")
                .setMessage("Are you sure want to quite and go back?")
                .setPositiveButton("Yes", (dialog, which) -> {

                    finish();
                })
                .setCancelable(false)
                .setNegativeButton("No", null)
                .show();
    }


    @Override
    public void onRoutingFailure(RouteException e) {
        Log.d("onRoutingFailure", "onRoutingFailure: " + e.getMessage());
    }

    @Override
    public void onRoutingStart() {

    }

    @Override
    public void onRoutingSuccess(ArrayList<com.directions.route.Route> route, int shortestRouteIndex) {
        // CameraUpdate center = CameraUpdateFactory.newLatLng(allStations.get(0));
        // CameraUpdate zoom = CameraUpdateFactory.zoomTo(12);

        //   map.moveCamera(center);
        //   map.moveCamera(zoom);

//        Toast.makeText(this, "Route Success", Toast.LENGTH_SHORT).show();
//        if (polyLines.size() > 0) {
//            for (Polyline poly : polyLines) {
//                poly.remove();
//            }
//        }
//        polyLines = new ArrayList<>();
        //add route(s) to the map.


        // Drawing for Testing

        for (LatLng lt : stsList) {
            MarkerOptions options = new MarkerOptions();
            options.position(lt);
            options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED));
            map.addMarker(options);
        }

//        try {
//            for (int i = 0; i < route.size(); i++) {
//                //In case of more than 5 alternative routes
//                PolylineOptions polyOptions = new PolylineOptions();
//                //polyOptions.color(getResources().getColor(R.color.addColor));
//                polyOptions.width(15 + i * 3);
//                polyOptions.addAll(route.get(i).getPoints());
//                Polyline polyline = map.addPolyline(polyOptions);
//                polyLines.add(polyline);
//            }
//        } catch (Exception f) {
//            Toast.makeText(
//                    this,
//                    f.getLocalizedMessage(),
//                    Toast.LENGTH_SHORT
//            ).show();
//        }

        for (int i = 0; i < trip.getVehicleEntries().size(); i++) {
            VehicleEntry vehicleEntry = trip.getVehicleEntries().get(i);
            MarkerOptions options = new MarkerOptions();
            options.position(new LatLng(vehicleEntry.getLat(), vehicleEntry.getLon()));
            options.title(vehicleEntry.getVehicle().getRegistrationNumber());
            options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE));
            map.addMarker(options);
        }

    }

    @Override
    public void onRoutingCancelled() {

    }


    @SuppressLint("CheckResult")
    private void updateCamera(LatLng current, float bearing) {
        try {
            Toasty.info(
                    this,
                    "Updating Location...",
                    Toast.LENGTH_SHORT,
                    true
            ).show();
            MarkerOptions options = new MarkerOptions();
            options.position(current);
            options.icon(bitmapDescriptorFromVector(this, R.drawable.ic_location_on_black_24dp));

            options.flat(true);
            options.anchor(0.5f, 0.5f);
            busLocation = map.addMarker(options);
            Objects.requireNonNull(busLocation).setRotation(bearing);

            busLocation.setPosition(current);
            CameraPosition cameraPosition = new CameraPosition.Builder(map.getCameraPosition())
                    .target(current).zoom(10).build();
            map.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        } catch (Exception e) {
            Toast.makeText(
                    this,
                    e.getLocalizedMessage(),
                    Toast.LENGTH_SHORT
            ).show();
        }

    }

    private BitmapDescriptor bitmapDescriptorFromVector(Context context, int vectorResId) {
        Drawable vectorDrawable = ContextCompat.getDrawable(context, vectorResId);
        Objects.requireNonNull(vectorDrawable).setBounds(0, 0, vectorDrawable.getIntrinsicWidth(), vectorDrawable.getIntrinsicHeight());
        Bitmap bitmap = Bitmap.createBitmap(vectorDrawable.getIntrinsicWidth(), vectorDrawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        vectorDrawable.draw(canvas);
        return BitmapDescriptorFactory.fromBitmap(bitmap);
    }


    private void askPermission() {
        Dexter.withActivity(this)
                .withPermissions(
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                )
                .withListener(new MultiplePermissionsListener() {
                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        // Toasty.info(RegisterActivity.this, "You have denied some permissions permanently, if the app force close try granting permission from settings.", Toasty.LENGTH_LONG, true).show();
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> permissions, PermissionToken token) {
                        token.continuePermissionRequest();
                    }
                })
                .check();
    }


    @Override
    public void onMapReady(@NonNull GoogleMap googleMap) {
        Toast.makeText(
                this,
                "Map Ready",
                Toast.LENGTH_SHORT
        ).show();
        map = googleMap;
        map.setTrafficEnabled(false);
        map.setBuildingsEnabled(true);
//        updateCamera(new LatLng(23.72866, 90.396453), 0);
    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {
        super.onPointerCaptureChanged(hasCapture);
    }


    @SuppressLint("SetTextI18n")
    @Override
    public void onConnected(@Nullable Bundle bundle) {
        mLocationRequest = new LocationRequest();
        mLocationRequest.setInterval(5 * 1000);
        mLocationRequest.setFastestInterval(10 * 1000);
        mLocationRequest.setSmallestDisplacement(gap);
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            showSettingsAlert();
        } else {
            if (mGoogleApiClient.isConnected())
                LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, this);
        }
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(mLocationRequest);
        builder.setAlwaysShow(true);

        result = LocationServices.SettingsApi.checkLocationSettings(mGoogleApiClient, builder.build());

        result.setResultCallback(result -> {
            final Status status = result.getStatus();
            //final LocationSettingsStates state = result.getLocationSettingsStates();
            switch (status.getStatusCode()) {
                case LocationSettingsStatusCodes.SUCCESS:
                    // All location settings are satisfied. The client can initialize location
                    // requests here.
                    //...
                    break;
                case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                    // Location settings are not satisfied. But could be fixed by showing the user
                    // a dialog.
                    try {
                        // Show the dialog by calling startResolutionForResult(),
                        // and check the result in onActivityResult().
                        status.startResolutionForResult(
                                this,
                                REQUEST_LOCATION);
                    } catch (IntentSender.SendIntentException e) {
                        // Ignore the error.
                    }
                    break;
                case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                    // Location settings are not satisfied. However, we have no way to fix the
                    // settings so we won't show the dialog.
                    //...
                    break;
            }
        });

    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        if (connectionResult.hasResolution()) {
            try {
                // Start an Activity that tries to resolve the error
                connectionResult.startResolutionForResult(this, CONNECTION_FAILURE_RESOLUTION_REQUEST);
                /*
                 * Thrown if Google Play services canceled the original
                 * PendingIntent
                 */
            } catch (IntentSender.SendIntentException e) {
                // Log the error
                e.printStackTrace();
            }
        } else {
            Log.e("Error", "Location services connection failed with code " + connectionResult.getErrorCode());
        }
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onLocationChanged(@NonNull Location location) {
        HashMap<String, Object> mapUpdate = new HashMap<>();
        double lat = location.getLatitude();
        double lon = location.getLongitude();
        int velocity = (int) (location.getSpeed() * 3.6);
        speed.setText(velocity + getString(R.string.kmh));
        mapUpdate.put("lat", lat);
        mapUpdate.put("lon", lon);
        mapUpdate.put("velocity", velocity);
        mapUpdate.put("bearing", location.getBearing());

        updateCamera(new LatLng(lat, lon), location.getBearing());

        Retrofit retrofit = RetrofitClient.getClient(BASE_URL);

        // Create an instance of the service
        nearbyStsService = retrofit.create(NearbyStsService.class);

        // Make the API call
        Call<STSResponse> call = nearbyStsService.getNearbySts( String.valueOf(lat), String.valueOf(lon));
        call.enqueue(new Callback<STSResponse>() {
            @Override
            public void onResponse(Call<STSResponse> call, Response<STSResponse> response) {
                if (response.isSuccessful()) {
                    STSResponse response1 = response.body();

//                    Add Marker for each STS
                    for (NearbySts sts : response1.sts) {
                        LatLng lt = new LatLng(sts.getLat(), sts.getLon());
                        stsList.add(new LatLng(sts.getLat(), sts.getLon()));
                        MarkerOptions options = new MarkerOptions();
                        options.position(lt);
                        options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED));
                        map.addMarker(options);
                    }



                    for (LatLng lt : stsList) {
                        MarkerOptions options = new MarkerOptions();
                        options.position(lt);
                        options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED));
                        map.addMarker(options);
                    }

                } else {
                    // Handle error
                }
            }

            @Override
            public void onFailure(Call<STSResponse> call, Throwable t) {
                // Handle failure
            }
        });
        //We will Update the mapMetaData object to the server
        if (!trip.getVehicleEntries().isEmpty()) {
            float[] results = new float[1];
            VehicleEntry lastEntry = trip.getVehicleEntries().get(trip.getVehicleEntries().size() - 1);
            Location.distanceBetween(lat, lon, lastEntry.getLat(), lastEntry.getLat(), results);
            float currentDistance = results[0];

            if (currentDistance > 250) {
                // Crossed 250 meters from last STS Vehicle Entry
                Toasty.info(
                        this,
                        "Crossed 250 meters from last STS Vehicle Entry",
                        Toast.LENGTH_SHORT,
                        true
                ).show();
            }
        }
    }


    @Override
    public void onStart() {
        super.onStart();
        try {
            if (this.mGoogleApiClient != null) {
                this.mGoogleApiClient.connect();
            }
        } catch (Exception ignored) {

        }

    }

    @Override
    public void onPause() {
        super.onPause();
        try {
            //stop location updates when Activity is no longer active
            if (mGoogleApiClient != null) {
                //LocationServices.FusedLocationApi.removeLocationUpdates(mGoogleApiClient, this);
            }
        } catch (Exception ignored) {

        }
    }


    public synchronized void buildGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(getBaseContext())
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        mGoogleApiClient.connect();
    }

    public void showSettingsAlert() {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(this);
        alertDialog.setTitle("GPS Error");
        alertDialog.setMessage("GPS is not enabled. Do you want to go to settings menu?");
        alertDialog.setCancelable(false);
        alertDialog.setPositiveButton("Fix",
                (dialog, which) -> {
                    Intent intent = new Intent(
                            Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                    startActivity(intent);
                });
        alertDialog.setNegativeButton("Cancel",
                (dialog, which) -> {
                    dialog.cancel();
                });

        // Showing Alert Message
        alertDialog.show();
    }
}
