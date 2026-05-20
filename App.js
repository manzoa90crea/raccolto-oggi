// App.js — RaccoltoOggi
// Design system integrato. Mock data pronta per Supabase.
// Struttura: home → campo (produttori) | mercato (acquirenti)

import React, { useState } from 'react';
import './App.css';

// ─────────────────────────────────────────────
// MOCK DATA — sostituire con chiamate Supabase
// ─────────────────────────────────────────────

const mockProdottiCampo = [
  {
    id: 1,
    emoji: '🍅',
    nome: 'Pomodori San Marzano',
    quantitaTotale: 50,
    quantitaRimasta: 18,
    prezzo: 3.80,
    stato: 'live',
  },
  {
    id: 2,
    emoji: '🥬',
    nome: 'Friarielli',
    quantitaTotale: 20,
    quantitaRimasta: 0,
    prezzo: 4.20,
    stato: 'esaurito',
  },
  {
    id: 3,
    emoji: '🍆',
    nome: 'Melanzane Violette',
    quantitaTotale: 30,
    quantitaRimasta: 27,
    prezzo: 2.50,
    stato: 'live',
  },
];

const mockProdottiMercato = [
  {
    id: 1,
    emoji: '🍅',
    nome: 'Pomodori San Marzano',
    produttore: 'Azienda Esposito',
    zona: 'Acerra',
    km: 8,
    quantita: 18,
    prezzo: 3.80,
    urgenza: false,
    badge: 'fresco',
    badgeLabel: 'Raccolto stamattina',
  },
  {
    id: 2,
    emoji: '🍋',
    nome: 'Limoni Sfusato',
    produttore: 'Masseria De Luca',
    zona: 'Sorrento',
    km: 22,
    quantita: 5,
    prezzo: 2.50,
    urgenza: true,
    badge: 'urgenza',
    badgeLabel: 'Ultimi 5 kg!',
  },
  {
    id: 3,
    emoji: '🥬',
    nome: 'Friarielli',
    produttore: 'Az. Agr. Romano',
    zona: 'Giugliano',
    km: 14,
    quantita: 12,
    prezzo: 4.20,
    urgenza: false,
    badge: 'fresco',
    badgeLabel: 'Raccolto stamattina',
  },
  {
    id: 4,
    emoji: '🍆',
    nome: 'Melanzane Violette',
    produttore: 'Fam. Ferrara',
    zona: 'Nola',
    km: 18,
    quantita: 27,
    prezzo: 2.50,
    urgenza: false,
    badge: 'fresco',
    badgeLabel: 'Disponibile oggi',
  },
];

const filtriMercato = ['Tutti', 'Verdura', 'Frutta', 'Legumi', '< 10 km'];

// ─────────────────────────────────────────────
// COMPONENTI RIUTILIZZABILI
// ─────────────────────────────────────────────

function Badge({ tipo, label }) {
  return (
    <span className={`badge badge-${tipo}`}>
      {tipo !== 'esaurito' && <span className="badge-dot" />}
      {label}
    </span>
  );
}

