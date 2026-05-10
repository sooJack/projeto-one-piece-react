// src/pages/Mapa.jsx
import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const DANGER_COLORS = ['', '#3bdb7a', '#2ecc71', '#27ae60', '#f1c40f', '#f39c12', '#e67e22', '#e74c3c', '#c0392b', '#922b21', '#5a0a0a'];
const SEA_COLORS = { 'East Blue': '#0d2d4a', 'Grand Line': '#0a1f38', 'New World': '#060d1e' };

function IslandMarker({ island, onClick, isVisited }) {
  const [hovered, setHovered] = useState(false);
  const dangerColor = DANGER_COLORS[island.danger] || '#c8a84b';

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(island)}
      style={{ cursor: 'pointer' }}
      transform={`translate(${island.x * 9.5}, ${island.y * 7})`}
    >
      {/* Pulse ring */}
      {isVisited && (
        <circle r="14" fill="none" stroke={dangerColor} strokeWidth="1" opacity="0.3">
          <animate attributeName="r" from="10" to="18" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Island circle */}
      <circle
        r={hovered ? 11 : 9}
        fill={isVisited ? dangerColor + '44' : 'rgba(0,0,0,0.6)'}
        stroke={dangerColor}
        strokeWidth={hovered ? 2 : 1.5}
        style={{ transition: 'all 0.2s' }}
      />

      {/* Emoji */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={hovered ? 10 : 8}
        style={{ transition: 'font-size 0.2s', userSelect: 'none' }}
      >{island.emoji}</text>

      {/* Label */}
      {hovered && (
        <g>
          <rect x="-35" y="-30" width="70" height="16" rx="2" fill="rgba(0,0,0,0.9)" stroke={dangerColor} strokeWidth="0.5" />
          <text x="0" y="-19" textAnchor="middle" fontSize="6" fill={dangerColor} fontFamily="var(--font-ui)">
            {island.name}
          </text>
        </g>
      )}

      {/* Visited checkmark */}
      {isVisited && (
        <text x="7" y="-7" fontSize="6" fill="#2ecc71">✓</text>
      )}
    </g>
  );
}

