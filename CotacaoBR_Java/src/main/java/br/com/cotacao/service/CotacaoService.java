package br.com.cotacao.service;

import br.com.cotacao.exception.CotacaoNotFoundException;
import br.com.cotacao.model.BrapiResponse;
import br.com.cotacao.model.StockQuote;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Service responsável por consultar cotações de ações na API da Brapi.
 * Utiliza RestClient (Spring Boot 3.2+) para chamadas HTTP não-bloqueantes e
 * limpas.
 *
 * Token opcional: configure "brapi.token" no application.properties para
 * desbloquear consultas de múltiplos tickers e dados extras.
 */
@Service
public class CotacaoService {

    private static final Logger log = LoggerFactory.getLogger(CotacaoService.class);

    private final RestClient brapiRestClient;

    @Value("${brapi.token}")
    private String brapiToken;

    public CotacaoService(RestClient brapiRestClient) {
        this.brapiRestClient = brapiRestClient;
    }

    /**
     * Busca a cotação de um único ativo pelo ticker (ex: PETR4, VALE3).
     */
    public StockQuote buscarCotacao(String ticker) {
        log.info("Buscando cotação para ticker: {}", ticker);

        BrapiResponse response = brapiRestClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/quote/{ticker}").build(ticker.toUpperCase()))
                .retrieve()
                .body(BrapiResponse.class);

        if (response == null || response.results() == null || response.results().isEmpty()) {
            throw new CotacaoNotFoundException(ticker);
        }

        return response.results().getFirst();
    }

    /**
     * Busca cotações de múltiplos ativos de uma só vez (ex: PETR4,VALE3,ITUB4).
     * Requer token da Brapi — cadastre-se gratuitamente em https://brapi.dev
     */
    public List<StockQuote> buscarMultiplasCotacoes(String tickers) {
        log.info("Buscando cotações para tickers: {}", tickers);

        if (!tokenPresente()) {
            throw new IllegalStateException(
                    "Este endpoint requer um token da Brapi. " +
                            "Cadastre-se gratuitamente em https://brapi.dev e configure " +
                            "'brapi.token=SEU_TOKEN' no arquivo application.properties.");
        }

        String tickersUpper = tickers.toUpperCase();

        try {
            BrapiResponse response = brapiRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/quote/{tickers}")
                            .build(tickersUpper))
                    .retrieve()
                    .body(BrapiResponse.class);

            if (response == null || response.results() == null || response.results().isEmpty()) {
                throw new CotacaoNotFoundException(tickers);
            }

            return response.results();

        } catch (HttpClientErrorException.Unauthorized ex) {
            throw new IllegalStateException(
                    "Token da Brapi inválido ou expirado. Verifique 'brapi.token' no application.properties.");
        }
    }

    /**
     * Lista todos os ativos disponíveis na Brapi (ações, FIIs, ETFs).
     */
    public Object listarAtivos(String search) {
        log.info("Listando ativos disponíveis. Filtro: {}", search);

        return brapiRestClient.get()
                .uri(uriBuilder -> {
                    var b = uriBuilder.path("/api/available");
                    if (search != null && !search.isBlank())
                        b.queryParam("search", search);
                    return b.build();
                })
                .retrieve()
                .body(Object.class);
    }

    private boolean tokenPresente() {
        return brapiToken != null && !brapiToken.isBlank();
    }
}
