package com.quantum_guys.dncc_eco_sync.ui.activities.issue;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
"place_id",
"licence",
"osm_type",
"osm_id",
"lat",
"lon",
"display_name",
"address",
"boundingbox"
}) 
public class Example {

@JsonProperty("place_id")
private Integer placeId;
@JsonProperty("licence")
private String licence;
@JsonProperty("osm_type")
private String osmType;
@JsonProperty("osm_id")
private Long osmId;
@JsonProperty("lat")
private String lat;
@JsonProperty("lon")
private String lon;
@JsonProperty("display_name")
private String displayName;
@JsonProperty("address")
private Address address;
@JsonProperty("boundingbox")
private List<String> boundingbox;
@JsonIgnore
private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

@JsonProperty("place_id")
public Integer getPlaceId() {
return placeId;
}

@JsonProperty("place_id")
public void setPlaceId(Integer placeId) {
this.placeId = placeId;
}

@JsonProperty("licence")
public String getLicence() {
return licence;
}

@JsonProperty("licence")
public void setLicence(String licence) {
this.licence = licence;
}

@JsonProperty("osm_type")
public String getOsmType() {
return osmType;
}

@JsonProperty("osm_type")
public void setOsmType(String osmType) {
this.osmType = osmType;
}

@JsonProperty("osm_id")
public Long getOsmId() {
return osmId;
}

@JsonProperty("osm_id")
public void setOsmId(Long osmId) {
this.osmId = osmId;
}

@JsonProperty("lat")
public String getLat() {
return lat;
}

@JsonProperty("lat")
public void setLat(String lat) {
this.lat = lat;
}

@JsonProperty("lon")
public String getLon() {
return lon;
}

@JsonProperty("lon")
public void setLon(String lon) {
this.lon = lon;
}

@JsonProperty("display_name")
public String getDisplayName() {
return displayName;
}

@JsonProperty("display_name")
public void setDisplayName(String displayName) {
this.displayName = displayName;
}

@JsonProperty("address")
public Address getAddress() {
return address;
}

@JsonProperty("address")
public void setAddress(Address address) {
this.address = address;
}

@JsonProperty("boundingbox")
public List<String> getBoundingbox() {
return boundingbox;
}

@JsonProperty("boundingbox")
public void setBoundingbox(List<String> boundingbox) {
this.boundingbox = boundingbox;
}

@JsonAnyGetter
public Map<String, Object> getAdditionalProperties() {
return this.additionalProperties;
}

@JsonAnySetter
public void setAdditionalProperty(String name, Object value) {
this.additionalProperties.put(name, value);
}

}