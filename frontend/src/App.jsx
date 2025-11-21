import React, {useEffect, useState} from 'react'

export default function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/hello')
      .then(res => {
        if (!res.ok) throw new Error('network')
        return res.json()
      })
      .then(data => setMessage(data.message))
      .catch(() => {
        // On GitHub Pages there is no backend — show a friendly static message
        setMessage('Hello — this is the static frontend (backend unavailable on GitHub Pages).')
      })
  }, [])

  return (
    <div className="app">
      <header className="hero">
        <h1>LondonJamesD</h1>
        <p className="tag">Portfolio & Documentation Center</p>
        <div className="box">{message || 'Loading...'}</div>
      </header>
    </div>
  )
}
