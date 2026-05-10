import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function Mestre() {
  const { isMaster, login, logout } = useAuth();
  const { state } = useGame();
  const { toasts, addToast } = useToast();
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (login(password.trim())) {
      addToast('Acesso de mestre liberado', 'success');
    } else {
      addToast('Senha incorreta', 'error');
    }
    setPassword('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="page-content" style={{ padding: '6rem 1.5rem 3rem', maxWidth: 900, margin: '0 auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h1>Painel Mestre</h1>
        <p style={{ color: 'var(--white-dim)' }}>Área administrativa do jogo. Use a senha secreta para liberar recursos especiais.</p>

        {isMaster ? (
          <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <span style={{ color: 'var(--white-dim)' }}>Status</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold)' }}>
                <span>🔐</span> Acesso mestre ativo
              </div>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18 }}>
              <p style={{ margin: 0, color: 'var(--white-dim)' }}>Personagens cadastrados: {state.characters.length}</p>
              <p style={{ margin: 0, color: 'var(--white-dim)' }}>Títulos disponíveis: {state.titles.length}</p>
              <p style={{ margin: 0, color: 'var(--white-dim)' }}>Conquistas ativas: {state.achievements.filter((ach) => ach.active).length}</p>
              <button className="btn btn-danger" onClick={() => { logout(); addToast('Sessão mestre encerrada', 'default'); }}>
                Encerrar sessão de mestre
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '1rem', maxWidth: 360 }}>
              <input
                type="password"
                placeholder="Senha do mestre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="btn" onClick={handleLogin}>Entrar</button>
            </div>
          </div>
        )}
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
