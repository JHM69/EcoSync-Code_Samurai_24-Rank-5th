package com.quantum_guys.dncc_eco_sync.activity;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.MultiplePermissionsReport;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.multi.MultiplePermissionsListener;
import com.quantum_guys.dncc_eco_sync.R;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.Image;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.util.Size;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;
import androidx.core.content.PermissionChecker;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;
import com.quantum_guys.dncc_eco_sync.model.ScannedData;
import com.quantum_guys.dncc_eco_sync.util.Encoder;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ScanQR extends BottomSheetDialogFragment {

    ProcessCameraProvider cameraProvider;
    private static final int MY_CAMERA_REQUEST_CODE = 100;
    BarcodeScannerOptions options;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    BarcodeScanner scanner;
    ExecutorService executor;
   // DatabaseReference db;
    ImageAnalysis imageAnalysis;
    PreviewView previewView;
    int cam_face = CameraSelector.LENS_FACING_BACK;

    Activity activity;


    public ScanQR(Activity activity) {
        this.activity = activity;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate( R.layout.activity_pass_scan_q_r, container, false);
    }


    @SuppressLint("WrongConstant")
    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void onViewCreated(@NonNull View v, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(v, savedInstanceState);
        previewView = v.findViewById(R.id.previewView);
        requestCameraPermission();
       // db = FirebaseDatabase.getInstance().getReference();
    }

    private void cameraBind() {
        cameraProviderFuture = ProcessCameraProvider.getInstance(activity);
        cameraProviderFuture.addListener(() -> {
            try {
                cameraProvider = cameraProviderFuture.get();
                bindPreview(cameraProvider);
            } catch (ExecutionException | InterruptedException ignored) {

            }
        }, ContextCompat.getMainExecutor(activity));
    }


    void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {

        Preview preview = new Preview.Builder()
                .build();

        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(cam_face)
                .build();

        preview.setSurfaceProvider(previewView.getSurfaceProvider());

        imageAnalysis =
                new ImageAnalysis.Builder()
                        .setTargetResolution(new Size(400, 400))
                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST) //Latest frame is shown
                        .build();

        executor = Executors.newSingleThreadExecutor();
        imageAnalysis.setAnalyzer(executor, imageProxy -> {
            InputImage image = null;
            @SuppressLint({"UnsafeExperimentalUsageError", "UnsafeOptInUsageError"})
            // Camera Feed-->Analyzer-->ImageProxy-->mediaImage-->InputImage(needed for ML kit face detection)
                    Image mediaImage = imageProxy.getImage();
            if (mediaImage != null) {
                image = InputImage.fromMediaImage(mediaImage, imageProxy.getImageInfo().getRotationDegrees());
                System.out.println("Rotation " + imageProxy.getImageInfo().getRotationDegrees());
            }

            scanner.process(image)
                    .addOnSuccessListener(barcodes -> {
                        if (barcodes.size() != 0) {
                            Barcode barcode = barcodes.get(0);
                            int valueType = barcode.getValueType();
                            if (valueType == Barcode.TYPE_TEXT) {
                                String qrData = Encoder.decode(barcode.getRawValue());
                                if (qrData != null) {
                                   // ScannedData scannedData = new Gson().fromJson(qrData, ScannedData.class);
                                    executor.shutdown();
                                    imageAnalysis.clearAnalyzer();
                                    //showPaymentActivity(scannedData);
                                }
                            }
                            try {
                                Thread.sleep(100);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                        }
                    })
                    .addOnFailureListener(e -> {
                    })
                    .addOnCompleteListener(task -> imageProxy.close());
        });
        cameraProvider.bindToLifecycle(this, cameraSelector, imageAnalysis, preview);
    }




    @Override
    public void setUserVisibleHint(boolean isVisibleToUser) {
        super.setUserVisibleHint(isVisibleToUser);
        if (!isVisibleToUser) {
            try {
                previewView.setAlpha(0.4f);
                executor.shutdown();
                imageAnalysis.clearAnalyzer();
                cameraProvider.unbindAll();
            } catch (Exception e) {
                Log.d("setUserVisibleHint", "setUserVisibleHint: " + e.getLocalizedMessage());
            }
        } else {
            try {
                showView();
            } catch (Exception e) {
                Log.d("setUserVisibleHint", "setUserVisibleHint: " + e.getLocalizedMessage());
            }
        }
    }

    @SuppressLint("WrongConstant")
    void showView() {
        options = new BarcodeScannerOptions.Builder().setBarcodeFormats(
                Barcode.FORMAT_QR_CODE,
                Barcode.FORMAT_AZTEC)
                .build();
        scanner = BarcodeScanning.getClient();

        if (PermissionChecker.checkSelfPermission(requireContext(), Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.CAMERA}, MY_CAMERA_REQUEST_CODE);
        }
        previewView.setAlpha(1f);
        cameraBind();
    }



    private void requestCameraPermission() {
        Dexter.withActivity(activity)
                .withPermissions(Manifest.permission.CAMERA)
                .withListener(new MultiplePermissionsListener() {
                    @Override
                    public void onPermissionsChecked(MultiplePermissionsReport report) {
                        if (report.areAllPermissionsGranted()) {
                            // Camera permission granted, continue camera initialization
                            showView();
                        } else {

                            Toast.makeText(
                                    activity,
                                    "Camera Permission Denied",
                                    Toast.LENGTH_SHORT
                            ).show();


                        }
                    }

                    @Override
                    public void onPermissionRationaleShouldBeShown(List<PermissionRequest> list, PermissionToken permissionToken) {
                        permissionToken.continuePermissionRequest();
                    }

                }).check();
    }

}