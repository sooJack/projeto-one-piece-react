import React, { useState, useRef } from 'react';

// ============================================================
// CONFIGURAÇÃO PRINCIPAL — EDITE AQUI OS PONTOS DO MAPA
// ============================================================
const INITIAL_POINTS = [
  // ── GRAND LINE / RED LINE ──────────────────────────────────
  {
    id: 1, name: "Mary Geoise", region: "redline",
    x: 50, y: 42,
    icon: "crown", color: "#FFD700",
    desc: "Sede do Governo Mundial, no topo da Red Line.",
    arc: "Marineford",
  },
  {
    id: 2, name: "Fishman Island", region: "redline",
    x: 50, y: 58,
    icon: "fish", color: "#00BFFF",
    desc: "Ilha subaquática, portão para o Novo Mundo.",
    arc: "Fishman Island",
  },
  // ── EAST BLUE ─────────────────────────────────────────────
  {
    id: 3, name: "Foosha Village", region: "eastblue",
    x: 16, y: 62,
    icon: "home", color: "#FF6347",
    desc: "Vila natal de Monkey D. Luffy.",
    arc: "Romance Dawn",
  },
  {
    id: 4, name: "Baratie", region: "eastblue",
    x: 22, y: 68,
    icon: "meat", color: "#FFA500",
    desc: "Restaurante flutuante do Chef Zeff.",
    arc: "Baratie",
  },
  {
    id: 5, name: "Arlong Park", region: "eastblue",
    x: 28, y: 72,
    icon: "shark", color: "#4169E1",
    desc: "Território de Arlong e os Piratas Arlong.",
    arc: "Arlong Park",
  },
  {
    id: 6, name: "Loguetown", region: "eastblue",
    x: 32, y: 65,
    icon: "anchor", color: "#808080",
    desc: "Cidade onde Gold Roger nasceu e foi executado.",
    arc: "Loguetown",
  },
  // ── WEST BLUE ─────────────────────────────────────────────
  {
    id: 7, name: "Ohara", region: "westblue",
    x: 14, y: 38,
    icon: "book", color: "#8B4513",
    desc: "Ilha dos arqueólogos. Destruída pelo Buster Call.",
    arc: "Flashback",
  },
  {
    id: 8, name: "Moby Dick", region: "westblue",
    x: 20, y: 30,
    icon: "ship", color: "#1a1a2e",
    desc: "Navio do Barba Branca, lendário pirata.",
    arc: "Flashback",
  },
  // ── NORTH BLUE ────────────────────────────────────────────
  {
    id: 9, name: "North Blue Origin", region: "northblue",
    x: 55, y: 22,
    icon: "snowflake", color: "#87CEEB",
    desc: "Mar do Norte, origem de Trafalgar Law e Sanji.",
    arc: "N/A",
  },
  {
    id: 10, name: "Germa Kingdom", region: "northblue",
    x: 62, y: 18,
    icon: "star", color: "#C0C0C0",
    desc: "Reino flutuante de Vinsmoke.",
    arc: "Whole Cake Island",
  },
  // ── SOUTH BLUE ────────────────────────────────────────────
  {
    id: 11, name: "South Blue Origin", region: "southblue",
    x: 55, y: 78,
    icon: "sun", color: "#FFD700",
    desc: "Mar do Sul, origem de Franky e Brook.",
    arc: "N/A",
  },
  // ── PARADISE (PRIMEIRA METADE DA GRAND LINE) ──────────────
  {
    id: 12, name: "Twin Capes", region: "paradise",
    x: 36, y: 50,
    icon: "lighthouse", color: "#FF8C00",
    desc: "Entrada da Grand Line pelo Reverse Mountain.",
    arc: "Entrada Grand Line",
  },
  {
    id: 13, name: "Whisky Peak", region: "paradise",
    x: 38, y: 47,
    icon: "beer", color: "#DAA520",
    desc: "Ilha dos Baroque Works. Primeira ilha no Log Pose.",
    arc: "Baroque Works",
  },
  {
    id: 14, name: "Little Garden", region: "paradise",
    x: 39, y: 52,
    icon: "tree", color: "#228B22",
    desc: "Ilha pré-histórica com gigantes em duelo eterno.",
    arc: "Baroque Works",
  },
  {
    id: 15, name: "Drum Island", region: "paradise",
    x: 40, y: 46,
    icon: "snowflake", color: "#B0E0E6",
    desc: "Reino de Wapol. Chopper se juntou à tripulação.",
    arc: "Drum Island",
  },
  {
    id: 16, name: "Alabasta", region: "paradise",
    x: 41, y: 54,
    icon: "pyramid", color: "#F4A460",
    desc: "Reino do deserto governado por Crocodile/Baroque Works.",
    arc: "Alabasta",
  },
  {
    id: 17, name: "Jaya", region: "paradise",
    x: 42, y: 48,
    icon: "skull", color: "#8B0000",
    desc: "Ilha de Bellamy. Perto de Skypiea.",
    arc: "Skypiea",
  },
  {
    id: 18, name: "Skypiea", region: "paradise",
    x: 42, y: 44,
    icon: "cloud", color: "#FFFACD",
    desc: "Ilha nas nuvens com o deus Eneru.",
    arc: "Skypiea",
  },
  {
    id: 19, name: "Long Ring Long Land", region: "paradise",
    x: 43, y: 52,
    icon: "flag", color: "#32CD32",
    desc: "Ilha longa com o Davy Back Fight.",
    arc: "Filler/Davy Back",
  },
  {
    id: 20, name: "Water 7", region: "paradise",
    x: 44, y: 48,
    icon: "city", color: "#4682B4",
    desc: "Cidade aquática, lar dos carpinteiros de Galley-La.",
    arc: "Water 7 / Enies Lobby",
  },
  {
    id: 21, name: "Enies Lobby", region: "paradise",
    x: 44.5, y: 50,
    icon: "justice", color: "#DC143C",
    desc: "Tribunal do Governo Mundial. Luffy declarou guerra.",
    arc: "Enies Lobby",
  },
  {
    id: 22, name: "Thriller Bark", region: "paradise",
    x: 46, y: 52,
    icon: "ghost", color: "#4B0082",
    desc: "Navio-ilha de Gecko Moria, no Triângulo de Florian.",
    arc: "Thriller Bark",
  },
  {
    id: 23, name: "Sabaody Archipelago", region: "paradise",
    x: 47.5, y: 50,
    icon: "bubble", color: "#FF69B4",
    desc: "Arquipélago com manguezal de bolhas, perto da Red Line.",
    arc: "Sabaody",
  },
  {
    id: 24, name: "Amazon Lily", region: "paradise",
    x: 45, y: 55,
    icon: "flower", color: "#FF1493",
    desc: "Ilha das guerreiras. Boa Hancock governa.",
    arc: "Amazon Lily",
  },
  {
    id: 25, name: "Impel Down", region: "paradise",
    x: 49, y: 54,
    icon: "prison", color: "#8B0000",
    desc: "Maior prisão do mundo, abaixo de Marineford.",
    arc: "Impel Down",
  },
  {
    id: 26, name: "Marineford", region: "paradise",
    x: 49.5, y: 47,
    icon: "sword", color: "#000080",
    desc: "Quartel General da Marinha. Guerra do Summit.",
    arc: "Marineford",
  },
  // ── NEW WORLD (SEGUNDA METADE DA GRAND LINE) ───────────────
  {
    id: 27, name: "Punk Hazard", region: "newworld",
    x: 54, y: 52,
    icon: "fire", color: "#FF4500",
    desc: "Ilha dividida: fogo e gelo. Experimentos de Caesar.",
    arc: "Punk Hazard",
  },
  {
    id: 28, name: "Dressrosa", region: "newworld",
    x: 56, y: 48,
    icon: "rose", color: "#FF69B4",
    desc: "Reino de Doflamingo. Os brinquedos e o SMILE.",
    arc: "Dressrosa",
  },
  {
    id: 29, name: "Zou", region: "newworld",
    x: 58, y: 54,
    icon: "elephant", color: "#808000",
    desc: "Ilha nas costas do elefante Zunesha.",
    arc: "Zou",
  },
  {
    id: 30, name: "Whole Cake Island", region: "newworld",
    x: 60, y: 46,
    icon: "cake", color: "#FFB6C1",
    desc: "Território de Big Mom. Terra dos doces.",
    arc: "Whole Cake Island",
  },
  {
    id: 31, name: "Wano Country", region: "newworld",
    x: 65, y: 50,
    icon: "katana", color: "#DC143C",
    desc: "País isolado do samurai governado por Kaido.",
    arc: "Wano",
  },
  {
    id: 32, name: "Egghead Island", region: "newworld",
    x: 70, y: 48,
    icon: "robot", color: "#00CED1",
    desc: "Ilha futurista do Dr. Vegapunk.",
    arc: "Egghead",
  },
  {
    id: 33, name: "Laugh Tale", region: "newworld",
    x: 78, y: 50,
    icon: "treasure", color: "#FFD700",
    desc: "Ilha final. O One Piece está aqui.",
    arc: "Desconhecido",
  },
];

