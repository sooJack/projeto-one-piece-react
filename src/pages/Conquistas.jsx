import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const CATEGORIES = ['todas', 'exploração', 'combate', 'história', 'social', 'mistério'];

export default function Conquistas() {
  const { state, actions } = useGame();
  const { isMaster } = useAuth();
  const { toasts, addToast } = useToast();
  const [filter, setFilter] = useState('todas');
  const [newAch, setNewAch] = useState({
    name: '', description: '', xpReward: 100, titleReward: '', icon: '🎯', category: 'história',
  });

  const filtered = useMemo(() => {
    return state.achievements.filter((a) => a.active && (filter === 'todas' || a.category === filter));
  }, [state.achievements, filter]);

  const handleAddAch = () => {
    if (!newAch.name.trim()) {
      addToast('Digite um nome para a conquista', 'error');
      return;
    }
    actions.addAchievement(newAch);
    addToast('Conquista adicionada', 'success');
    setNewAch({ name: '', description: '', xpReward: 100, titleReward: '', icon: '🎯', category: 'história' });
  };

  const handleToggle = (achId, charId) => {
    actions.toggleAchievementCompletion(achId, charId);
    addToast('Status de conquista atualizado', 'success');
  };

  const handleDelete = (achId) => {
    actions.deleteAchievement(achId);
    addToast('Conquista removida', 'success');
  };

  return (
    <div className="page-content" style={{ padding: '6rem 1.5rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Conquistas</h1>
            <p style={{ color: 'var(--white-dim)' }}>Missões e recompensas que seus personagens podem completar.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} className="btn" style={{ background: filter === cat ? 'var(--gold)' : 'rgba(255,255,255,0.05)' }} onClick={() => setFilter(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          {filtered.map((ach) => (
            <div key={ach.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.4rem' }}>{ach.icon} {ach.name}</h3>
                  <p style={{ margin: 0, color: 'var(--white-dim)' }}>{ach.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--gold)' }}>{ach.xpReward} XP</div>
                  {ach.titleReward && <div style={{ color: 'var(--white-dim)' }}>Título: {ach.titleReward}</div>}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                {state.characters.map((char) => {
                  const completed = ach.completedBy.includes(char.id);
                  return (
                    <div key={char.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <div>
                        <strong>{char.name}</strong>
                        <div style={{ color: 'var(--white-dim)', fontSize: '0.86rem' }}>{char.crew}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button className="btn" style={{ background: completed ? 'var(--gold)' : 'rgba(255,255,255,0.05)' }} onClick={() => handleToggle(ach.id, char.id)}>
                          {completed ? 'Remover' : 'Concluir'}
                        </button>
                        {isMaster && (
                          <button className="btn btn-danger" onClick={() => handleDelete(ach.id)}>
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMaster && (
        <div className="card" style={{ marginTop: '1.5rem', padding: '1.75rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Adicionar nova conquista</h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <input value={newAch.name} onChange={(e) => setNewAch((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nome da conquista" />
            <input value={newAch.icon} onChange={(e) => setNewAch((prev) => ({ ...prev, icon: e.target.value }))} placeholder="Ícone" />
            <input value={newAch.category} onChange={(e) => setNewAch((prev) => ({ ...prev, category: e.target.value }))} placeholder="Categoria" />
            <input type="number" value={newAch.xpReward} onChange={(e) => setNewAch((prev) => ({ ...prev, xpReward: Number(e.target.value) }))} placeholder="XP" />
          </div>
          <textarea value={newAch.description} onChange={(e) => setNewAch((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descrição" rows="3" style={{ width: '100%', minHeight: 96, padding: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'var(--white)' }} />
          <button className="btn" onClick={handleAddAch} style={{ marginTop: '1rem' }}>Criar conquista</button>
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
