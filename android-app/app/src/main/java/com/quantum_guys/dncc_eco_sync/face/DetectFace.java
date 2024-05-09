package com.quantum_guys.dncc_eco_sync.face;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.YuvImage;
import android.media.Image;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Pair;
import android.util.Size;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;

import com.afollestad.materialdialogs.MaterialDialog;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.face.Face;
import com.google.mlkit.vision.face.FaceDetector;
import com.google.mlkit.vision.face.FaceDetectorOptions;
import com.quantum_guys.dncc_eco_sync.BuildConfig;
import com.quantum_guys.dncc_eco_sync.R;
import com.quantum_guys.dncc_eco_sync.activity.MapView;
import com.quantum_guys.dncc_eco_sync.global.UserDB;
import com.quantum_guys.dncc_eco_sync.model.Notification;
import com.quantum_guys.dncc_eco_sync.retrofit.ApiUtils;
import com.quantum_guys.dncc_eco_sync.retrofit.AuthService;
import com.quantum_guys.dncc_eco_sync.util.IdGenerator;
import com.quantum_guys.dncc_eco_sync.util.SendNotificationPack.APIService;
import com.quantum_guys.dncc_eco_sync.util.SendNotificationPack.Client;
import com.quantum_guys.dncc_eco_sync.util.SendNotificationPack.MyResponse;
import com.quantum_guys.dncc_eco_sync.util.SendNotificationPack.NotificationSender;

