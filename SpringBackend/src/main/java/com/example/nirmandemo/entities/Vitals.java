package com.example.nirmandemo.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vitals {
    @JsonProperty("heart_rate")
    private int heartRate;

    private int spo2;

    private Float bodyTemp;

    @JsonProperty("led_status")
    private Integer ledStatus;

    private boolean sos;

    private String topic;

    private Boolean isActive;
}
