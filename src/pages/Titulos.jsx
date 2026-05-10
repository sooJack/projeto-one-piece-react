import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function Titulos() {
  const { state, actions } = useGame();
  const { isMaster } = useAuth();
  const { toasts, addToast } = useToast();
  const [addModal, setAddModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const [newTitle, setNewTitle] = useState({ name: '', icon: '🌟', color: '#c8a84b', description: '' });

  const handleAddTitle = () => {
    if (!newTitle.name.trim()) {
      addToast('Informe o nome do título', 'error');
      return;
    }
    actions.addTitle(newTitle);
    addToast('Título criado', 'success');
    setNewTitle({ name: '', icon: '🌟', color: '#c8a84b', description: '' });
    setAddModal(false);
  };

  const handleDeleteTitle = (id) => {
    actions.deleteTitle(id);
    addToast('Título removido', 'success');
  };

  const handleAssign = (titleName, charId) => {
    actions.assignTitle(titleName, charId);
    addToast('Título atribuído', 'success');
    setAssignModal(null);
  };

  const handleRemoveFromChar = (titleName, charId) => {
    actions.removeTitleFromChar(titleName, charId);
    addToast('Título removido do personagem', 'success');
  };

  return (
    <div className="page-content" style={{ padding: '6rem 1.5rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Títulos</h1>
            <p style={{ color: 'var(--white-dim)' }}>Veja, crie e atribua títulos exclusivos aos personagens.</p>
          </div>
          {isMaster && (
            <button className="btn" onClick={() => setAddModal(!addModal)}>{addModal ? 'Cancelar' : 'Novo título'}</button>
          )}
        </div>

        {addModal && (
          <div className="card" style={{ marginTop: '1rem', padding: '1.5rem' }}>
            <h2>Adicionar título</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <input value={newTitle.name} onChange={(e) => setNewTitle((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nome" />
              <input value={newTitle.icon} onChange={(e) => setNewTitle((prev) => ({ ...prev, icon: e.target.value }))} placeholder="Ícone" />
              <input type="color" value={newTitle.color} onChange={(e) => setNewTitle((prev) => ({ ...prev, color: e.target.value }))} />
              <input value={newTitle.description} onChange={(e) => setNewTitle((prev) => ({ ...prev, description: e.target.value }))} placeholder="Descrição" />
            </div>
            <button className="btn" onClick={handleAddTitle} style={{ marginTop: '1rem' }}>Criar título</button>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          {state.titles.map((title) => (
            <div key={title.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.35rem' }}><span style={{ marginRight: '0.65rem' }}>{title.icon}</span>{title.name}</h3>
                  <p style={{ margin: 0, color: 'var(--white-dim)' }}>{title.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isMaster && (
                    <button className="btn btn-danger" onClick={() => handleDeleteTitle(title.id)}>Excluir</button>
                  )}
                  <button className="btn" onClick={() => setAssignModal(assignModal === title.id ? null : title.id)}>
                    {assignModal === title.id ? 'Fechar' : 'Atribuir'}
                  </button>
                </div>
              </div>
              {assignModal === title.id && (
                <div style={{ marginTop: '1rem', display: 'grid', gap: '0.8rem' }}>
                  {state.characters.map((char) => (
                    <div key={char.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{char.name}</strong>
                        <div style={{ color: 'var(--white-dim)', fontSize: '0.85rem' }}>{char.crew}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button className="btn" onClick={() => handleAssign(title.name, char.id)}>Dar título</button>
                        {char.titles.includes(title.name) && (
                          <button className="btn btn-danger" onClick={() => handleRemoveFromChar(title.name, char.id)}>Remover</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
