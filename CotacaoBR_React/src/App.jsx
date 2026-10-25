import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import StockCard from './components/StockCard'
import { buscarCotacao, buscarMultiplasCotacoes, buscarAtivos } from './services/cotacaoService'

const POPULAR_TICKERS = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'WEGE3']

export default function App() {
  const [activeTab, setActiveTab] = useState('single') // 'single' | 'multi' | 'explore'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Single quote state
  const [singleQuote, setSingleQuote] = useState(null)
  const [currentTicker, setCurrentTicker] = useState('PETR4')

  // Multi quote state
  const [multiQuotes, setMultiQuotes] = useState([])
  const [multiInput, setMultiInput] = useState('PETR4,VALE3,ITUB4,WEGE3')

  // Explore state
  const [availableStocks, setAvailableStocks] = useState([])
  const [exploreSearch, setExploreSearch] = useState('')
  const [loadingExplore, setLoadingExplore] = useState(false)

  // Initial load
  useEffect(() => {
    handleSearchSingle('PETR4')
  }, [])

  const handleSearchSingle = async (ticker) => {
    if (!ticker) return
    setLoading(true)
    setError(null)
    try {
      const data = await buscarCotacao(ticker)
      setSingleQuote(data)
      setCurrentTicker(ticker.toUpperCase())
    } catch (err) {
      setError(err.message || 'Erro ao carregar cotação.')
      setSingleQuote(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchMulti = async (tickers) => {
    if (!tickers) return
    setLoading(true)
    setError(null)
    try {
      const data = await buscarMultiplasCotacoes(tickers)
      setMultiQuotes(Array.isArray(data) ? data : [data])
    } catch (err) {
      setError(err.message || 'Erro ao carregar múltiplos ativos.')
      setMultiQuotes([])
    } finally {
      setLoading(false)
    }
  }

  const handleLoadExplore = async (term = '') => {
    setLoadingExplore(true)
    try {
      const data = await buscarAtivos(term)
      const list = data?.stocks || data?.results || (Array.isArray(data) ? data : [])
      setAvailableStocks(list)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingExplore(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'multi' && multiQuotes.length === 0) {
      handleSearchMulti(multiInput)
    } else if (activeTab === 'explore' && availableStocks.length === 0) {
      handleLoadExplore('')
    }
  }, [activeTab])

  return (
    <div className="dashboard-container">
      {/* Background glow effects */}
      <div className="bg-glow bg-glow-blue" />
      <div className="bg-glow bg-glow-emerald" />

      {/* Header */}
      <header className="app-header">
        <div className="brand-group">
          <div className="brand-logo">🇧🇷</div>
          <div>
            <h1 className="brand-title">Cotação<span>BR</span></h1>
            <p className="brand-subtitle">Mercado de Ações da B3 em Tempo Real</p>
          </div>
        </div>

        <div className="header-status">
          <div className="status-badge live">
            <span className="pulsing-dot" />
            Backend Spring Boot :8080
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          🔍 Cotação Individual
        </button>
        <button
          className={`tab-btn ${activeTab === 'multi' ? 'active' : ''}`}
          onClick={() => setActiveTab('multi')}
        >
          📊 Multi-Ativos / Comparador
        </button>
        <button
          className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          📋 Explorar Mercado
        </button>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        {/* SINGLE QUOTE TAB */}
        {activeTab === 'single' && (
          <section className="section-single">
            <div className="search-section">
              <SearchBar
                onSearch={handleSearchSingle}
                loading={loading}
                placeholder="Ex: PETR4, VALE3, ITUB4..."
                buttonLabel="Cotar"
              />

              <div className="quick-tags">
                <span className="quick-label">Mais pesquisadas:</span>
                {POPULAR_TICKERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag-chip ${currentTicker === t ? 'selected' : ''}`}
                    onClick={() => handleSearchSingle(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="state-container">
                <div className="loading-spinner" />
                <p>Consultando dados na B3...</p>
              </div>
            )}

            {error && (
              <div className="error-card">
                <div className="error-icon">⚠️</div>
                <div className="error-info">
                  <h3>Falha ao carregar cotação</h3>
                  <p>{error}</p>
                  <small>Verifique se o backend Spring Boot está ativo e se o ticker é válido.</small>
                </div>
              </div>
            )}

            {!loading && !error && singleQuote && (
              <div className="single-card-wrapper">
                <StockCard quote={singleQuote} />
              </div>
            )}
          </section>
        )}

        {/* MULTI QUOTE TAB */}
        {activeTab === 'multi' && (
          <section className="section-multi">
            <div className="search-section">
              <SearchBar
                onSearch={handleSearchMulti}
                loading={loading}
                placeholder="Ex: PETR4,VALE3,ITUB4,BBDC4 (separados por vírgula)"
                buttonLabel="Consultar Todos"
              />
              <p className="multi-hint">
                Dica: Digite múltiplos tickers separados por vírgula para comparar preços e variações simultaneamente.
              </p>
            </div>

            {loading && (
              <div className="state-container">
                <div className="loading-spinner" />
                <p>Atualizando cotações do lote...</p>
              </div>
            )}

            {error && (
              <div className="error-card">
                <div className="error-icon">⚠️</div>
                <div className="error-info">
                  <h3>Não foi possível carregar a lista</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && multiQuotes.length > 0 && (
              <div className="cards-grid">
                {multiQuotes.map((q) => (
                  <StockCard key={q.symbol} quote={q} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* EXPLORE ASSETS TAB */}
        {activeTab === 'explore' && (
          <section className="section-explore">
            <div className="explore-search-bar">
              <input
                type="text"
                placeholder="Filtrar por nome ou ticker (ex: banco, energia, vale)..."
                value={exploreSearch}
                onChange={(e) => setExploreSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoadExplore(exploreSearch)}
                className="explore-input"
              />
              <button
                type="button"
                className="explore-btn"
                onClick={() => handleLoadExplore(exploreSearch)}
                disabled={loadingExplore}
              >
                {loadingExplore ? 'Buscando...' : 'Filtrar'}
              </button>
            </div>

            {loadingExplore ? (
              <div className="state-container">
                <div className="loading-spinner" />
                <p>Listando ativos disponíveis...</p>
              </div>
            ) : (
              <div className="assets-table-card">
                <table className="assets-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Nome da Empresa</th>
                      <th>Mercado</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableStocks.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-table">
                          Nenhum ativo encontrado para o filtro.
                        </td>
                      </tr>
                    ) : (
                      availableStocks.slice(0, 50).map((stock, idx) => (
                        <tr key={stock.stock || stock.symbol || idx}>
                          <td className="symbol-cell">{stock.stock || stock.symbol}</td>
                          <td className="name-cell">{stock.name || '—'}</td>
                          <td><span className="type-badge">{stock.type || 'Ação B3'}</span></td>
                          <td>
                            <button
                              type="button"
                              className="view-btn"
                              onClick={() => {
                                setActiveTab('single')
                                handleSearchSingle(stock.stock || stock.symbol)
                              }}
                            >
                              Ver Cotação
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>CotaçãoBR • Dados fornecidos via Brapi API integrada com Spring Boot e React Vite</p>
      </footer>
    </div>
  )
}
