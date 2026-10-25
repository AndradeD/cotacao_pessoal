package br.com.cotacao.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;

/**
 * Handler global de exceções que retorna respostas padronizadas (RFC 7807 - Problem Details).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CotacaoNotFoundException.class)
    public ProblemDetail handleCotacaoNotFound(CotacaoNotFoundException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        pd.setTitle("Cotação não encontrada");
        pd.setType(URI.create("https://cotacaobr.com/erros/cotacao-nao-encontrada"));
        pd.setProperty("timestamp", Instant.now().toString());
        return pd;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno ao processar a requisição.");
        pd.setTitle("Erro interno");
        pd.setType(URI.create("https://cotacaobr.com/erros/erro-interno"));
        pd.setProperty("timestamp", Instant.now().toString());
        pd.setProperty("detalhe", ex.getMessage());
        return pd;
    }
}
