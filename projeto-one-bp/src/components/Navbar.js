// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useRPG } from "../context/RPGContext";
import "./Navbar.css";

const NAV_LINKS = [
  { path: "/", label: "Início", icon: "🏴‍☠️" },
  { path: "/cartazes", label: "Cartazes", icon: "📜" },
  { path: "/personagens", label: "Ranking", icon: "⚔️" },
  { path: "/titulos", label: "Títulos", icon: "👑" },
  { path: "/conquistas", label: "Conquistas", icon: "🏆" },
  { path: "/mapa", label: "Mapa-Múndi", icon: "🗺️" },
  { path: "/mestre", label: "Mestre", icon: "🔐" },
];

export default function Navbar() {
  const { siteXP, siteLevel, isMaster, notification } = useRPG();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const xpToNext = ((siteLevel) * (siteLevel) * 50);
  const xpProgress = Math.min((siteXP / xpToNext) * 100, 100);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">☠</span>
          <span className="brand-text">ONE PIECE RPG</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav-link ${location.pathname === l.path ? "active" : ""} ${l.path === "/mestre" ? "nav-link-master" : ""}`}
            >
              <span className="nav-icon">{l.icon}</span>
              <span>{l.label}</span>
              {isMaster && l.path === "/mestre" && (
                <span className="master-badge">●</span>
              )}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <div className="site-xp-bar">
            <span className="site-level">Nv.{siteLevel}</span>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="site-xp-label">{siteXP} XP</span>
          </div>

          <button className="menu-toggle" onClick={() => setMenuOpen((p) => !p)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.msg}
        </div>
      )}
    </>
  );
}
