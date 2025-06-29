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
public class FactoryData {
    private String topic;
    @JsonProperty("Temperature")
    private double temperature;

    @JsonProperty("Humidity")
    private double humidity;

    @JsonProperty("AQI_Score")
    private Integer aqiScore;

    @JsonProperty("CO2_PPM")
    private double co2Ppm;

    @JsonProperty("Benzene_PPM")
    private double benzenePpm;

    @JsonProperty("Ammonia_PPM")
    private double ammoniaPpm;

    @JsonProperty("Alcohol_PPM")
    private double alcoholPpm;





}