export default function Mapa() {
  const { state, dispatch } = useGame();
  const { isMaster } = useAuth();
  const { toasts, addToast } = useToast();
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [visitModal, setVisitModal] = useState(null);
  const [addIslandModal, setAddIslandModal] = useState(false);
  const [visitData, setVisitData] = useState({ charId: '', note: '', rating: 5 });
  const [newIsland, setNewIsland] = useState({ name: '', sea: 'Grand Line', x: 50, y: 50, description: '', emoji: '🏝️', danger: 3 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef();
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Count visits per island
  const visitCount = {};
  state.islands.forEach(island => {
    visitCount[island.id] = state.characters.filter(c =>
      c.islandVisits?.some(v => v.islandId === island.id)
    ).length;
  });

  const handleMouseDown = (e) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    setPan(p => ({ x: p.x + e.clientX - lastPos.current.x, y: p.y + e.clientY - lastPos.current.y }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => { dragging.current = false; };

  const handleMarkVisit = () => {
    if (!visitData.charId) { addToast('Selecione um personagem!', 'error'); return; }
    dispatch({ type: 'MARK_ISLAND_VISIT', payload: { charId: parseInt(visitData.charId), islandId: visitModal.id, note: visitData.note, rating: visitData.rating } });
    const char = state.characters.find(c => c.id === parseInt(visitData.charId));
    addToast(`${char.name} marcou ${visitModal.name}!`, 'success');
    setVisitModal(null);
    setVisitData({ charId: '', note: '', rating: 5 });
  };

  const handleAddIsland = () => {
    if (!newIsland.name.trim()) { addToast('Nome obrigatório!', 'error'); return; }
    dispatch({ type: 'ADD_ISLAND', payload: { ...newIsland, x: parseFloat(newIsland.x), y: parseFloat(newIsland.y), danger: parseInt(newIsland.danger) } });
    addToast(`Ilha "${newIsland.name}" adicionada!`, 'success');
    setAddIslandModal(false);
    setNewIsland({ name: '', sea: 'Grand Line', x: 50, y: 50, description: '', emoji: '🏝️', danger: 3 });
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: '4rem' }}>
      <Toast toasts={toasts} />

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.4em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>— Navegação —</div>
          <h1 className="section-title">Mapa-Múndi</h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--white-dim)', maxWidth: 500, margin: '0.5rem auto' }}>
            O mundo de One Piece. Explore, marque ilhas e registre suas aventuras.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 3))} className="btn" style={{ padding: '0.3rem 0.7rem' }}><span>+</span></button>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--white-dim)', minWidth: 50, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="btn" style={{ padding: '0.3rem 0.7rem' }}><span>−</span></button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="btn" style={{ padding: '0.3rem 0.7rem' }}><span>Reset</span></button>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {[['East Blue', '#1a5276'], ['Grand Line', '#1b4f72'], ['New World', '#154360']].map(([sea, col]) => (
              <div key={sea} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ width: 12, height: 12, background: col, border: '1px solid var(--border)', borderRadius: 2 }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--white-dim)', letterSpacing: '0.05em' }}>{sea}</span>
              </div>
            ))}
            {isMaster && (
              <button className="btn" style={{ padding: '0.3rem 0.7rem', fontSize: '0.7rem' }} onClick={() => setAddIslandModal(true)}>
                <span>+ Ilha</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAP */}
      <div style={{
        width: '100%',
        height: '70vh',
        background: '#050d1a',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        cursor: dragging.current ? 'grabbing' : 'grab',
        position: 'relative',
      }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%" height="100%"
          viewBox="0 0 950 700"
          style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: 'center', transition: dragging.current ? 'none' : 'transform 0.1s' }}
        >
          {/* Ocean background */}
          <defs>
            <pattern id="wave" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 Q10 15 20 20 Q30 25 40 20" fill="none" stroke="rgba(100,160,220,0.06)" strokeWidth="1" />
            </pattern>
            <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(26,82,118,0.2)" />
              <stop offset="100%" stopColor="rgba(5,13,26,0)" />
            </radialGradient>
          </defs>

          <rect width="950" height="700" fill="#050d1a" />
          <rect width="950" height="700" fill="url(#wave)" />
          <rect width="950" height="700" fill="url(#center-glow)" />

          {/* Sea zone labels */}
          <text x="120" y="40" fontSize="14" fill="rgba(100,160,220,0.2)" fontFamily="var(--font-title)" letterSpacing="0.2em">EAST BLUE</text>
          <text x="330" y="35" fontSize="14" fill="rgba(100,160,220,0.15)" fontFamily="var(--font-title)" letterSpacing="0.2em">GRAND LINE</text>
          <text x="650" y="35" fontSize="14" fill="rgba(100,160,220,0.12)" fontFamily="var(--font-title)" letterSpacing="0.2em">NEW WORLD</text>

          {/* Red Line (vertical separator) */}
          <line x1="285" y1="0" x2="285" y2="700" stroke="rgba(200,0,0,0.15)" strokeWidth="1.5" strokeDasharray="6,4" />
          <line x1="600" y1="0" x2="600" y2="700" stroke="rgba(200,0,0,0.1)" strokeWidth="1" strokeDasharray="6,4" />

          {/* Calm Belt indicators */}
          <rect x="0" y="300" width="285" height="40" fill="rgba(0,100,0,0.05)" />
          <text x="140" y="325" fontSize="8" fill="rgba(0,200,0,0.15)" textAnchor="middle" fontFamily="var(--font-ui)">CALM BELT</text>

          {/* Grand Line current */}
          <path d="M285 350 Q500 330 950 350" fill="none" stroke="rgba(100,160,220,0.1)" strokeWidth="20" />

          {/* Islands */}
          {state.islands.map(island => {
            const isVisited = state.characters.some(c => c.islandVisits?.some(v => v.islandId === island.id));
            return (
              <IslandMarker
                key={island.id}
                island={island}
                onClick={(isl) => setSelectedIsland(isl)}
                isVisited={isVisited}
              />
            );
          })}

          {/* Compass */}
          <g transform="translate(30, 30)">
            <circle r="20" fill="rgba(0,0,0,0.7)" stroke="rgba(200,168,75,0.4)" strokeWidth="1" />
            <text textAnchor="middle" y="-10" fontSize="10" fill="#c8a84b">N</text>
            <text textAnchor="middle" y="16" fontSize="10" fill="#c8a84b">S</text>
            <text x="12" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#c8a84b">E</text>
            <text x="-12" textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#c8a84b">W</text>
            <line x1="0" y1="-8" x2="0" y2="-16" stroke="#c8a84b" strokeWidth="1.5" />
            <line x1="0" y1="8" x2="0" y2="16" stroke="rgba(200,168,75,0.4)" strokeWidth="1" />
            <line x1="8" y1="0" x2="16" y2="0" stroke="rgba(200,168,75,0.4)" strokeWidth="1" />
            <line x1="-8" y1="0" x2="-16" y2="0" stroke="rgba(200,168,75,0.4)" strokeWidth="1" />
          </g>
        </svg>

        {/* Island count */}
        <div style={{
          position: 'absolute', bottom: '1rem', left: '1rem',
          fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
          color: 'rgba(200,168,75,0.5)', letterSpacing: '0.1em',
        }}>
          {state.islands.length} ILHAS · Clique para ver detalhes
        </div>
      </div>

      {/* Islands list below map */}
      <div className="container" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Ilhas do Mundo
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {state.islands.map((island, i) => {
            const visitors = state.characters.filter(c => c.islandVisits?.some(v => v.islandId === island.id));
            const dangerColor = DANGER_COLORS[island.danger] || '#c8a84b';
            return (
              <div key={island.id} className="card" style={{
                padding: '1.2rem',
                animation: `fadeInUp 0.4s ease ${i * 0.04}s both`,
                cursor: 'pointer',
                borderLeft: `3px solid ${dangerColor}`,
              }}
                onClick={() => setSelectedIsland(island)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{island.emoji}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-title)', color: 'var(--white)', fontSize: '0.95rem' }}>{island.name}</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'var(--white-dim)', letterSpacing: '0.08em' }}>{island.sea}</div>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                    color: dangerColor, border: `1px solid ${dangerColor}`,
                    borderRadius: 2, padding: '0.1rem 0.4rem',
                  }}>⚠{island.danger}</div>
                </div>
                {visitors.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.4rem' }}>
                    {visitors.slice(0, 4).map(c => (
                      <span key={c.id} style={{ fontSize: '0.9rem', title: c.name }}>{c.avatar}</span>
                    ))}
                    {visitors.length > 4 && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: 'var(--white-dim)' }}>+{visitors.length - 4}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Island Detail Modal */}
      {selectedIsland && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelectedIsland(null); }}>
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <button className="modal-close" onClick={() => setSelectedIsland(null)}>✕</button>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '3rem' }}>{selectedIsland.emoji}</span>
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold)', fontSize: '1.5rem', lineHeight: 1.2 }}>{selectedIsland.name}</h2>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'var(--white-dim)', letterSpacing: '0.1em', marginTop: '0.2rem' }}>
                  {selectedIsland.sea} · Perigo: {selectedIsland.danger}/10
                </div>
              </div>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--white-dim)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {selectedIsland.description}
            </p>

            {/* Who visited */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--white-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Visitado por:
              </div>
              {state.characters.map(char => {
                const visit = char.islandVisits?.find(v => v.islandId === selectedIsland.id);
                if (!visit) return null;
                return (
                  <div key={char.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                    padding: '0.6rem', background: 'rgba(200,168,75,0.06)',
                    border: '1px solid var(--border)', borderRadius: 3, marginBottom: '0.4rem',
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{char.avatar}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-title)', color: 'var(--white)', fontSize: '0.9rem' }}>{char.name}</div>
                      {visit.note && <div style={{ fontFamily: 'var(--font-body)', color: 'var(--white-dim)', fontSize: '0.8rem', marginTop: '0.2rem', fontStyle: 'italic' }}>"{visit.note}"</div>}
                      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.3rem' }}>
                        {[...Array(10)].map((_, idx) => (
                          <span key={idx} style={{ fontSize: '0.7rem', color: idx < visit.rating ? '#FFD700' : '#333' }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              {!state.characters.some(c => c.islandVisits?.some(v => v.islandId === selectedIsland.id)) && (
                <div style={{ fontFamily: 'var(--font-body)', color: 'var(--white-dim)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Nenhum personagem visitou ainda.
                </div>
              )}
            </div>

            {/* Mark visit */}
            <button className="btn" onClick={() => { setVisitModal(selectedIsland); setSelectedIsland(null); }}><span>📍 Marcar Visita</span></button>

            {isMaster && (
              <button className="btn btn-danger" style={{ marginLeft: '0.75rem' }} onClick={() => {
                if (window.confirm(`Remover ${selectedIsland.name}?`)) {
                  dispatch({ type: 'DELETE_ISLAND', payload: selectedIsland.id });
                  setSelectedIsland(null);
                  addToast('Ilha removida.', 'default');
                }
              }}><span>🗑️ Remover</span></button>
            )}
          </div>
        </div>
      )}

      {/* Mark Visit Modal */}
      {visitModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setVisitModal(null); }}>
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <button className="modal-close" onClick={() => setVisitModal(null)}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold)', marginBottom: '1.5rem' }}>
              📍 {visitModal.emoji} {visitModal.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label>Personagem *</label>
                <select value={visitData.charId} onChange={e => setVisitData(p => ({ ...p, charId: e.target.value }))}>
                  <option value="">— Selecionar —</option>
                  {state.characters.map(c => <option key={c.id} value={c.id}>{c.avatar} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label>Nota / Anotação</label>
                <textarea rows={2} value={visitData.note} onChange={e => setVisitData(p => ({ ...p, note: e.target.value }))} placeholder="Como foi a aventura aqui?" />
              </div>
              <div>
                <label>Avaliação: {visitData.rating}/10</label>
                <input type="range" min={1} max={10} value={visitData.rating} onChange={e => setVisitData(p => ({ ...p, rating: parseInt(e.target.value) }))}
                  style={{ accentColor: 'var(--gold)', width: '100%' }} />
                <div style={{ display: 'flex', gap: '0.15rem', marginTop: '0.3rem' }}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} style={{ fontSize: '0.9rem', color: i < visitData.rating ? '#FFD700' : '#333' }}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn" onClick={handleMarkVisit}><span>Confirmar</span></button>
              <button className="btn btn-danger" onClick={() => setVisitModal(null)}><span>Cancelar</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Add Island Modal */}
      {addIslandModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setAddIslandModal(false); }}>
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <button className="modal-close" onClick={() => setAddIslandModal(false)}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold)', marginBottom: '1.5rem' }}>+ Nova Ilha</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><label>Nome *</label><input value={newIsland.name} onChange={e => setNewIsland(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label>Descrição</label><textarea rows={2} value={newIsland.description} onChange={e => setNewIsland(p => ({ ...p, description: e.target.value }))} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div><label>Emoji</label><input value={newIsland.emoji} onChange={e => setNewIsland(p => ({ ...p, emoji: e.target.value }))} /></div>
                <div><label>X (0-100)</label><input type="number" value={newIsland.x} onChange={e => setNewIsland(p => ({ ...p, x: e.target.value }))} /></div>
                <div><label>Y (0-100)</label><input type="number" value={newIsland.y} onChange={e => setNewIsland(p => ({ ...p, y: e.target.value }))} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label>Mar</label>
                  <select value={newIsland.sea} onChange={e => setNewIsland(p => ({ ...p, sea: e.target.value }))}>
                    <option>East Blue</option>
                    <option>Grand Line</option>
                    <option>New World</option>
                  </select>
                </div>
                <div><label>Perigo (1-10)</label><input type="number" min={1} max={10} value={newIsland.danger} onChange={e => setNewIsland(p => ({ ...p, danger: e.target.value }))} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn" onClick={handleAddIsland}><span>Criar</span></button>
              <button className="btn btn-danger" onClick={() => setAddIslandModal(false)}><span>Cancelar</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
