import React, { useState } from 'react'
import './SearchBar.css'

export default function SearchBar({ onSearch, loading, placeholder = 'Ex: PETR4', buttonLabel = 'Buscar' }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          disabled={loading}
          autoFocus
        />
        {value && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setValue('')}
            aria-label="Limpar"
          >×</button>
        )}
      </div>
      <button type="submit" className="search-btn" disabled={loading || !value.trim()}>
        {loading ? <span className="spinner" /> : buttonLabel}
      </button>
    </form>
  )
}
