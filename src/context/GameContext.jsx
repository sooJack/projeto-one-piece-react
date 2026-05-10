import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const GameContext = createContext(null);

const initialCharacters = [
  {
    id: 1,
    name: 'Monkey D. Luffy',
    player: 'Jogador 1',
    crew: 'Chapéu de Palha',
    bounty: 3000000000,
    level: 1,
    xp: 0,
    avatar: '🏴‍☠️',
    titles: ['Piratas'],
    achievements: [],
    titleColor: '#c8a84b',
    titleIcon: '⚓',
    islandVisits: [],
    notes: 'Protagonista e capitão dos Chapéus de Palha.',
  },
  {
    id: 2,
    name: 'Roronoa Zoro',
    player: 'Jogador 2',
    crew: 'Chapéu de Palha',
    bounty: 1111000000,
    level: 1,
    xp: 0,
    avatar: '⚔️',
    titles: ['Espadachim'],
    achievements: [],
    titleColor: '#2ecc71',
    titleIcon: '⚔️',
    islandVisits: [],
    notes: 'Vice-capitão. Tres estilos de espada.',
  },
];

const initialAchievements = [
  {
    id: 'ach-001',
    name: 'Primeiro Passo',
    description: 'Chegue a uma ilha pela primeira vez.',
    xpReward: 100,
    titleReward: null,
    icon: '🦶',
    category: 'exploração',
    completedBy: [],
    active: true,
  },
  {
    id: 'ach-002',
    name: 'Rei dos Piratas',
    description: 'Complete a grande rota e encontre o One Piece.',
    xpReward: 5000,
    titleReward: 'Rei dos Piratas',
    icon: '👑',
    category: 'história',
    completedBy: [],
    active: true,
  },
  {
    id: 'ach-003',
    name: 'Caçador de Recompensas',
    description: 'Derrote um inimigo com recompensa acima de 100.000.000.',
    xpReward: 500,
    titleReward: 'Caçador',
    icon: '🎯',
    category: 'combate',
    completedBy: [],
    active: true,
  },
  {
    id: 'ach-004',
    name: 'Navegador dos Mares',
    description: 'Visite 5 ilhas diferentes.',
    xpReward: 300,
    titleReward: 'Explorador',
    icon: '🗺️',
    category: 'exploração',
    completedBy: [],
    active: true,
  },
];

const initialTitles = [
  { id: 't-1', name: 'Piratas', color: '#c8a84b', icon: '🏴‍☠️', description: 'Navega os sete mares livre.' },
  { id: 't-2', name: 'Espadachim', color: '#2ecc71', icon: '⚔️', description: 'Mestre das lâminas.' },
  { id: 't-3', name: 'Rei dos Piratas', color: '#FFD700', icon: '👑', description: 'O maior pirata de todos.' },
  { id: 't-4', name: 'Caçador', color: '#e74c3c', icon: '🎯', description: 'Caça recompensas pelo mundo.' },
  { id: 't-5', name: 'Explorador', color: '#3498db', icon: '🗺️', description: 'Desbravador de terras desconhecidas.' },
  { id: 't-6', name: 'Médico', color: '#1abc9c', icon: '🌸', description: 'Cura os feridos da tripulação.' },
  { id: 't-7', name: 'Navegadora', color: '#9b59b6', icon: '🧭', description: 'Guia o navio pelos mares.' },
  { id: 't-8', name: 'Atirador', color: '#e67e22', icon: '🎸', description: 'Pontaria perfeita.' },
];

const initialIslands = [
  { id: 'is-01', name: 'East Blue', sea: 'East Blue', x: 15, y: 30, emoji: '🌊', danger: 2, description: 'Mar tranquilo, mas cheio de aventuras.', visits: [] },
  { id: 'is-02', name: 'Loguetown', sea: 'East Blue', x: 35, y: 26, emoji: '🏴‍☠️', danger: 3, description: 'Cidade do início da jornada.', visits: [] },
  { id: 'is-03', name: 'Grand Line', sea: 'Grand Line', x: 55, y: 40, emoji: '⛵', danger: 5, description: 'O mar mais perigoso e cheio de mistérios.', visits: [] },
  { id: 'is-04', name: 'Skypiea', sea: 'Grand Line', x: 68, y: 18, emoji: '☁️', danger: 6, description: 'Ilha no céu repleta de lendas.', visits: [] },
  { id: 'is-05', name: 'New World', sea: 'New World', x: 80, y: 60, emoji: '🦑', danger: 8, description: 'O último trecho antes do One Piece.', visits: [] },
];

const initialState = {
  characters: initialCharacters,
  achievements: initialAchievements,
  titles: initialTitles,
  islands: initialIslands,
};

function loadState() {
  try {
    const raw = localStorage.getItem('one-piece-game');
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn('Não foi possível carregar o estado do jogo', error);
  }
  return initialState;
}

