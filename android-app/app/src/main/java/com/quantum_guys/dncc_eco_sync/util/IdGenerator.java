package com.quantum_guys.dncc_eco_sync.util;import java.util.Random;public class IdGenerator {    public static String getRandomId() {        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";        StringBuilder salt = new StringBuilder();        Random rnd = new Random();        while (salt.length() < 15) { // length of the random string.            int index = (int) (rnd.nextFloat() * SALTCHARS.length());            salt.append(SALTCHARS.charAt(index));        }        return salt.toString();    }    public static int getRandomNumber(int max) {        Random rnd = new Random();        return rnd.nextInt(max);    }}