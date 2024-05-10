package com.quantum_guys.dncc_eco_sync.models;

import android.net.Uri;

public class MultipleImage {

    private String local_path, url;
    private Uri local_uri;

    public MultipleImage() {
    }

    public MultipleImage(String url) {
        this.url = url;
    }

    public MultipleImage(String local_path, Uri local_uri) {
        this.local_path = local_path;
        this.local_uri = local_uri;
    }

    public Uri getLocal_uri() {
        return local_uri;
    }

    public void setLocal_uri(Uri local_uri) {
        this.local_uri = local_uri;
    }

    public String getLocal_path() {
        return local_path;
    }

    public void setLocal_path(String local_path) {
        this.local_path = local_path;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
