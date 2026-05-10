import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

function getXPForCurrentLevel(level) {
  return (level - 1) * 500;
}

function getXPForNextLevel(level) {
  return level * 500;
}

function XPBar({ xp, level }) {
  const curr = getXPForCurrentLevel(level);
  const next = getXPForNextLevel(level);
  const pct = Math.min(100, ((xp - curr) / Math.max(1, next - curr)) * 100);
  return (
    <div style={{ marginTop: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.75rem', color: 'var(--white-dim)' }}>
        <span>{xp.toLocaleString()} XP</span>
        <span>→ {next.toLocaleString()}</span>
      </div>
      <div className="xp-bar-wrap">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Ranking() {
  const { state, actions } = useGame();
  const { isMaster } = useAuth();
  const { toasts, addToast } = useToast();
  const [addXPModal, setAddXPModal] = useState(null);
  const [xpAmount, setXpAmount] = useState('');
  const [addCharModal, setAddCharModal] = useState(false);
  const [newChar, setNewChar] = useState({ name: '', player: '', crew: '', bounty: 0, avatar: '🏴‍☠️', notes: '' });

  const sorted = [...state.characters].sort((a, b) => b.xp - a.xp || b.level - a.level);

  const handleAddXP = () => {
    const amount = Number(xpAmount);
    if (!addXPModal || !amount) {
      addToast('Selecione um personagem e uma quantidade válida', 'error');
      return;
    }
    actions.addXP(addXPModal, amount);
    addToast('XP adicionado', 'success');
    setAddXPModal(null);
    setXpAmount('');
  };

  const handleAddChar = () => {
    if (!newChar.name.trim()) {
      addToast('Informe o nome do personagem', 'error');
      return;
    }
    actions.addCharacter(newChar);
    addToast('Personagem criado', 'success');
    setAddCharModal(false);
    setNewChar({ name: '', player: '', crew: '', bounty: 0, avatar: '🏴‍☠️', notes: '' });
  };

  const handleDeleteChar = (charId) => {
    actions.deleteCharacter(charId);
    addToast('Personagem removido', 'success');
  };

  return (
    <div className="page-content" style={{ padding: '6rem 1.5rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Ranking</h1>
            <p style={{ color: 'var(--white-dim)' }}>Acompanhe os piratas mais experientes e distribua XP quando o mestre estiver online.</p>
          </div>
          {isMaster && (
            <button className="btn" onClick={() => setAddCharModal(!addCharModal)}>
              {addCharModal ? 'Cancelar' : 'Adicionar Personagem'}
            </button>
          )}
        </div>

        {addCharModal && (
          <div className="card" style={{ marginTop: '1rem', padding: '1.5rem' }}>
            <h2>Novo personagem</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <input value={newChar.name} onChange={(e) => setNewChar((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nome" />
              <input value={newChar.player} onChange={(e) => setNewChar((prev) => ({ ...prev, player: e.target.value }))} placeholder="Jogador" />
              <input value={newChar.crew} onChange={(e) => setNewChar((prev) => ({ ...prev, crew: e.target.value }))} placeholder="Tripulação" />
              <input type="number" value={newChar.bounty} onChange={(e) => setNewChar((prev) => ({ ...prev, bounty: Number(e.target.value) }))} placeholder="Recompensa" />
            </div>
            <textarea value={newChar.notes} onChange={(e) => setNewChar((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notas" rows="3" style={{ width: '100%', minHeight: 96, padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'var(--white)' }} />
            <button className="btn" onClick={handleAddChar} style={{ marginTop: '1rem' }}>Criar</button>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          {sorted.map((char, index) => (
            <div key={char.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <p style={{ margin: 0, color: 'var(--white-dim)' }}>#{index + 1}</p>
                  <h2 style={{ margin: '0.25rem 0' }}>{char.name}</h2>
                  <p style={{ margin: 0, color: 'var(--white-dim)' }}>{char.crew} • {char.player}</p>
                  <div style={{ marginTop: '0.75rem' }}>
                    <XPBar xp={char.xp} level={char.level} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--gold)', fontSize: '1.1rem', fontWeight: 700 }}>{char.bounty.toLocaleString()} Belly</div>
                  <div style={{ color: 'var(--white-dim)' }}>Nível {char.level}</div>
                </div>
              </div>
              {isMaster && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn" onClick={() => setAddXPModal(char.id)}>Adicionar XP</button>
                  <button className="btn btn-danger" onClick={() => handleDeleteChar(char.id)}>Excluir</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {addXPModal && (
          <div className="card" style={{ marginTop: '1rem', padding: '1.5rem' }}>
            <h2>Adicionar XP</h2>
            <p style={{ color: 'var(--white-dim)' }}>Insira a quantidade de XP para o personagem selecionado.</p>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: 360 }}>
              <input type="number" value={xpAmount} onChange={(e) => setXpAmount(e.target.value)} placeholder="Quantidade de XP" />
              <button className="btn" onClick={handleAddXP}>Confirmar</button>
            </div>
          </div>
        )}
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
