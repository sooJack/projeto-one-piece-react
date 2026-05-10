import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

function formatBounty(n) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function Cartazes() {
  const { state, actions } = useGame();
  const { isMaster } = useAuth();
  const { toasts, addToast } = useToast();
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState('');

  const handleSave = (charId) => {
    const bounty = Number(value) || 0;
    actions.updateBounty(charId, bounty);
    addToast('Recompensa atualizada', 'success');
    setEditing(null);
  };

  return (
    <div className="page-content" style={{ padding: '6rem 1.5rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1 style={{ marginBottom: '1.2rem' }}>Cartazes de Procurados</h1>
        <p style={{ color: 'var(--white-dim)', marginBottom: '1.75rem' }}>
          Veja as recompensas dos piratas e altere as bounties se você for o mestre.
        </p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {state.characters.map((char) => (
            <div key={char.id} className="card" style={{ padding: '1.25rem', minHeight: 180 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.6rem' }}>{char.avatar}</span>
                <span style={{ color: char.titleColor, fontWeight: 700 }}>{char.titles.join(' • ')}</span>
              </div>
              <h2 style={{ margin: '1rem 0 0.35rem' }}>{char.name}</h2>
              <p style={{ margin: 0, color: 'var(--white-dim)' }}>{char.crew}</p>
              <div style={{ marginTop: '1rem', display: 'grid', gap: '0.65rem' }}>
                {editing === char.id ? (
                  <div style={{ display: 'grid', gap: '0.65rem' }}>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--white)', borderRadius: 10 }}
                    />
                    <button className="btn" style={{ width: '100%' }} onClick={() => handleSave(char.id)}>
                      Salvar
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '0.95rem', color: 'var(--white-dim)' }}>Recompensa</div>
                    <div style={{ fontSize: '1.3rem', color: 'var(--gold)', fontWeight: 700 }}>
                      {formatBounty(char.bounty)} Belly
                    </div>
                    {isMaster && (
                      <button className="btn" onClick={() => { setEditing(char.id); setValue(char.bounty || ''); }}>
                        Editar recompensa
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
