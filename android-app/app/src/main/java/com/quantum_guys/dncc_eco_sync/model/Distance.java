package com.quantum_guys.dncc_eco_sync.model;import com.fasterxml.jackson.annotation.JsonInclude;import com.fasterxml.jackson.annotation.JsonProperty;import java.io.Serializable;@JsonInclude(JsonInclude.Include.NON_NULL)public class Distance implements Serializable {    @JsonProperty("text")    private String text;    @JsonProperty("value")    private Integer value;    @JsonProperty("text")    public String getText() {        return text;    }    @JsonProperty("value")    public Integer getValue() {        return value;    }}