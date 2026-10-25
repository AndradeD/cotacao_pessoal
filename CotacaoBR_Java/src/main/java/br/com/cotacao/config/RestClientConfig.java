package br.com.cotacao.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * Configuração do RestClient usado para consumir a API da Brapi.
 * RestClient é a alternativa moderna ao RestTemplate (Spring Boot 3.2+).
 */
@Configuration
public class RestClientConfig {

    @Value("${brapi.base-url}")
    private String brapiBaseUrl;

    @Value("${brapi.token}")
    private String brapiToken;

    @Bean
    public RestClient brapiRestClient() {
        var builder = RestClient.builder()
                .baseUrl(brapiBaseUrl)
                .defaultHeader("Accept", "application/json");

        if (brapiToken != null && !brapiToken.isBlank()) {
            builder.defaultHeader("Authorization", "Bearer " + brapiToken);
            System.out.println("✅ RestClient configurado com Token da Brapi.");
        } else {
            System.out.println("⚠️  RestClient configurado sem Token (padrão gratuito da Brapi).");
        }

        return builder.build();
    }
}
