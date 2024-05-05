package com.quantum_guys.dncc_eco_sync.activity;


import android.Manifest;
import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.FragmentManager;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.transition.Explode;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.directions.route.Route;
import com.directions.route.RouteException;
import com.directions.route.Routing;
import com.directions.route.RoutingListener;
import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MapStyleOptions;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.quantum_guys.dncc_eco_sync.R;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import androidmads.library.qrgenearator.QRGContents;
import androidmads.library.qrgenearator.QRGEncoder;
import es.dmoral.toasty.Toasty;


public class MapView extends AppCompatActivity implements OnMapReadyCallback, RoutingListener {
    GoogleMap map;
    Marker busLocation;
    private List<Polyline> polyLines = new ArrayList<>();

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

        Button qr_btn = findViewById(R.id.scan_button);
        qr_btn.setOnClickListener(v -> {
            ScanQR bottomSheetFragment = new ScanQR(MapView.this);
            bottomSheetFragment.show(getSupportFragmentManager(), bottomSheetFragment.getTag());
        });


        SupportMapFragment mapFragment =
                (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);

        if (mapFragment != null) {
            mapFragment.getMapAsync(this);
        }else{
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
//                    .waypoints(allStations)
                    .key(getString(R.string.google_api_key))
                    .build();

            routing.execute();
        } catch (Exception d) {
            Toast.makeText(this, d.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
        }
    }



    @Override
    public void onBackPressed() {
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

        if (polyLines.size() > 0) {
            for (Polyline poly : polyLines) {
                poly.remove();
            }
        }
        polyLines = new ArrayList<>();
        //add route(s) to the map.

        try {
            for (int i = 0; i < route.size(); i++) {
                //In case of more than 5 alternative routes
                PolylineOptions polyOptions = new PolylineOptions();
                //polyOptions.color(getResources().getColor(R.color.addColor));
                polyOptions.width(15 + i * 3);
                polyOptions.addAll(route.get(i).getPoints());
                Polyline polyline = map.addPolyline(polyOptions);
                polyLines.add(polyline);
            }
        } catch (Exception ignored) {

        }

//        for (int i = 0; i < routeValue.getStationList().size(); i++) {
//            if (i == 0) {
//                Station l = routeValue.getStationList().get(i);
//                MarkerOptions options = new MarkerOptions();
//                options.position(new LatLng(l.getLat(), l.getLon()));
//                options.title(l.getName());
//                options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE));
//                map.addMarker(options);
//            } else if (i == routeValue.getStationList().size() - 1) {
//                Station l = routeValue.getStationList().get(i);
//                MarkerOptions options = new MarkerOptions();
//                options.position(new LatLng(l.getLat(), l.getLon()));
//                options.title(l.getName());
//                options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_MAGENTA));
//                map.addMarker(options);
//            } else {
//                Station l = routeValue.getStationList().get(i);
//                MarkerOptions options = new MarkerOptions();
//                options.position(new LatLng(l.getLat(), l.getLon()));
//                options.title(l.getName());
//                options.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_VIOLET));
//                map.addMarker(options);
//            }
//        }
//
    }

    @Override
    public void onRoutingCancelled() {

    }


    @SuppressLint("CheckResult")
    private void updateCamera(LatLng current, float bearing) {
        try{
            Toasty.info(
                    this,
                    "Updating Location...",
                    Toast.LENGTH_SHORT,
                    true
            ).show();
            MarkerOptions options = new MarkerOptions();
            options.position(current);
            options.icon(bitmapDescriptorFromVector(this, R.drawable.truck));

            options.flat(true);
            options.anchor(0.5f, 0.5f);
            busLocation = map.addMarker(options);
            Objects.requireNonNull(busLocation).setRotation(bearing);

            busLocation.setPosition(current);
            CameraPosition cameraPosition = new CameraPosition.Builder(map.getCameraPosition())
                    .target(current).zoom(10).build();
            map.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        }catch (Exception e){
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
        updateCamera(new LatLng( 0,0 ), 0);
    }

    @Override
    public void onPointerCaptureChanged(boolean hasCapture) {
        super.onPointerCaptureChanged(hasCapture);
    }
}
