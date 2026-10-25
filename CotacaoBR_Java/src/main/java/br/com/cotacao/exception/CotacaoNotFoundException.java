package br.com.cotacao.exception;

/**
 * Exceção lançada quando um ticker não é encontrado ou a API retorna resultado vazio.
 */
public class CotacaoNotFoundException extends RuntimeException {

    public CotacaoNotFoundException(String ticker) {
        super("Cotação não encontrada para o ticker: " + ticker);
    }
}
