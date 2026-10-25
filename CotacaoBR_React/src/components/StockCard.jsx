import React from 'react'
import './StockCard.css'

const formatCurrency = (value) =>
  value != null
    ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—'

const formatNumber = (value) =>
  value != null ? value.toLocaleString('pt-BR') : '—'

const formatPercent = (value) =>
  value != null ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%` : '—'

const formatMarketCap = (value) => {
  if (value == null) return '—'
  if (value >= 1e12) return `R$ ${(value / 1e12).toFixed(2)} T`
  if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)} B`
  if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)} M`
  return formatCurrency(value)
}

export default function StockCard({ quote }) {
  const isPositive = quote.regularMarketChange >= 0

  return (
    <div className={`stock-card ${isPositive ? 'positive' : 'negative'}`}>
      {/* Header */}
      <div className="card-header">
        <div className="card-identity">
          {quote.logourl && (
            <img
              src={quote.logourl}
              alt={quote.symbol}
              className="stock-logo"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
          <div>
            <h2 className="stock-symbol">{quote.symbol}</h2>
            <p className="stock-name">{quote.shortName || quote.longName || '—'}</p>
          </div>
        </div>
        <div className="card-price-block">
          <span className="stock-price">{formatCurrency(quote.regularMarketPrice)}</span>
          <span className={`stock-change ${isPositive ? 'up' : 'down'}`}>
            {isPositive ? '▲' : '▼'} {formatCurrency(Math.abs(quote.regularMarketChange))} ({formatPercent(quote.regularMarketChangePercent)})
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="card-divider" />

      {/* Grid de dados */}
      <div className="card-grid">
        <DataItem label="Abertura" value={formatCurrency(quote.regularMarketOpen)} />
        <DataItem label="Fechamento Ant." value={formatCurrency(quote.regularMarketPreviousClose)} />
        <DataItem label="Máxima do Dia" value={formatCurrency(quote.regularMarketDayHigh)} />
        <DataItem label="Mínima do Dia" value={formatCurrency(quote.regularMarketDayLow)} />
        <DataItem label="Volume" value={formatNumber(quote.regularMarketVolume)} />
        <DataItem label="Market Cap" value={formatMarketCap(quote.marketCap)} />
        <DataItem label="Mín. 52 Semanas" value={formatCurrency(quote.fiftyTwoWeekLow)} />
        <DataItem label="Máx. 52 Semanas" value={formatCurrency(quote.fiftyTwoWeekHigh)} />
        <DataItem label="P/L" value={quote.priceEarnings?.toFixed(2) ?? '—'} />
        <DataItem label="LPA" value={quote.earningsPerShare?.toFixed(2) ?? '—'} />
      </div>

      <div className="card-currency">Moeda: {quote.currency ?? 'BRL'}</div>
    </div>
  )
}

function DataItem({ label, value }) {
  return (
    <div className="data-item">
      <span className="data-label">{label}</span>
      <span className="data-value">{value}</span>
    </div>
  )
}
