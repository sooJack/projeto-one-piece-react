import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const FEATURES = [
  { to: '/cartazes', icon: '📜', title: 'Cartazes', desc: 'Cartazes de procurados com recompensas em Belly.' },
  { to: '/ranking', icon: '🏆', title: 'Ranking', desc: 'Os piratas mais poderosos e seus níveis de XP.' },
  { to: '/conquistas', icon: '🎯', title: 'Conquistas', desc: 'Missões que concedem XP e títulos exclusivos.' },
  { to: '/titulos', icon: '👑', title: 'Títulos', desc: 'Títulos com cores e ícones personalizados.' },
  { to: '/mapa', icon: '🗺️', title: 'Mapa-Múndi', desc: 'Explore as ilhas do Grand Line e Novo Mundo.' },
  { to: '/mestre', icon: '🔐', title: 'Painel Mestre', desc: 'Gerencie personagens, conquistas e o fluxo de jogo.' },
];

export default function Home() {
  const { state } = useGame();
  const { toasts, addToast } = useToast();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const topChar = [...state.characters].sort((a, b) => b.xp - a.xp)[0] || null;

  return (
    <div className="page-content" style={{ padding: '6rem 1.5rem 3rem', maxWidth: 1200, margin: '0 auto' }}>
      <section style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '2rem', minHeight: 260, display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)', marginBottom: '0.75rem' }}>One Piece RPG</h1>
              <p style={{ maxWidth: 660, color: 'var(--white-dim)', lineHeight: 1.75 }}>
                Uma dashboard de aventura inspirada em One Piece. Gerencie recompensas, conquistas, títulos e viagens pelo mundo dos piratas.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.95rem', color: 'var(--gold)' }}>
                <span style={{ fontSize: '1.5rem' }}>🏴‍☠️</span> Bem-vindo, navegador!
              </span>
            </div>
          </div>
          {topChar && (
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--white-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Capitão em destaque</p>
                <h2 style={{ margin: '0.4rem 0 0', fontSize: '2rem' }}>{topChar.name}</h2>
                <p style={{ margin: '0.35rem 0 0', color: 'var(--white-dim)' }}>{topChar.crew} • {topChar.player}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                <div style={{ color: 'var(--gold)', fontSize: '2rem' }}>{topChar.avatar}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--white)', fontWeight: 700 }}>{topChar.xp.toLocaleString()} XP</div>
                  <div style={{ color: 'var(--white-dim)' }}>Bounty: {topChar.bounty.toLocaleString()} Belly</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {FEATURES.map((feature) => (
            <Link key={feature.to} to={feature.to} className="card" style={{ padding: '1.3rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: '1.65rem' }}>{feature.icon}</div>
              <h3 style={{ margin: '0.9rem 0 0.65rem' }}>{feature.title}</h3>
              <p style={{ margin: 0, color: 'var(--white-dim)' }}>{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <Toast toasts={toasts} />
    </div>
  );
}
