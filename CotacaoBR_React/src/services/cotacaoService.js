/**
 * cotacaoService.js
 * Camada de serviço que centraliza todas as chamadas à API CotacaoBR (Spring Boot).
 * O Vite proxy redireciona /api/* → http://localhost:8080
 */

const BASE_URL = '/api/cotacao'

/**
 * Busca a cotação de um único ativo pelo ticker.
 * @param {string} ticker - Ex: PETR4, VALE3
 * @returns {Promise<Object>} StockQuote
 */
export async function buscarCotacao(ticker) {
  const response = await fetch(`${BASE_URL}/${ticker.toUpperCase().trim()}`)
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Ticker "${ticker}" não encontrado.`)
  }
  return response.json()
}

/**
 * Busca cotações de múltiplos ativos separados por vírgula.
 * Requer token Brapi configurado no backend.
 * @param {string} tickers - Ex: "PETR4,VALE3,ITUB4"
 * @returns {Promise<Array>} Lista de StockQuote
 */
export async function buscarMultiplasCotacoes(tickers) {
  const params = new URLSearchParams({ tickers: tickers.toUpperCase().trim() })
  const response = await fetch(`${BASE_URL}/multiplos?${params}`)
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Erro ao buscar múltiplos tickers.')
  }
  return response.json()
}

/**
 * Lista ativos disponíveis na Brapi com filtro opcional.
 * @param {string} search - Filtro de busca (opcional)
 * @returns {Promise<Object>} Lista de ativos disponíveis
 */
export async function buscarAtivos(search = '') {
  const params = search ? new URLSearchParams({ search }) : ''
  const response = await fetch(`${BASE_URL}/ativos${params ? '?' + params : ''}`)
  if (!response.ok) {
    throw new Error('Erro ao listar ativos disponíveis.')
  }
  return response.json()
}
