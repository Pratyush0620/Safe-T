package com.example.nirmandemo;

import com.example.nirmandemo.entities.FactoryData;
import com.example.nirmandemo.entities.Vitals;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttConfig {

    String[] topics = {"SAFET/band1/all_data", "SAFET/band2/all_data", "SAFET/factory/vitals"};


    MessageResolver messageResolver;

    @Autowired
    public MqttConfig(MessageResolver messageResolver) {
        this.messageResolver = messageResolver;
    }

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{"tcp://test.mosquitto.org:1883"});
        factory.setConnectionOptions(options);
        return factory;
    }

    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    public MqttPahoMessageDrivenChannelAdapter inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter("spring-client", mqttClientFactory(), topics);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }



    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler mqttMessageHandler() {
        return message -> {
            // Extract the topic segment; e.g., "factory" from "SAFET/factory/vitals"
            String mqttReceivedTopic = message.getHeaders()
                    .get("mqtt_receivedTopic")
                    .toString()
                    .split("/")[1];
            String payload = message.getPayload().toString();
            ObjectMapper objectMapper = new ObjectMapper();

            try {
                if (mqttReceivedTopic.equals("factory")) {
                    // Parse payload into FactoryData object
                    FactoryData factoryData = objectMapper.readValue(payload, FactoryData.class);
                    factoryData.setTopic(mqttReceivedTopic);
                    System.out.println(factoryData);

                    // Use the parsed data to send via your resolver
                    messageResolver.sendFactoryData(
                            mqttReceivedTopic,
                            factoryData.getTemperature(),
                            factoryData.getHumidity(),
                            factoryData.getAqiScore(),
                            factoryData.getCo2Ppm(),
                            factoryData.getBenzenePpm(),
                            factoryData.getAmmoniaPpm(),
                            factoryData.getAlcoholPpm()
                    );
                } else {
                    // Parse payload into Vitals object; ensure your Vitals class has appropriate annotations
                    Vitals vitals = objectMapper.readValue(payload, Vitals.class);
                    vitals.setTopic(mqttReceivedTopic);
                    System.out.println(vitals);

                    messageResolver.sendVitals(
                            mqttReceivedTopic,
                            vitals.getHeartRate(),
                            vitals.getSpo2(),
                            vitals.getBodyTemp(),
                            vitals.getLedStatus(),
                            vitals.isSos(),
                            vitals.getIsActive()
                    );
                }
            } catch (JsonProcessingException e) {
                System.err.println("Error parsing JSON payload: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }


}
