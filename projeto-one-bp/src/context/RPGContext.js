// src/context/RPGContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  initialCharacters,
  initialTitles,
  initialAchievements,
  initialIslands,
  MASTER_PASSWORD,
} from "../data/initialData";

const RPGContext = createContext(null);

const STORAGE_KEYS = {
  characters: "op_rpg_characters",
  titles: "op_rpg_titles",
  achievements: "op_rpg_achievements",
  islands: "op_rpg_islands",
  siteXP: "op_rpg_site_xp",
  isMaster: "op_rpg_is_master",
};

function loadOrDefault(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// XP actions that the site tracks automatically
export const SITE_XP_ACTIONS = {
  VISIT_PAGE: { label: "Visitou uma página", xp: 5 },
  VIEW_POSTER: { label: "Viu cartaz procurado", xp: 10 },
  VIEW_ISLAND: { label: "Explorou ilha no mapa", xp: 15 },
  VIEW_ACHIEVEMENT: { label: "Viu conquista", xp: 5 },
  MARK_ISLAND: { label: "Marcou ilha visitada", xp: 25 },
};

function calcSiteLevel(totalXP) {
  // Every 200 xp = 1 level, diminishing returns after 10
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

export function RPGProvider({ children }) {
  const [characters, setCharacters] = useState(() => loadOrDefault(STORAGE_KEYS.characters, initialCharacters));
  const [titles, setTitles] = useState(() => loadOrDefault(STORAGE_KEYS.titles, initialTitles));
  const [achievements, setAchievements] = useState(() => loadOrDefault(STORAGE_KEYS.achievements, initialAchievements));
  const [islands, setIslands] = useState(() => loadOrDefault(STORAGE_KEYS.islands, initialIslands));
  const [siteXP, setSiteXP] = useState(() => loadOrDefault(STORAGE_KEYS.siteXP, 0));
  const [isMaster, setIsMaster] = useState(false);
  const [notification, setNotification] = useState(null);

  // Persist all state changes
  useEffect(() => { save(STORAGE_KEYS.characters, characters); }, [characters]);
  useEffect(() => { save(STORAGE_KEYS.titles, titles); }, [titles]);
  useEffect(() => { save(STORAGE_KEYS.achievements, achievements); }, [achievements]);
  useEffect(() => { save(STORAGE_KEYS.islands, islands); }, [islands]);
  useEffect(() => { save(STORAGE_KEYS.siteXP, siteXP); }, [siteXP]);

  const showNotif = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ── SITE XP ──────────────────────────────────────────────────────────────
  const addSiteXP = useCallback((action) => {
    const reward = SITE_XP_ACTIONS[action];
    if (!reward) return;
    setSiteXP((prev) => prev + reward.xp);
  }, []);

  const siteLevel = calcSiteLevel(siteXP);

  // ── MASTER AUTH ───────────────────────────────────────────────────────────
  const loginMaster = useCallback((password) => {
    if (password === MASTER_PASSWORD) {
      setIsMaster(true);
      showNotif("Bem-vindo, Mestre! 🏴‍☠️", "success");
      return true;
    }
    showNotif("Senha incorreta!", "error");
    return false;
  }, [showNotif]);

  const logoutMaster = useCallback(() => {
    setIsMaster(false);
    showNotif("Saiu do modo Mestre.", "info");
  }, [showNotif]);

  // ── CHARACTER CRUD ────────────────────────────────────────────────────────
  const addCharacter = useCallback((char) => {
    const newChar = {
      ...char,
      id: `char_${Date.now()}`,
      xp: char.xp || 0,
      level: char.level || 1,
      titles: char.titles || [],
      achievements: char.achievements || [],
      wantedPoster: char.wantedPoster || { alive: true, background: "#f4a261" },
    };
    setCharacters((prev) => [...prev, newChar].sort((a, b) => b.bounty - a.bounty).map((c, i) => ({ ...c, rank: i + 1 })));
    showNotif(`${char.name} adicionado!`);
  }, [showNotif]);

  const updateCharacter = useCallback((id, updates) => {
    setCharacters((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, ...updates } : c))
        .sort((a, b) => b.bounty - a.bounty)
        .map((c, i) => ({ ...c, rank: i + 1 }))
    );
    showNotif("Personagem atualizado!");
  }, [showNotif]);

  const deleteCharacter = useCallback((id) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, rank: i + 1 })));
    showNotif("Personagem removido.", "info");
  }, [showNotif]);

  // ── ACHIEVEMENT MANAGEMENT ────────────────────────────────────────────────
  const completeAchievement = useCallback((achievementId, characterId) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id !== achievementId) return a;
        if (a.completedBy.includes(characterId)) return a;
        return { ...a, completedBy: [...a.completedBy, characterId] };
      })
    );

    const ach = achievements.find((a) => a.id === achievementId);
    if (!ach) return;

    // Give XP to character
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== characterId) return c;
        const newXP = c.xp + ach.xpReward;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
        const newTitles = ach.titleReward && !c.titles.includes(ach.titleReward)
          ? [...c.titles, ach.titleReward]
          : c.titles;
        const newAch = !c.achievements.includes(achievementId)
          ? [...c.achievements, achievementId]
          : c.achievements;
        return { ...c, xp: newXP, level: newLevel, titles: newTitles, achievements: newAch };
      })
    );

    showNotif(`Conquista concluída! +${ach.xpReward} XP`);
  }, [achievements, showNotif]);

  const addAchievement = useCallback((ach) => {
    const newAch = { ...ach, id: `ach_${Date.now()}`, completedBy: [] };
    setAchievements((prev) => [...prev, newAch]);
    showNotif("Conquista adicionada!");
  }, [showNotif]);

  const deleteAchievement = useCallback((id) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    showNotif("Conquista removida.", "info");
  }, [showNotif]);

  const updateAchievement = useCallback((id, updates) => {
    setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showNotif("Conquista atualizada!");
  }, [showNotif]);

  // ── TITLE MANAGEMENT ──────────────────────────────────────────────────────
  const addTitle = useCallback((title) => {
    const newTitle = { ...title, id: `title_${Date.now()}` };
    setTitles((prev) => [...prev, newTitle]);
    showNotif("Título adicionado!");
  }, [showNotif]);

  const deleteTitle = useCallback((id) => {
    setTitles((prev) => prev.filter((t) => t.id !== id));
    showNotif("Título removido.", "info");
  }, [showNotif]);

  const updateTitle = useCallback((id, updates) => {
    setTitles((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showNotif("Título atualizado!");
  }, [showNotif]);

  // ── ISLAND MANAGEMENT ─────────────────────────────────────────────────────
  const toggleIslandVisit = useCallback((islandId, characterId) => {
    setIslands((prev) =>
      prev.map((i) => {
        if (i.id !== islandId) return i;
        const visited = i.visitedBy.includes(characterId);
        return {
          ...i,
          visitedBy: visited
            ? i.visitedBy.filter((id) => id !== characterId)
            : [...i.visitedBy, characterId],
        };
      })
    );
    addSiteXP("MARK_ISLAND");
  }, [addSiteXP]);

  const addIsland = useCallback((island) => {
    const newIsland = { ...island, id: `island_${Date.now()}`, visitedBy: [] };
    setIslands((prev) => [...prev, newIsland]);
    showNotif("Ilha adicionada!");
  }, [showNotif]);

  const deleteIsland = useCallback((id) => {
    setIslands((prev) => prev.filter((i) => i.id !== id));
    showNotif("Ilha removida.", "info");
  }, [showNotif]);

  const updateIsland = useCallback((id, updates) => {
    setIslands((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    showNotif("Ilha atualizada!");
  }, [showNotif]);

  // ── RESET DATA ────────────────────────────────────────────────────────────
  const resetAllData = useCallback(() => {
    setCharacters(initialCharacters);
    setTitles(initialTitles);
    setAchievements(initialAchievements);
    setIslands(initialIslands);
    setSiteXP(0);
    showNotif("Dados resetados para o padrão!", "info");
  }, [showNotif]);

  return (
    <RPGContext.Provider
      value={{
        characters, titles, achievements, islands,
        siteXP, siteLevel,
        isMaster,
        notification,
        loginMaster, logoutMaster,
        addSiteXP,
        addCharacter, updateCharacter, deleteCharacter,
        completeAchievement, addAchievement, deleteAchievement, updateAchievement,
        addTitle, deleteTitle, updateTitle,
        toggleIslandVisit, addIsland, deleteIsland, updateIsland,
        resetAllData,
        showNotif,
      }}
    >
      {children}
    </RPGContext.Provider>
  );
}

export function useRPG() {
  const ctx = useContext(RPGContext);
  if (!ctx) throw new Error("useRPG must be used within RPGProvider");
  return ctx;
}
