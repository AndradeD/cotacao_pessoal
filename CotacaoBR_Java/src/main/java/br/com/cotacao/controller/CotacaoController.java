package br.com.cotacao.controller;

import br.com.cotacao.model.StockQuote;
import br.com.cotacao.service.CotacaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST que expõe endpoints para consulta de cotações da B3.
 *
 * Endpoints disponíveis:
 *   GET /api/cotacao/{ticker}              → Cotação de um ativo
 *   GET /api/cotacao/multiplos?tickers=    → Cotação de múltiplos ativos
 *   GET /api/cotacao/ativos?search=        → Lista todos os ativos disponíveis
 */
@RestController
@RequestMapping("/api/cotacao")
public class CotacaoController {

    private final CotacaoService cotacaoService;

    public CotacaoController(CotacaoService cotacaoService) {
        this.cotacaoService = cotacaoService;
    }

    /**
     * Retorna a cotação de um único ativo pelo ticker.
     *
     * Exemplo: GET /api/cotacao/PETR4
     */
    @GetMapping("/{ticker}")
    public ResponseEntity<StockQuote> getCotacao(@PathVariable String ticker) {
        StockQuote quote = cotacaoService.buscarCotacao(ticker);
        return ResponseEntity.ok(quote);
    }

    /**
     * Retorna cotações de múltiplos ativos separados por vírgula.
     *
     * Exemplo: GET /api/cotacao/multiplos?tickers=PETR4,VALE3,ITUB4
     */
    @GetMapping("/multiplos")
    public ResponseEntity<List<StockQuote>> getMultiplasCotacoes(
            @RequestParam String tickers) {
        List<StockQuote> quotes = cotacaoService.buscarMultiplasCotacoes(tickers);
        return ResponseEntity.ok(quotes);
    }

    /**
     * Lista todos os ativos disponíveis na Brapi, com filtro opcional.
     *
     * Exemplo: GET /api/cotacao/ativos
     * Exemplo: GET /api/cotacao/ativos?search=petro
     */
    @GetMapping("/ativos")
    public ResponseEntity<Object> getAtivosDisponiveis(
            @RequestParam(required = false) String search) {
        Object ativos = cotacaoService.listarAtivos(search);
        return ResponseEntity.ok(ativos);
    }
}
