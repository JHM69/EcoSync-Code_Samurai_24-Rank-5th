package com.quantum_guys.dncc_eco_sync.models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class TripPlanSts {

    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("tripPlanId")
    @Expose
    private Integer tripPlanId;
    @SerializedName("stsId")
    @Expose
    private Integer stsId;
    @SerializedName("time")
    @Expose
    private String time;
    @SerializedName("visited")
    @Expose
    private Boolean visited;
    @SerializedName("visitedAt")
    @Expose
    private Object visitedAt;
    @SerializedName("weiqht")
    @Expose
    private Object weiqht;
    @SerializedName("sts")
    @Expose
    private Sts sts;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTripPlanId() {
        return tripPlanId;
    }

    public void setTripPlanId(Integer tripPlanId) {
        this.tripPlanId = tripPlanId;
    }

    public Integer getStsId() {
        return stsId;
    }

    public void setStsId(Integer stsId) {
        this.stsId = stsId;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Boolean getVisited() {
        return visited;
    }

    public void setVisited(Boolean visited) {
        this.visited = visited;
    }

    public Object getVisitedAt() {
        return visitedAt;
    }

    public void setVisitedAt(Object visitedAt) {
        this.visitedAt = visitedAt;
    }

    public Object getWeiqht() {
        return weiqht;
    }

    public void setWeiqht(Object weiqht) {
        this.weiqht = weiqht;
    }

    public Sts getSts() {
        return sts;
    }

    public void setSts(Sts sts) {
        this.sts = sts;
    }

}
 