import org.jetbrains.annotations.NotNull;
import org.tensorflow.lite.Interpreter;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.MappedByteBuffer;
import java.nio.ReadOnlyBufferException;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import es.dmoral.toasty.Toasty;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DetectFace extends AppCompatActivity {
    private static final int MY_CAMERA_REQUEST_CODE = 100;
    private FaceDetector detector;
    //private DatabaseReference db;
    private PreviewView previewView;
    private Interpreter tfLite;
    private ExecutorService executor;
    private boolean start = false, flipX = false;
    private String driverLicenceNo;
    //private Bus bus;
    private boolean endTrip = false;
    private boolean returnTrip = false;
    private boolean preBook = false;
    private final Context context = DetectFace.this;
    private int cam_face = CameraSelector.LENS_FACING_FRONT; //Default Back Camera
    private final int OUTPUT_SIZE = 192;
    private ProcessCameraProvider cameraProvider;
    private String authorityId, routeId, tripId;
    private ProgressBar progressBar;
    private int attempts = 7;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    private HashMap<String, SimilarityClassifier.Recognition> registered = new HashMap<>(); //saved Faces

    private static Bitmap getCropBitmapByCPU(Bitmap source, RectF cropRectF) {
        Bitmap resultBitmap = Bitmap.createBitmap((int) cropRectF.width(),
                (int) cropRectF.height(), Bitmap.Config.ARGB_8888);
        Canvas cavas = new Canvas(resultBitmap);

        // draw background
        Paint paint = new Paint(Paint.FILTER_BITMAP_FLAG);
        paint.setColor(Color.WHITE);
        cavas.drawRect(//from  w w  w. ja v  a  2s. c  om
                new RectF(0, 0, cropRectF.width(), cropRectF.height()),
                paint);

        Matrix matrix = new Matrix();
        matrix.postTranslate(-cropRectF.left, -cropRectF.top);

        cavas.drawBitmap(source, matrix, paint);

        if (source != null && !source.isRecycled()) {
            source.recycle();
        }

        return resultBitmap;
    }

    private static Bitmap rotateBitmap(
            Bitmap bitmap, int rotationDegrees, boolean flipX) {
        Matrix matrix = new Matrix();

        // Rotate the image back to straight.
        matrix.postRotate(rotationDegrees);

        // Mirror the image along the X or Y axis.
        matrix.postScale(flipX ? -1.0f : 1.0f, 1.0f);
        Bitmap rotatedBitmap =
                Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);

        // Recycle the old bitmap if it has changed.
        if (rotatedBitmap != bitmap) {
            bitmap.recycle();
        }
        return rotatedBitmap;
    }

    //IMPORTANT. If conversion not done ,the toBitmap conversion does not work on some devices.
    private static byte[] YUV_420_888toNV21(Image image) {

        int width = image.getWidth();
        int height = image.getHeight();
        int ySize = width * height;
        int uvSize = width * height / 4;

        byte[] nv21 = new byte[ySize + uvSize * 2];

        ByteBuffer yBuffer = image.getPlanes()[0].getBuffer(); // Y
        ByteBuffer uBuffer = image.getPlanes()[1].getBuffer(); // U
        ByteBuffer vBuffer = image.getPlanes()[2].getBuffer(); // V

        int rowStride = image.getPlanes()[0].getRowStride();
        if (BuildConfig.DEBUG && !(image.getPlanes()[0].getPixelStride() == 1)) {
            throw new AssertionError("Assertion failed");
        }

        int pos = 0;

        if (rowStride == width) { // likely
            yBuffer.get(nv21, 0, ySize);
            pos += ySize;
        } else {
            long yBufferPos = -rowStride; // not an actual position
            for (; pos < ySize; pos += width) {
                yBufferPos += rowStride;
                yBuffer.position((int) yBufferPos);
                yBuffer.get(nv21, pos, width);
            }
        }

        rowStride = image.getPlanes()[2].getRowStride();
        int pixelStride = image.getPlanes()[2].getPixelStride();

        if (BuildConfig.DEBUG && !(rowStride == image.getPlanes()[1].getRowStride())) {
            throw new AssertionError("Assertion failed");
        }
        if (BuildConfig.DEBUG && !(pixelStride == image.getPlanes()[1].getPixelStride())) {
            throw new AssertionError("Assertion failed");
        }

        if (pixelStride == 2 && rowStride == width && uBuffer.get(0) == vBuffer.get(1)) {
            // maybe V an U planes overlap as per NV21, which means vBuffer[1] is alias of uBuffer[0]
            byte savePixel = vBuffer.get(1);
            try {
                vBuffer.put(1, (byte) ~savePixel);
                if (uBuffer.get(0) == (byte) ~savePixel) {
                    vBuffer.put(1, savePixel);
                    vBuffer.position(0);
                    uBuffer.position(0);
                    vBuffer.get(nv21, ySize, 1);
                    uBuffer.get(nv21, ySize + 1, uBuffer.remaining());

                    return nv21; // shortcut
                }
            } catch (ReadOnlyBufferException ex) {
                // unfortunately, we cannot check if vBuffer and uBuffer overlap
            }

            // unfortunately, the check failed. We must save U and V pixel by pixel
            vBuffer.put(1, savePixel);
        }

        // other optimizations could check if (pixelStride == 1) or (pixelStride == 2),
        // but performance gain would be less significant

        for (int row = 0; row < height / 2; row++) {
            for (int col = 0; col < width / 2; col++) {
                int vuPos = col * pixelStride + row * rowStride;
                nv21[pos++] = vBuffer.get(vuPos);
                nv21[pos++] = uBuffer.get(vuPos);
            }
        }

        return nv21;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Load saved faces from memory when app starts
        setContentView(R.layout.driver_face_recognition);
        progressBar = findViewById(R.id.progressBar8);


        Intent intent = getIntent();


        tripId = intent.getStringExtra("tripId");

        //db = FirebaseDatabase.getInstance().getReference();
        initFace();

        ImageView camera_switch = findViewById(R.id.button5);
        //Camera Permission
        if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.CAMERA}, MY_CAMERA_REQUEST_CODE);
        }
        //On-screen Action Button

        //On-screen switch to toggle between Cameras.
        camera_switch.setOnClickListener(v -> {
            if (cam_face == CameraSelector.LENS_FACING_BACK) {
                cam_face = CameraSelector.LENS_FACING_FRONT;
                flipX = true;
            } else {
                cam_face = CameraSelector.LENS_FACING_BACK;
                flipX = false;
            }
            cameraProvider.unbindAll();
            cameraBind();
        });


        //Load model
        try {
            //model name
            String modelFile = "mobile_face_net.tflite";
            tfLite = new Interpreter(loadModelFile(DetectFace.this, modelFile));
        } catch (IOException e) {
            e.printStackTrace();
        }
        //Initialize Face Detector
        FaceDetectorOptions highAccuracyOpts =
                new FaceDetectorOptions.Builder()
                        .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                        .build();
        detector = com.google.mlkit.vision.face.FaceDetection.getClient(highAccuracyOpts);

        cameraBind();


    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == MY_CAMERA_REQUEST_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "camera permission granted", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(this, "camera permission denied", Toast.LENGTH_LONG).show();
            }
        }
    }

    private MappedByteBuffer loadModelFile(Activity activity, String MODEL_FILE) throws IOException {
        AssetFileDescriptor fileDescriptor = activity.getAssets().openFd(MODEL_FILE);
        FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel = inputStream.getChannel();
        long startOffset = fileDescriptor.getStartOffset();
        long declaredLength = fileDescriptor.getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
    }

    //Bind camera and preview view
    private void cameraBind() {
        cameraProviderFuture = ProcessCameraProvider.getInstance(this);

        previewView = findViewById(R.id.previewView);
        cameraProviderFuture.addListener(() -> {
            try {
                cameraProvider = cameraProviderFuture.get();

                bindPreview(cameraProvider);
            } catch (ExecutionException | InterruptedException e) {
                // No errors need to be handled for this in Future.
                // This should never be reached.
            }
        }, ContextCompat.getMainExecutor(this));
    }

    void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {
        Preview preview = new Preview.Builder()
                .build();

        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(cam_face)
                .build();

        preview.setSurfaceProvider(previewView.getSurfaceProvider());
        ImageAnalysis imageAnalysis =
                new ImageAnalysis.Builder()
                        .setTargetResolution(new Size(640, 480))
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

            detector.process(Objects.requireNonNull(image))
                    .addOnSuccessListener(
                            faces -> {
                                if (faces.size() != 0) {
                                    Face face = faces.get(0); //Get first face from detected faces
                                    System.out.println(face);

                                    //mediaImage to Bitmap
                                    Bitmap frame_bmp = toBitmap(mediaImage);

                                    int rot = imageProxy.getImageInfo().getRotationDegrees();

                                    //Adjust orientation of Face
                                    Bitmap frame_bmp1 = rotateBitmap(frame_bmp, rot, flipX);


                                    //Get bounding box of face
                                    RectF boundingBox = new RectF(face.getBoundingBox());

                                    //Crop out bounding box from whole Bitmap(image)
                                    Bitmap cropped_face = getCropBitmapByCPU(frame_bmp1, boundingBox);

                                    //Scale the acquired Face to 112*112 which is required input for model
                                    Bitmap scaled = getResizedBitmap(cropped_face, 112, 112);

                                    if (start)
                                        recognizeImage(scaled); //Send scaled bitmap to create face embeddings.
                                    System.out.println(boundingBox);
                                    try {
                                        Thread.sleep(100);  //Camera preview refreshed every 100 millisec(adjust as required)
                                    } catch (InterruptedException e) {
                                        e.printStackTrace();
                                    }
                                }

                            })
                    .addOnFailureListener(
                            e -> {
                                Toasty.error(context, Objects.requireNonNull(e.getLocalizedMessage()), Toast.LENGTH_SHORT).show();
                                // Task failed with an exception
                                // ...
                            })
                    .addOnCompleteListener(task -> {
                        imageProxy.close(); //v.important to acquire next frame for analysis
                    });

        });
        cameraProvider.bindToLifecycle(this, cameraSelector, imageAnalysis, preview);
    }

    public void recognizeImage(final Bitmap bitmap) {

        // set Face to Preview
        //Create ByteBuffer to store normalized image

        //Input size for model
        int inputSize = 112;
        ByteBuffer imgData = ByteBuffer.allocateDirect(inputSize * inputSize * 3 * 4);

        imgData.order(ByteOrder.nativeOrder());

        int[] intValues = new int[inputSize * inputSize];

        //get pixel values from Bitmap to normalize
        bitmap.getPixels(intValues, 0, bitmap.getWidth(), 0, 0, bitmap.getWidth(), bitmap.getHeight());

        imgData.rewind();

        for (int i = 0; i < inputSize; ++i) {
            for (int j = 0; j < inputSize; ++j) {
                int pixelValue = intValues[i * inputSize + j];
                // Float model
                float IMAGE_MEAN = 128.0f;
                float IMAGE_STD = 128.0f;
                imgData.putFloat((((pixelValue >> 16) & 0xFF) - IMAGE_MEAN) / IMAGE_STD);
                imgData.putFloat((((pixelValue >> 8) & 0xFF) - IMAGE_MEAN) / IMAGE_STD);
                imgData.putFloat(((pixelValue & 0xFF) - IMAGE_MEAN) / IMAGE_STD);

            }
        }
        //imgData is input to our model
        Object[] inputArray = {imgData};

        Map<Integer, Object> outputMap = new HashMap<>();


        float[][] embeedings = new float[1][OUTPUT_SIZE]; //output of model will be stored in this variable

        outputMap.put(0, embeedings);

        tfLite.runForMultipleInputsOutputs(inputArray, outputMap); //Run model


        if (attempts > 0) {
            float distance;
            if (registered.size() > 0) {
                final Pair<String, Float> nearest = findNearest(embeedings[0]);
                if (nearest != null) {
                    final String licenceNo = nearest.first;
                    distance = nearest.second;
                    if (distance < 1.000f) {
                        if (licenceNo.equals(driverLicenceNo)) {

                                Toasty.success(this, "Verification Success", Toast.LENGTH_SHORT).show();
                                startActivity(new Intent(getApplicationContext(), MapView.class)
                                        .putExtra("tripId", tripId) );
                            executor.shutdownNow();
                            finish();

                        }
                    } else {
                        attempts--;
                        if ((endTrip || returnTrip)) {
                            Notification notification = new Notification(IdGenerator.getRandomId(), "Driver's Ending Face doesn't matched", driverLicenceNo, 1, driverLicenceNo, routeId, "bus.getBusNo()", tripId, (-1 * System.currentTimeMillis()), "");
                            new SendNotificationAsyncTask(notification, authorityId).execute();
                            HashMap<String, Object> map = new HashMap<>();
                            map.put("endTimestamp", (-1 * System.currentTimeMillis()));
                            map.put("active", false);
                            map.put("errorLastFace", true);
                            //db.child("Bus").child(bus.getBusNo()).child("Trips").child(tripId).updateChildren(map);
                            executor.shutdownNow();
                            //startActivity(new Intent(getApplicationContext(), BusNoActivity.class));
                            finish();
                        }
                    }
                }
            }
        } else {
            executor.shutdownNow();
            finish();
        }
    }

    @SuppressLint("StaticFieldLeak")
    private class SendNotificationAsyncTask extends AsyncTask<Void, Void, Void> {
        final APIService apiService;
        Notification notificationData;
        String who;

        private SendNotificationAsyncTask(Notification notificationData, String who) {
            this.notificationData = notificationData;
            this.who = who;
            apiService = Client.getClient("https://fcm.googleapis.com/").create(APIService.class);
        }

        @Override
        protected Void doInBackground(Void... jk) {
            try {
                //DatabaseReference db = FirebaseDatabase.getInstance().getReference();
                //String usertoken = dataSnapshot.getValue(String.class);
                NotificationSender sender = new NotificationSender(notificationData, "usertoken");
                apiService.sendNotifcation(sender).enqueue(new Callback<MyResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<MyResponse> call, @NonNull Response<MyResponse> response) {
                        if (response.code() == 200) {
                            Objects.requireNonNull(response.body());
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<MyResponse> call, @NotNull Throwable t) {

                    }
                });
                  } catch (NullPointerException ignored) {

            }
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            finish();
            super.onPostExecute(aVoid);
        }
    }

    //Compare Faces by distance between face embeddings
    private Pair<String, Float> findNearest(float[] emb) {

        Pair<String, Float> ret = null;
        for (Map.Entry<String, SimilarityClassifier.Recognition> entry : registered.entrySet()) {

            final String licenceNo = entry.getKey();
            final float[] knownEmb = ((float[][]) entry.getValue().getExtra())[0];

            float distance = 0;
            for (int i = 0; i < emb.length; i++) {
                float diff = emb[i] - knownEmb[i];
                distance += diff * diff;
            }
            distance = (float) Math.sqrt(distance);
            if (ret == null || distance < ret.second) {
                ret = new Pair<>(licenceNo, distance);
            }
        }

        return ret;

    }

    public Bitmap getResizedBitmap(Bitmap bm, int newWidth, int newHeight) {
        int width = bm.getWidth();
        int height = bm.getHeight();
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        // CREATE A MATRIX FOR THE MANIPULATION
        Matrix matrix = new Matrix();
        // RESIZE THE BIT MAP
        matrix.postScale(scaleWidth, scaleHeight);

        // "RECREATE" THE NEW BITMAP
        Bitmap resizedBitmap = Bitmap.createBitmap(
                bm, 0, 0, width, height, matrix, false);
        bm.recycle();
        return resizedBitmap;
    }

    private Bitmap toBitmap(Image image) {

        byte[] nv21 = YUV_420_888toNV21(image);


        YuvImage yuvImage = new YuvImage(nv21, ImageFormat.NV21, image.getWidth(), image.getHeight(), null);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        yuvImage.compressToJpeg(new Rect(0, 0, yuvImage.getWidth(), yuvImage.getHeight()), 75, out);

        byte[] imageBytes = out.toByteArray();


        return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
    }

    void loading(boolean loading) {
        if (loading) {
            start = false;
            progressBar.setVisibility(View.VISIBLE);
        } else {
            start = true;
            progressBar.setVisibility(View.GONE);
        }
    }

    void initFace() {
        loading(true);
                String faceData = UserDB.getFaceData(context);

                if(faceData == null || faceData.isEmpty()) {
                    AuthService authService = ApiUtils.getAuthService(this);
                    authService.getFaceData("Bearer " + UserDB.getToken(context)).enqueue(new Callback<ResponseBody>() {
                        @Override
                        public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                            try {
                                if (response.body() != null) {
                                    getRecognitionFromString(response.body().string());
                                    loading(false);
                                }
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }

                        @Override
                        public void onFailure(Call<ResponseBody> call, Throwable throwable) {
                            Toasty.error(context, "Failed to load face data", Toast.LENGTH_SHORT).show();
                            finish();
                        }

                    });

                }
    }

    private void getRecognitionFromString(String json) {
        TypeToken<HashMap<String, SimilarityClassifier.Recognition>> token = new TypeToken<HashMap<String, SimilarityClassifier.Recognition>>() {
        };
        registered = new Gson().fromJson(json, token.getType());

        try {
            for (Map.Entry<String, SimilarityClassifier.Recognition> entry : registered.entrySet()) {
                float[][] output = new float[1][OUTPUT_SIZE];
                ArrayList arrayList = (ArrayList) entry.getValue().getExtra();
                arrayList = (ArrayList) arrayList.get(0);
                for (int counter = 0; counter < arrayList.size(); counter++) {
                    output[0][counter] = ((Double) arrayList.get(counter)).floatValue();
                }
                entry.getValue().setExtra(output);
            }
        } catch (Exception n) {
            finish();
        }
    }

    @Override
    public void onBackPressed() {
        new MaterialDialog.Builder(this)
                .title("Discard Face Detection?")
                .content("Are you sure want to go Back?")
                .positiveText("Yes")
                .canceledOnTouchOutside(false)
                .cancelable(false)
                .onPositive((dialog, which) -> {
                    executor.shutdownNow();
                    finish();
                    super.onBackPressed();
                }).negativeText("No")
                .show();
    }

    //Load Photo from phone storage
}

