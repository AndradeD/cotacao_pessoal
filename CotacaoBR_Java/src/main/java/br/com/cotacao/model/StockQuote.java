package br.com.cotacao.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Representa os dados de cotação de um ativo retornados pela API Brapi.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record StockQuote(

        @JsonProperty("symbol")
        String symbol,

        @JsonProperty("shortName")
        String shortName,

        @JsonProperty("longName")
        String longName,

        @JsonProperty("currency")
        String currency,

        @JsonProperty("regularMarketPrice")
        Double regularMarketPrice,

        @JsonProperty("regularMarketDayHigh")
        Double regularMarketDayHigh,

        @JsonProperty("regularMarketDayLow")
        Double regularMarketDayLow,

        @JsonProperty("regularMarketDayRange")
        String regularMarketDayRange,

        @JsonProperty("regularMarketChange")
        Double regularMarketChange,

        @JsonProperty("regularMarketChangePercent")
        Double regularMarketChangePercent,

        @JsonProperty("regularMarketPreviousClose")
        Double regularMarketPreviousClose,

        @JsonProperty("regularMarketOpen")
        Double regularMarketOpen,

        @JsonProperty("regularMarketVolume")
        Long regularMarketVolume,

        @JsonProperty("marketCap")
        Long marketCap,

        @JsonProperty("fiftyTwoWeekLow")
        Double fiftyTwoWeekLow,

        @JsonProperty("fiftyTwoWeekHigh")
        Double fiftyTwoWeekHigh,

        @JsonProperty("priceEarnings")
        Double priceEarnings,

        @JsonProperty("earningsPerShare")
        Double earningsPerShare,

        @JsonProperty("logourl")
        String logoUrl
) {}
