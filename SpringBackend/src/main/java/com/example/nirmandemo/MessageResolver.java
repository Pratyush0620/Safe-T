package com.example.nirmandemo;


import com.example.nirmandemo.entities.FactoryData;
import com.example.nirmandemo.entities.Vitals;
import com.example.nirmandemo.services.VitalService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

@Controller
public class MessageResolver {

    private final VitalService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageResolver(VitalService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MutationMapping
    public Vitals sendVitals(
            @Argument String topic,
            @Argument Integer heartRate,
            @Argument Integer spo2,
            @Argument Float bodyTemp,
            @Argument Integer ledStatus,
            @Argument Boolean sos,
            @Argument Boolean isActive
    ) {
        Vitals newMessage = Vitals.builder()
                .topic(topic)
                .heartRate(heartRate)
                .spo2(spo2)
                .bodyTemp(bodyTemp)
                .ledStatus(ledStatus)
                .sos(sos)
                .isActive(true)
                .build();
        messageService.addSink(newMessage);
        messagingTemplate.convertAndSend("/topic/" + topic, newMessage);
        return newMessage;
    }

    @MutationMapping
    public FactoryData sendFactoryData(
            @Argument String topic,
            @Argument double temperature,
            @Argument double humidity,
            @Argument Integer aqiScore,
            @Argument double co2Ppm,
            @Argument double benzenePpm,
            @Argument double ammoniaPpm,
            @Argument double alcoholPpm
            ) {
        FactoryData newMessage = FactoryData.builder()
                .topic(topic)
                .temperature(temperature)
                .humidity(humidity)
                .aqiScore(aqiScore)
                .co2Ppm(co2Ppm)
                .benzenePpm(benzenePpm)
                .ammoniaPpm(ammoniaPpm)
                .alcoholPpm(alcoholPpm)
                .build();
        messageService.addFactoryDataSink(newMessage);
        messagingTemplate.convertAndSend("/topic/" + topic, newMessage);
        return newMessage;
    }

    @SubscriptionMapping
    public Flux<Vitals> vitalUpdates(@Argument String topic) {
        return messageService.messageStream(topic);
    }

    @SubscriptionMapping
    public Flux<FactoryData> factoryDataUpdates(@Argument String topic) {
        return messageService.factoryDataStream(topic);
    }

}