// ── ÍCONES SVG INLINE (personalizados One Piece) ─────────────
const ICONS = {
  crown: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M2 19l2-8 4 4 4-8 4 8 4-4 2 8H2z" />
      <circle cx="6" cy="9" r="1.5" />
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="18" cy="9" r="1.5" />
    </svg>
  ),
  fish: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M2 12C2 12 6 4 14 8c2 1 4 2 6 0-1 4-3 6-6 6-3 0-5-2-8 2C4 13 2 12 2 12z" />
      <circle cx="16" cy="8" r="1" fill="#000" />
    </svg>
  ),
  home: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <path d="M3 12L12 3l9 9" /><path d="M5 10v9h4v-5h6v5h4v-9" />
    </svg>
  ),
  meat: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <ellipse cx="12" cy="14" rx="8" ry="5" />
      <rect x="9" y="5" width="6" height="9" rx="3" />
      <circle cx="12" cy="5" r="2" fill="#fff" opacity="0.4" />
    </svg>
  ),
  shark: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M2 16C4 10 10 8 14 10c1-3 3-5 6-4-2 2-3 4-2 6-4 0-8 2-10 4H2z" />
      <path d="M8 16l2-3" stroke="#fff" strokeWidth="1" />
    </svg>
  ),
  anchor: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <circle cx="12" cy="5" r="3" />
      <path d="M12 8v13M5 11c0 4 3 7 7 7s7-3 7-7" />
      <path d="M2 11h5M17 11h5" />
    </svg>
  ),
  book: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <path d="M4 4h8v16H4zM12 4h8v16h-8z" /><path d="M12 4v16" />
    </svg>
  ),
  ship: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M3 17l3-8h12l3 8H3z" />
      <path d="M8 9V5l4-2 4 2v4" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M12 3v6" stroke="#fff" strokeWidth="1" />
    </svg>
  ),
  snowflake: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    </svg>
  ),
  star: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7L2 9l7-1 3-6z" />
    </svg>
  ),
  sun: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  lighthouse: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <rect x="9" y="2" width="6" height="14" rx="1" />
      <path d="M7 16h10l2 6H5l2-6z" />
      <path d="M9 2L6 0M15 2l3-2" stroke={c} strokeWidth="1.5" />
      <rect x="10" y="5" width="4" height="3" fill="#fff" opacity="0.5" rx="1" />
    </svg>
  ),
  beer: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M6 4h12l-1 16H7L6 4z" />
      <path d="M9 4V2M12 4V2M15 4V2" stroke="#fff" strokeWidth="1" />
      <path d="M17 8h3a2 2 0 010 4h-3" fill="none" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  tree: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M12 2L4 10h4l-3 6h6v6h2v-6h6l-3-6h4L12 2z" />
    </svg>
  ),
  pyramid: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M12 2L2 20h20L12 2z" />
      <path d="M2 20h20M12 2v18" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
    </svg>
  ),
  skull: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M12 2a8 8 0 018 8v12l-2.5-2-2.5 2-2.5-2-2.5 2-2.5-2L4 22V10A8 8 0 0112 2z" />
      <circle cx="9" cy="11" r="1.5" fill="#000" opacity="0.5" />
      <circle cx="15" cy="11" r="1.5" fill="#000" opacity="0.5" />
      <path d="M10 20h4" stroke="#000" strokeWidth="1" />
    </svg>
  ),
  cloud: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M6 19a5 5 0 010-10 7 7 0 0113 2 4 4 0 01-1 8H6z" />
      <path d="M9 22l1-3M15 22l-1-3" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  flag: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M4 2v20" stroke={c} strokeWidth="2" />
      <path d="M4 4h14l-3 5 3 5H4V4z" />
    </svg>
  ),
  city: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <rect x="2" y="10" width="7" height="12" /><rect x="9" y="6" width="6" height="16" />
      <rect x="15" y="12" width="7" height="10" />
      <rect x="4" y="12" width="1.5" height="2" fill="#fff" opacity="0.4" />
      <rect x="4" y="16" width="1.5" height="2" fill="#fff" opacity="0.4" />
      <rect x="11" y="8" width="1.5" height="2" fill="#fff" opacity="0.4" />
      <rect x="11" y="12" width="1.5" height="2" fill="#fff" opacity="0.4" />
    </svg>
  ),
  justice: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <path d="M12 2v20M4 6h16" />
      <path d="M6 6l-4 8h8L6 6z" /><path d="M18 6l-4 8h8l-4-8z" />
    </svg>
  ),
  ghost: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M12 2a8 8 0 018 8v12l-2.5-2-2.5 2-2.5-2-2.5 2-2.5-2L4 22V10A8 8 0 0112 2z" />
      <circle cx="9" cy="11" r="1.5" fill="#000" opacity="0.4" />
      <circle cx="15" cy="11" r="1.5" fill="#000" opacity="0.4" />
    </svg>
  ),
  bubble: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" width="22" height="22">
      <circle cx="12" cy="12" r="8" />
      <circle cx="8" cy="8" r="3" /><circle cx="16" cy="16" r="2" />
      <circle cx="15" cy="7" r="1.5" />
    </svg>
  ),
  flower: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <circle cx="12" cy="12" r="3" />
      {[0,60,120,180,240,300].map(a => (
        <ellipse key={a} cx={12 + 5*Math.cos(a*Math.PI/180)} cy={12 + 5*Math.sin(a*Math.PI/180)}
          rx="2.5" ry="1.5"
          transform={`rotate(${a} ${12 + 5*Math.cos(a*Math.PI/180)} ${12 + 5*Math.sin(a*Math.PI/180)})`}
          opacity="0.85" />
      ))}
    </svg>
  ),
  prison: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" width="22" height="22">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M8 3v18M12 3v18M16 3v18" />
      <path d="M3 9h18M3 15h18" />
    </svg>
  ),
  sword: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M14.5 2L22 9.5 9 22.5l-2-2L14.5 2z" />
      <path d="M5 17l-3 3" stroke={c} strokeWidth="2" /><path d="M3 14l4 4-2 1-1-2-2-1 1-2z" />
    </svg>
  ),
  fire: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-4-2-6-2-9-1 2-2 4-4 5 1-3 0-7 0-10z" />
    </svg>
  ),
  rose: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <circle cx="12" cy="10" r="5" />
      <path d="M12 15v7M9 20h6" stroke={c} strokeWidth="1.5" />
      <path d="M7 8c-1-2 0-5 3-5" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5" />
    </svg>
  ),
  elephant: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <ellipse cx="13" cy="11" rx="8" ry="6" />
      <path d="M5 13c-2 2-3 5-1 7 1-2 2-3 4-3" />
      <circle cx="17" cy="9" r="1" fill="#000" opacity="0.4" />
      <path d="M19 7c1-2 3-2 3 0" fill="none" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  cake: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <rect x="3" y="11" width="18" height="10" rx="1" />
      <path d="M3 14h18" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
      <path d="M8 4c0-2 4-2 4 0v7H8V4z" />
      <path d="M12 4c0-2 4-2 4 0v7h-4V4z" opacity="0.7" />
      <path d="M9 2c0-1 2-1 2 0" stroke="#fff" strokeWidth="1" fill="none" />
      <path d="M13 2c0-1 2-1 2 0" stroke="#fff" strokeWidth="1" fill="none" />
    </svg>
  ),
  katana: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <path d="M3 21L19 5l2 2L5 23 3 21z" />
      <path d="M16 4l2 2-2 2-2-2 2-2z" fill="#fff" opacity="0.5" />
      <path d="M3 21l-1 1 1-1z" />
    </svg>
  ),
  robot: (c) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" width="22" height="22">
      <rect x="6" y="8" width="12" height="10" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M12 6v2" />
      <circle cx="9.5" cy="13" r="1.5" fill={c} />
      <circle cx="14.5" cy="13" r="1.5" fill={c} />
      <path d="M2 12h4M18 12h4M9 18v2M15 18v2" />
    </svg>
  ),
  treasure: (c) => (
    <svg viewBox="0 0 24 24" fill={c} width="22" height="22">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M3 13h18" stroke="#fff" strokeWidth="0.5" opacity="0.3" />
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <circle cx="12" cy="10" r="1.5" fill="#fff" opacity="0.6" />
      {[6,9,12,15,18].map(x=><circle key={x} cx={x} cy="16" r="1" fill="#fff" opacity="0.4"/>)}
    </svg>
  ),
};