function StockBar({ rimasta, totale }) {
  const pct = totale > 0 ? Math.round((rimasta / totale) * 100) : 0;
  return (
    <div className="stock-bar">
      <div className="stock-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// VISTA HOME — Selezione profilo
// ─────────────────────────────────────────────

function HomeView({ onSelect }) {
  return (
    <div className="app-container">
      <div className="home-hero">
        <span className="home-logo">🌱</span>
        <h1 className="home-title">RaccoltoOggi</h1>
        <p className="home-tagline">Raccolto stamattina. Sul tuo tavolo stasera.</p>
      </div>

      <div className="home-cards">
        <p style={{ fontSize: 13, color: '#9E9D98', textAlign: 'center', margin: '0 0 6px' }}>
          Seleziona il tuo profilo
        </p>

        <button className="profile-card campo" onClick={() => onSelect('campo')}>
          <div className="profile-card-icon">🌿</div>
          <div>
            <p className="profile-card-label">Sono un Produttore</p>
            <p className="profile-card-desc">Gestisci il raccolto di oggi</p>
          </div>
          <span className="profile-card-arrow">›</span>
        </button>

        <button className="profile-card mercato" onClick={() => onSelect('mercato')}>
          <div className="profile-card-icon">🍽️</div>
          <div>
            <p className="profile-card-label">Sono un Ristoratore</p>
            <p className="profile-card-desc">Acquista fresco in tempo reale</p>
          </div>
          <span className="profile-card-arrow">›</span>
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VISTA CAMPO — Produttori
// ─────────────────────────────────────────────

function CampoView({ onBack }) {
  const [prodotti, setProdotti] = useState(mockProdottiCampo);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', emoji: '🌾', quantita: '', prezzo: '' });

  function handleAggiungi() {
    if (!form.nome || !form.quantita || !form.prezzo) return;
    const nuovo = {
      id: Date.now(),
      emoji: form.emoji,
      nome: form.nome,
      quantitaTotale: Number(form.quantita),
      quantitaRimasta: Number(form.quantita),
      prezzo: Number(form.prezzo),
      stato: 'live',
    };
    setProdotti(prev => [nuovo, ...prev]);
    setForm({ nome: '', emoji: '🌾', quantita: '', prezzo: '' });
    setShowForm(false);
    // TODO: await supabase.from('products').insert(nuovo)
  }

  const liveTotale = prodotti.filter(p => p.stato === 'live').reduce((s, p) => s + p.quantitaRimasta, 0);

  return (
    <div className="app-container theme-campo">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-icon">🌿</div>
        <div>
          <p className="app-header-title">Campo</p>
          <p className="app-header-sub">I tuoi prodotti di oggi</p>
        </div>
        <button className="app-header-back" onClick={onBack}>← Esci</button>
      </div>

      <div className="app-content">
        {/* Notifica mock ordine ricevuto */}
        <div className="notifica-ordine">
          <span className="notifica-ordine-icon">🔔</span>
          <div>
            <p className="notifica-ordine-text">Venduto! 20 kg di Pomodori</p>
            <p className="notifica-ordine-sub">Ristorante Zi' Teresa · Rimangono 18 kg</p>
          </div>
        </div>

        {/* Stats rapide */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div className="card card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', margin: '0 0 2px' }}>{liveTotale} kg</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>disponibili ora</p>
          </div>
          <div className="card card-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', margin: '0 0 2px' }}>
              {prodotti.filter(p => p.stato === 'live').length}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>prodotti live</p>
          </div>
        </div>

        {/* Form caricamento prodotto */}
        {showForm ? (
          <div className="card card-body" style={{ marginBottom: 16 }}>
            <p className="section-title">Nuovo prodotto</p>
            <div className="form-group">
              <label className="form-label">Nome prodotto</label>
              <input
                className="form-input"
                placeholder="es. Pomodori San Marzano"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantità (kg)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="50"
                  value={form.quantita}
                  onChange={e => setForm(f => ({ ...f, quantita: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Prezzo (€/kg)</label>
                <input
                  className="form-input"
                  type="number"
                  step="0.10"
                  placeholder="3.80"
                  value={form.prezzo}
                  onChange={e => setForm(f => ({ ...f, prezzo: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={handleAggiungi}>
                Pubblica sul mercato →
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: 'auto', padding: '14px 16px' }}
                onClick={() => setShowForm(false)}
              >
                Annulla
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            style={{ marginBottom: 16 }}
            onClick={() => setShowForm(true)}
          >
            + Aggiungi prodotto di oggi
          </button>
        )}

        {/* Lista prodotti */}
        <div className="card card-body">
          <p className="section-title">Caricati oggi</p>
          {prodotti.map(p => (
            <div key={p.id} className="campo-product-row">
              <span className="campo-product-emoji">{p.emoji}</span>
              <div className="campo-product-info">
                <p className="campo-product-name">{p.nome}</p>
                <p className="campo-product-meta">€ {p.prezzo.toFixed(2)} / kg</p>
                <StockBar rimasta={p.quantitaRimasta} totale={p.quantitaTotale} />
              </div>
              <div className="campo-product-right">
                <p className="campo-product-kg">{p.quantitaRimasta} kg</p>
                <p className="campo-product-sub">rimasti</p>
                <Badge
                  tipo={p.stato}
                  label={p.stato === 'live' ? 'Live' : 'Finito'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VISTA MERCATO — Acquirenti / Ristoratori
// ─────────────────────────────────────────────

function MercatoView({ onBack }) {
  const [filtroAttivo, setFiltroAttivo] = useState('Tutti');
  const [carrello, setCarrello] = useState([]);

  function aggiungiAlCarrello(prodotto) {
    setCarrello(prev => {
      const esiste = prev.find(i => i.id === prodotto.id);
      if (esiste) return prev;
      return [...prev, { ...prodotto, qta: 1 }];
      // TODO: await supabase.from('orders').insert(...)
    });
  }

  const totCarrello = carrello.length;

  return (
    <div className="app-container theme-mercato">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-icon">🍽️</div>
        <div>
          <p className="app-header-title">Mercato</p>
          <p className="app-header-sub">Prodotti locali disponibili ora</p>
        </div>
        {totCarrello > 0 && (
          <button className="app-header-back" style={{ marginLeft: 'auto' }}>
            🛒 {totCarrello}
          </button>
        )}
        <button className="app-header-back" onClick={onBack} style={{ marginLeft: totCarrello > 0 ? 8 : 'auto' }}>
          ← Esci
        </button>
      </div>

      <div className="app-content">
        {/* Feed header con live indicator */}
        <div className="feed-header">
          <p className="page-title" style={{ margin: 0 }}>Disponibile ora</p>
          <div className="feed-live-pill">
            <span className="live-dot" />
            {mockProdottiMercato.length} prodotti
          </div>
        </div>

        {/* Filtri rapidi */}
        <div className="filtri-scroll">
          {filtriMercato.map(f => (
            <button
              key={f}
              className={`filtro-pill ${filtroAttivo === f ? 'active' : ''}`}
              onClick={() => setFiltroAttivo(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Feed prodotti */}
        {mockProdottiMercato.map(p => {
          const nelCarrello = carrello.find(i => i.id === p.id);
          return (
            <div key={p.id} className="mercato-card">
              <span className="mercato-card-emoji">{p.emoji}</span>
              <div className="mercato-card-info">
                <p className="mercato-card-name">{p.nome}</p>
                <p className="mercato-card-producer">
                  {p.produttore} · {p.zona} · {p.km} km
                </p>
                <Badge tipo={p.badge} label={p.badgeLabel} />
              </div>
              <div className="mercato-card-right">
                <p className="mercato-card-price">€ {p.prezzo.toFixed(2)}</p>
                <p className="mercato-card-unit">/kg · {p.quantita} kg disp.</p>
                <button
                  className={`btn btn-primary btn-sm ${nelCarrello ? 'btn-secondary' : ''}`}
                  onClick={() => aggiungiAlCarrello(p)}
                  style={nelCarrello ? { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1.5px solid var(--accent)' } : {}}
                >
                  {nelCarrello ? '✓ Aggiunto' : 'Ordina'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state (per quando i filtri non matchano) */}
        {mockProdottiMercato.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-emoji">🌅</span>
            <p className="empty-state-text">Nessun prodotto disponibile</p>
            <p className="empty-state-sub">I produttori caricano dalle 6:00 alle 9:00</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROOT — Router minimale
// ─────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState('home');

  if (view === 'campo')   return <CampoView   onBack={() => setView('home')} />;
  if (view === 'mercato') return <MercatoView  onBack={() => setView('home')} />;

  return <HomeView onSelect={setView} />;
}
