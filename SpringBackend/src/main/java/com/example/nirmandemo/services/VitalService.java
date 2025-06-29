package com.example.nirmandemo.services;

import com.example.nirmandemo.entities.FactoryData;
import com.example.nirmandemo.entities.Vitals;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VitalService {

    private final Map<String, Sinks.Many<Vitals>> topicSinks = new ConcurrentHashMap<>();

    private final Map<String, Long> lastVitalsTimestamp = new ConcurrentHashMap<>();

    private final Map<String, Sinks.Many<FactoryData>> factoryDataSinks = new ConcurrentHashMap<>();

    public void addSink(Vitals vitals) {
        topicSinks
                .computeIfAbsent(vitals.getTopic(), t -> Sinks.many().multicast().directAllOrNothing())
                .tryEmitNext(vitals);
        lastVitalsTimestamp.put(vitals.getTopic(), System.currentTimeMillis());
    }

    public void addFactoryDataSink(FactoryData mess) {
        factoryDataSinks
                .computeIfAbsent(mess.getTopic(), t -> Sinks.many().multicast().directAllOrNothing())
                .tryEmitNext(mess);
    }

    public Flux<Vitals> messageStream(String topic) {
        return topicSinks
                .computeIfAbsent(topic, t -> Sinks.many().multicast().directAllOrNothing())
                .asFlux();
    }

    public Flux<FactoryData> factoryDataStream(String topic) {
        return factoryDataSinks
                .computeIfAbsent(topic, t -> Sinks.many().multicast().directAllOrNothing())
                .asFlux();
    }

    @Scheduled(fixedDelay = 12000)
    public void checkVitalsActivity() {
        long currentTime = System.currentTimeMillis();
        for (String topic : lastVitalsTimestamp.keySet()) {
            long lastUpdate = lastVitalsTimestamp.get(topic);
            if (currentTime - lastUpdate > 10000) {
                Vitals inactiveVitals = Vitals.builder()
                        .topic(topic)
                        .heartRate(0)
                        .spo2(0)
                        .bodyTemp(0f)
                        .ledStatus(-1)
                        .sos(true)
                        .isActive(false)
                        .build();

                Sinks.Many<Vitals> sink = topicSinks.get(topic);
                if (sink != null) {
                    sink.tryEmitNext(inactiveVitals);
                }
                lastVitalsTimestamp.remove(topic);
            }
        }
    }
}