const getIcon = (name, color = "#FFD700") => ICONS[name] ? ICONS[name](color) : ICONS.star(color);

// ── CORES POR REGIÃO ─────────────────────────────────────────
const REGION_COLORS = {
  eastblue:  { bg: "rgba(30,80,180,0.18)",  label: "East Blue",  labelColor: "#6ab0ff" },
  westblue:  { bg: "rgba(20,60,160,0.18)",  label: "West Blue",  labelColor: "#aaaaff" },
  northblue: { bg: "rgba(100,180,255,0.15)", label: "North Blue", labelColor: "#7dd3fc" },
  southblue: { bg: "rgba(20,120,200,0.18)", label: "South Blue", labelColor: "#38bdf8" },
  paradise:  { bg: "rgba(0,120,80,0.12)",   label: "Paradise (Grand Line)", labelColor: "#4ade80" },
  newworld:  { bg: "rgba(180,30,30,0.13)",  label: "New World",  labelColor: "#f87171" },
  redline:   { bg: "transparent",           label: "Red Line",   labelColor: "#ef4444" },
};

// ── ESTILOS ──────────────────────────────────────────────────
const S = {
  wrap: {
    position:"relative", width:"100%", height:"100vh", overflow:"hidden",
    background:"radial-gradient(ellipse at 50% 60%, #0a1628 0%, #050d1a 60%, #000 100%)",
    fontFamily:"'Cinzel', 'Georgia', serif",
  },
  ocean: {
    position:"absolute", inset:0,
    backgroundImage:`
      repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,100,200,0.07) 40px),
      repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,100,200,0.07) 40px)
    `,
  },
  mapArea: {
    position:"absolute", inset:0,
  },
  // Calm Belts — faixas horizontais fixas
  calmBeltTop: {
    position:"absolute", left:0, right:0,
    top:"calc(50% - 130px)", height:"36px",
    background:"rgba(180,120,0,0.13)",
    borderTop:"1.5px solid rgba(255,180,0,0.18)",
    borderBottom:"1.5px solid rgba(255,180,0,0.18)",
    display:"flex", alignItems:"center", justifyContent:"center",
    pointerEvents:"none",
  },
  calmBeltBottom: {
    position:"absolute", left:0, right:0,
    top:"calc(50% + 94px)", height:"36px",
    background:"rgba(180,120,0,0.13)",
    borderTop:"1.5px solid rgba(255,180,0,0.18)",
    borderBottom:"1.5px solid rgba(255,180,0,0.18)",
    display:"flex", alignItems:"center", justifyContent:"center",
    pointerEvents:"none",
  },
  calmText: {
    color:"rgba(255,200,80,0.45)", fontSize:"11px", letterSpacing:"3px",
    textTransform:"uppercase", fontFamily:"'Cinzel',serif",
  },
  // Red Line — barra vertical central
  redLine: {
    position:"absolute", top:0, bottom:0,
    left:"calc(50% - 10px)", width:"20px",
    background:"linear-gradient(180deg,#8b0000 0%,#cc0000 40%,#8b0000 100%)",
    boxShadow:"0 0 18px 6px rgba(200,0,0,0.35), 0 0 40px 10px rgba(200,0,0,0.15)",
    zIndex:10,
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    pointerEvents:"none",
  },
  redLineLabel: {
    color:"#fff", fontSize:"11px", letterSpacing:"4px",
    writingMode:"vertical-rl", textOrientation:"mixed",
    textTransform:"uppercase", opacity:0.7, userSelect:"none",
  },
  // Grand Line — linha horizontal central
  grandLine: {
    position:"absolute", left:0, right:0,
    top:"50%", height:"3px",
    background:"linear-gradient(90deg,transparent 0%,rgba(255,215,0,0.6) 20%,rgba(255,215,0,0.9) 50%,rgba(255,215,0,0.6) 80%,transparent 100%)",
    boxShadow:"0 0 12px 3px rgba(255,200,0,0.3)",
    zIndex:9,
    pointerEvents:"none",
  },
  grandLineLabel: {
    position:"absolute", right:"2%", top:"50%",
    transform:"translateY(-18px)",
    color:"rgba(255,215,0,0.6)", fontSize:"10px", letterSpacing:"3px",
    textTransform:"uppercase", zIndex:15, pointerEvents:"none",
  },
  // Rótulos de regiões
  regionLabel: (side, pct) => ({
    position:"absolute",
    [side]: "1.5%",
    top:`${pct}%`,
    transform:"translateY(-50%)",
    color:"rgba(100,180,255,0.35)",
    fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase",
    pointerEvents:"none", zIndex:5,
  }),
  // Pin do ponto
  pin: (selected, hover) => ({
    position:"absolute",
    transform:"translate(-50%,-50%)",
    cursor:"pointer",
    zIndex:20,
    transition:"transform 0.15s",
    filter: selected ? "drop-shadow(0 0 8px gold)" : hover ? "drop-shadow(0 0 6px rgba(255,255,255,0.5))" : "none",
    scale: selected ? "1.25" : hover ? "1.1" : "1",
  }),
  pinDot: (color) => ({
    width:36, height:36,
    borderRadius:"50%",
    background:`radial-gradient(circle at 35% 35%, ${color}dd, ${color}55)`,
    border:`2px solid ${color}`,
    boxShadow:`0 0 10px 2px ${color}44`,
    display:"flex", alignItems:"center", justifyContent:"center",
  }),
  tooltip: {
    position:"absolute", bottom:"100%", left:"50%",
    transform:"translateX(-50%) translateY(-8px)",
    background:"rgba(5,15,35,0.97)",
    border:"1px solid rgba(255,215,0,0.25)",
    borderRadius:8, padding:"8px 12px",
    minWidth:160, maxWidth:220,
    zIndex:50, pointerEvents:"none",
    boxShadow:"0 4px 24px rgba(0,0,0,0.7)",
  },
  ttTitle: { color:"#FFD700", fontSize:13, fontWeight:700, marginBottom:3 },
  ttArc: { color:"rgba(255,180,80,0.7)", fontSize:10, marginBottom:4, letterSpacing:1 },
  ttDesc: { color:"rgba(200,210,230,0.85)", fontSize:11, lineHeight:1.5 },
  // Admin panel
  adminBtn: (open) => ({
    position:"fixed", bottom:24, right:24,
    background: open ? "rgba(180,0,0,0.9)" : "rgba(20,40,80,0.95)",
    border:"1.5px solid rgba(255,215,0,0.4)",
    borderRadius:12, padding:"10px 18px",
    color:"#FFD700", fontSize:13, letterSpacing:1,
    cursor:"pointer", zIndex:100,
    boxShadow:"0 4px 20px rgba(0,0,0,0.5)",
    fontFamily:"'Cinzel',serif",
  }),
  panel: {
    position:"fixed", right:24, bottom:80,
    width:320, maxHeight:"70vh",
    background:"rgba(5,15,35,0.98)",
    border:"1.5px solid rgba(255,215,0,0.3)",
    borderRadius:14, padding:20,
    overflowY:"auto", zIndex:99,
    boxShadow:"0 8px 40px rgba(0,0,0,0.7)",
    color:"#ddd", fontSize:13,
  },
  panelTitle: {
    color:"#FFD700", fontSize:15, fontWeight:700,
    marginBottom:14, letterSpacing:1,
    borderBottom:"1px solid rgba(255,215,0,0.2)",
    paddingBottom:8,
  },
  input: {
    background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,0,0.2)",
    borderRadius:6, padding:"5px 8px", color:"#eee", fontSize:12, width:"100%",
    outline:"none", marginBottom:6, boxSizing:"border-box",
  },
  label: { color:"rgba(200,210,230,0.6)", fontSize:11, marginBottom:2, display:"block" },
  row: { display:"flex", gap:8, marginBottom:8 },
  addBtn: {
    background:"rgba(255,215,0,0.15)", border:"1.5px solid rgba(255,215,0,0.4)",
    borderRadius:8, padding:"7px 14px", color:"#FFD700",
    cursor:"pointer", fontSize:12, fontFamily:"'Cinzel',serif", width:"100%",
    marginTop:4,
  },
  deleteBtn: {
    background:"rgba(180,0,0,0.2)", border:"1px solid rgba(200,0,0,0.4)",
    borderRadius:6, padding:"4px 10px", color:"#ff6666",
    cursor:"pointer", fontSize:11,
  },
  pointRow: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.05)",
  },
  // Legend
  legend: {
    position:"fixed", left:16, bottom:16,
    background:"rgba(5,15,35,0.92)",
    border:"1px solid rgba(255,215,0,0.2)",
    borderRadius:10, padding:"12px 16px",
    zIndex:90, minWidth:130,
  },
  legendTitle: { color:"#FFD700", fontSize:10, letterSpacing:2, marginBottom:8, textTransform:"uppercase" },
  legendRow: (c) => ({
    display:"flex", alignItems:"center", gap:8,
    marginBottom:5, color:"rgba(200,210,230,0.7)", fontSize:10,
  }),
  legendDot: (c) => ({
    width:10, height:10, borderRadius:"50%",
    background:c, border:`1.5px solid ${c}`,
    flexShrink:0,
  }),
};

