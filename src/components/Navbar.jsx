import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Início', icon: '⚓' },
  { to: '/cartazes', label: 'Cartazes', icon: '📜' },
  { to: '/ranking', label: 'Ranking', icon: '🏆' },
  { to: '/conquistas', label: 'Conquistas', icon: '🎯' },
  { to: '/titulos', label: 'Títulos', icon: '👑' },
  { to: '/mapa', label: 'Mapa-Múndi', icon: '🗺️' },
  { to: '/mestre', label: 'Painel Mestre', icon: '🔐' },
];

export default function Navbar() {
  const { isMaster } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      background: scrolled
        ? 'rgba(0,0,0,0.96)'
        : 'linear-gradient(to bottom, rgba(0,0,0,0.98), rgba(0,0,0,0.7))',
      borderBottom: scrolled ? '1px solid rgba(200,168,75,0.25)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
      }}>
        <Link to="/" style={{
          fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--gold)',
          letterSpacing: '0.1em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
          textShadow: '0 0 20px rgba(200,168,75,0.5)',
        }}>
          <span style={{ fontSize: '1.6rem', animation: 'float 3s ease-in-out infinite' }}>☠️</span>
          ONE PIECE RPG
        </Link>

        <div style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }} className="desktop-nav">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  color: isActive ? 'var(--gold)' : 'var(--white)',
                  textDecoration: 'none', fontSize: '0.88rem',
                  padding: '0.5rem 0.7rem', borderRadius: 999,
                  background: isActive ? 'rgba(200,168,75,0.12)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                <span>{link.icon}</span>
                <span className="nav-label-show">{link.label}</span>
              </Link>
            );
          })}
          {isMaster && (
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--gold)',
              border: '1px solid var(--gold)', padding: '0.2rem 0.5rem', letterSpacing: '0.08em', marginLeft: '0.5rem',
            }}>MESTRE</span>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none', border: 'none', color: 'var(--gold)',
            fontSize: '1.5rem', cursor: 'pointer', padding: '0.4rem', display: 'none',
          }}
          className="burger-btn"
          aria-label="Menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{
          background: 'rgba(0,0,0,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)',
                textDecoration: 'none', padding: '0.75rem 0.5rem', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn { display: block !important; }
        }
        @media (max-width: 1024px) {
          .nav-label-show { display: none; }
        }
      `}</style>
    </nav>
  );
}