function saveState(state) {
  try {
    localStorage.setItem('one-piece-game', JSON.stringify(state));
  } catch (error) {
    console.warn('Não foi possível salvar o estado do jogo', error);
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.payload };
    case 'set-characters':
      return { ...state, characters: action.payload };
    case 'set-achievements':
      return { ...state, achievements: action.payload };
    case 'set-titles':
      return { ...state, titles: action.payload };
    case 'set-islands':
      return { ...state, islands: action.payload };
    case 'ADD_ISLAND':
      return { ...state, islands: [...state.islands, { ...action.payload, id: action.payload.id || `is-${Date.now()}` }] };
    case 'MARK_ISLAND_VISIT': {
      const { charId, islandId, note, rating } = action.payload;
      const updated = state.characters.map(char => {
        if (char.id === charId) {
          const visits = char.islandVisits || [];
          const existingVisit = visits.find(v => v.islandId === islandId);
          if (existingVisit) {
            return {
              ...char,
              islandVisits: visits.map(v => v.islandId === islandId ? { islandId, note, rating } : v)
            };
          }
          return { ...char, islandVisits: [...visits, { islandId, note, rating }] };
        }
        return char;
      });
      return { ...state, characters: updated };
    }
    case 'DELETE_ISLAND':
      return { ...state, islands: state.islands.filter(island => island.id !== action.payload) };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const actions = useMemo(() => ({
    setCharacters: (characters) => dispatch({ type: 'set-characters', payload: characters }),
    setAchievements: (achievements) => dispatch({ type: 'set-achievements', payload: achievements }),
    setTitles: (titles) => dispatch({ type: 'set-titles', payload: titles }),
    setIslands: (islands) => dispatch({ type: 'set-islands', payload: islands }),
    addXP: (charId, amount) => {
      const next = state.characters.map((item) =>
        item.id === charId ? { ...item, xp: item.xp + amount } : item,
      );
      dispatch({ type: 'set-characters', payload: next });
    },
    addCharacter: (character) => {
      const next = [...state.characters, { ...character, id: Date.now(), level: 1, xp: 0, titles: [], achievements: [], islandVisits: [] }];
      dispatch({ type: 'set-characters', payload: next });
    },
    deleteCharacter: (charId) => {
      const next = state.characters.filter((item) => item.id !== charId);
      dispatch({ type: 'set-characters', payload: next });
    },
    updateBounty: (charId, bounty) => {
      const next = state.characters.map((item) => item.id === charId ? { ...item, bounty } : item);
      dispatch({ type: 'set-characters', payload: next });
    },
    addAchievement: (achievement) => {
      const next = [...state.achievements, { ...achievement, id: `ach-${Date.now()}`, completedBy: [], active: true }];
      dispatch({ type: 'set-achievements', payload: next });
    },
    toggleAchievementCompletion: (achId, charId) => {
      const next = state.achievements.map((ach) => {
        if (ach.id !== achId) return ach;
        const completedBy = ach.completedBy.includes(charId)
          ? ach.completedBy.filter((id) => id !== charId)
          : [...ach.completedBy, charId];
        return { ...ach, completedBy };
      });
      dispatch({ type: 'set-achievements', payload: next });
    },
    deleteAchievement: (achId) => {
      const next = state.achievements.filter((ach) => ach.id !== achId);
      dispatch({ type: 'set-achievements', payload: next });
    },
    addTitle: (title) => {
      const next = [...state.titles, { ...title, id: `t-${Date.now()}` }];
      dispatch({ type: 'set-titles', payload: next });
    },
    deleteTitle: (titleId) => {
      const nextTitles = state.titles.filter((title) => title.id !== titleId);
      const deletedTitle = state.titles.find((title) => title.id === titleId)?.name;
      const nextCharacters = state.characters.map((character) => ({
        ...character,
        titles: deletedTitle ? character.titles.filter((title) => title !== deletedTitle) : character.titles,
      }));
      dispatch({ type: 'set-titles', payload: nextTitles });
      dispatch({ type: 'set-characters', payload: nextCharacters });
    },
    assignTitle: (titleName, charId) => {
      const next = state.characters.map((item) =>
        item.id === charId && !item.titles.includes(titleName)
          ? { ...item, titles: [...item.titles, titleName] }
          : item,
      );
      dispatch({ type: 'set-characters', payload: next });
    },
    removeTitleFromChar: (titleName, charId) => {
      const next = state.characters.map((item) =>
        item.id === charId ? { ...item, titles: item.titles.filter((title) => title !== titleName) } : item,
      );
      dispatch({ type: 'set-characters', payload: next });
    },
    addIsland: (island) => {
      const next = [...state.islands, { ...island, id: `is-${Date.now()}`, visits: [] }];
      dispatch({ type: 'set-islands', payload: next });
    },
    markIslandVisit: (islandId, visit) => {
      const next = state.islands.map((island) =>
        island.id === islandId
          ? { ...island, visits: [...island.visits, visit] }
          : island,
      );
      dispatch({ type: 'set-islands', payload: next });
    },
  }), [state]);

  const value = useMemo(() => ({ state, actions, dispatch }), [state, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
