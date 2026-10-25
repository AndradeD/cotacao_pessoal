package br.com.cotacao.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Wrapper que representa a resposta completa da API Brapi para cotações.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record BrapiResponse(

        @JsonProperty("results")
        List<StockQuote> results,

        @JsonProperty("requestedAt")
        String requestedAt,

        @JsonProperty("took")
        String took
) {}