// ── ADMIN PASSWORD (usando a mesma do AuthContext) ────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD || "grandline2024";

export default function Mapa() {
  const [points, setPoints] = useState(INITIAL_POINTS);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name:"", region:"paradise", x:50, y:50,
    icon:"star", color:"#FFD700", desc:"", arc:"",
  });
  const mapRef = useRef(null);

  const handleLogin = () => {
    if (pwInput.trim() === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setPwError(false);
      setPwInput("");
    } else {
      setPwError(true);
    }
  };

  const handleMapClick = (e) => {
    if (isAdmin) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setForm({ ...form, x: Math.round(x), y: Math.round(y) });
      setAdminOpen(true);
    }
  };

  const savePoint = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setPoints(pts => pts.map(p => p.id === editId ? { ...form, id: editId } : p));
      setEditId(null);
    } else {
      setPoints(pts => [...pts, { ...form, id: Date.now() }]);
    }
    setForm({ name:"", region:"paradise", x:50, y:50, icon:"star", color:"#FFD700", desc:"", arc:"" });
  };

  const deletePoint = (id) => setPoints(pts => pts.filter(p => p.id !== id));

  const startEdit = (p) => {
    setForm(p);
    setEditId(p.id);
    setAdminOpen(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name:"", region:"paradise", x:50, y:50, icon:"star", color:"#FFD700", desc:"", arc:"" });
  };

  const ICON_KEYS = Object.keys(ICONS);
  const REGIONS = ["eastblue","westblue","northblue","southblue","paradise","newworld","redline"];

  // Agrupa pontos por região para a legenda
  const regionSet = [...new Set(points.map(p => p.region))];

  return (
    <div style={S.wrap}>
      {/* Ocean background */}
      <div style={S.ocean} />

      {/* Map area */}
      <div style={S.mapArea} ref={mapRef} onClick={handleMapClick}>
        {/* Calm Belts */}
        <div style={S.calmBeltTop}><span style={S.calmText}>CALM BELT</span></div>
        <div style={S.calmBeltBottom}><span style={S.calmText}>CALM BELT</span></div>

        {/* Red Line */}
        <div style={S.redLine}><span style={S.redLineLabel}>RED LINE</span></div>

        {/* Grand Line */}
        <div style={S.grandLine} />
        <div style={S.grandLineLabel}>GRAND LINE</div>

        {/* Region labels */}
        <div style={S.regionLabel("left", 20)}>EAST BLUE</div>
        <div style={S.regionLabel("left", 45)}>WEST BLUE</div>
        <div style={S.regionLabel("right", 15)}>NORTH BLUE</div>
        <div style={S.regionLabel("right", 70)}>SOUTH BLUE</div>
        <div style={S.regionLabel("left", 70)}>PARADISE</div>
        <div style={S.regionLabel("right", 45)}>NEW WORLD</div>

        {/* Points */}
        {points.map(p => (
          <div
            key={p.id}
            style={{
              ...S.pin(selected?.id === p.id, hovered?.id === p.id),
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            onMouseEnter={() => setHovered(p)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => { e.stopPropagation(); setSelected(p); }}
          >
            <div style={S.pinDot(p.color)}>
              {getIcon(p.icon, p.color)}
            </div>
          </div>
        ))}

        {/* Tooltip */}
        {hovered && (
          <div style={{
            ...S.tooltip,
            left: `${hovered.x}%`,
            top: `${hovered.y}%`,
          }}>
            <div style={S.ttTitle}>{hovered.name}</div>
            <div style={S.ttArc}>{hovered.arc}</div>
            <div style={S.ttDesc}>{hovered.desc}</div>
          </div>
        )}
      </div>

      {/* Admin button */}
      <button
        style={S.adminBtn(adminOpen)}
        onClick={() => setAdminOpen(!adminOpen)}
      >
        {adminOpen ? "FECHAR ADMIN" : "ADMIN"}
      </button>

      {/* Admin panel */}
      {adminOpen && (
        <div style={S.panel}>
          <div style={S.panelTitle}>ADMIN PANEL</div>

          {!isAdmin ? (
            <div>
              <div style={S.label}>Senha Admin</div>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                style={S.input}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {pwError && <div style={{ color: "#ff6666", fontSize: 11, marginTop: 4 }}>Senha incorreta</div>}
              <button style={S.addBtn} onClick={handleLogin}>ENTRAR</button>
            </div>
          ) : (
            <div>
              {/* Add/Edit form */}
              <div style={S.row}>
                <div style={{ flex: 1 }}>
                  <div style={S.label}>Nome</div>
                  <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} style={S.input} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.label}>Ícone</div>
                  <select value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} style={S.input}>
                    {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>

              <div style={S.row}>
                <div style={{ flex: 1 }}>
                  <div style={S.label}>Região</div>
                  <select value={form.region} onChange={(e) => setForm(f => ({ ...f, region: e.target.value }))} style={S.input}>
                    {REGIONS.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.label}>Cor</div>
                  <input type="color" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} style={S.input} />
                </div>
              </div>

              <div style={S.row}>
                <div style={{ flex: 1 }}>
                  <div style={S.label}>X%</div>
                  <input type="number" min={0} max={100} value={form.x} onChange={(e) => setForm(f => ({ ...f, x: parseInt(e.target.value) || 0 }))} style={S.input} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={S.label}>Y%</div>
                  <input type="number" min={0} max={100} value={form.y} onChange={(e) => setForm(f => ({ ...f, y: parseInt(e.target.value) || 0 }))} style={S.input} />
                </div>
              </div>

              <div style={S.label}>Descrição</div>
              <textarea rows={2} value={form.desc} onChange={(e) => setForm(f => ({ ...f, desc: e.target.value }))} style={S.input} />

              <div style={S.label}>Arco</div>
              <input value={form.arc} onChange={(e) => setForm(f => ({ ...f, arc: e.target.value }))} style={S.input} />

              <div style={S.row}>
                <button style={S.addBtn} onClick={savePoint}>{editId ? "SALVAR" : "ADICIONAR"}</button>
                {editId && <button style={S.deleteBtn} onClick={cancelEdit}>CANCELAR</button>}
              </div>

              {/* Points list */}
              <div style={{ marginTop: 20 }}>
                <div style={S.panelTitle}>PONTOS ({points.length})</div>
                {points.map(p => (
                  <div key={p.id} style={S.pointRow}>
                    <span>{p.name}</span>
                    <div>
                      <button style={S.deleteBtn} onClick={() => startEdit(p)}>EDIT</button>
                      <button style={S.deleteBtn} onClick={() => deletePoint(p.id)}>DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={S.legend}>
        <div style={S.legendTitle}>REGIÕES</div>
        {regionSet.map(r => {
          const rc = REGION_COLORS[r];
          return rc ? (
            <div key={r} style={S.legendRow(rc.labelColor)}>
              <div style={S.legendDot(rc.labelColor)} />
              {rc.label}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
