package com.quantum_guys.dncc_eco_sync.activity;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.quantum_guys.dncc_eco_sync.R;

public class SelectCategory extends AppCompatActivity {
    StringBuilder category = new StringBuilder();
    String difficulty="medium";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_select_category);

        ChipGroup categories = findViewById(R.id.chips_categories);
        ChipGroup difficulties = findViewById(R.id.chips_difficulty);

        findViewById(R.id.button2).setOnClickListener(view -> {
            for (int i=0; i<categories.getChildCount();i++){
                Chip chip = (Chip) categories.getChildAt(i);
                if (chip.isChecked()){
                    category.append(getResources().getResourceEntryName(chip.getId())).append(",");
                }
            }
            for (int i=0; i<difficulties.getChildCount();i++){
                Chip chip = (Chip) difficulties.getChildAt(i);
                if (chip.isChecked()){
                    difficulty = getResources().getResourceEntryName(chip.getId());
                }
            }

            if(category==null){
                startActivity(
                        new Intent(getApplicationContext(),
                                QuizBattle.class)
                                .putExtra("category", "science")
                                .putExtra("difficulty", difficulty));
            }else{
                startActivity(
                        new Intent(getApplicationContext(),
                                QuizBattle.class)
                                .putExtra("category", category.toString().replaceAll(",$", ""))
                                .putExtra("difficulty", difficulty));
            }

        });


    }
}