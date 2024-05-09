/* Copyright 2019 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

package com.quantum_guys.dncc_eco_sync.face;

import android.annotation.SuppressLint;

import androidx.annotation.NonNull;


public interface SimilarityClassifier {


    class Recognition {



    private final Float distance;
    private Object extra;

    public Recognition(final Float distance) {
      this.distance = distance;
      this.extra = null;

    }

    public void setExtra(Object extra) {
      this.extra = extra;
    }

    public Object getExtra() {
      return this.extra;
    }

    @NonNull
    @SuppressLint("DefaultLocale")
    @Override
    public String toString() {
      String resultString = "";
      if (distance != null) {
        resultString += String.format("(%.1f%%) ", distance * 100.0f);
      }

      return resultString.trim();
    }

  }
}
