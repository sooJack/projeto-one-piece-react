import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Background from './components/Background';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Cartazes from './pages/Cartazes';
import Ranking from './pages/Ranking';
import Conquistas from './pages/Conquistas';
import Titulos from './pages/Titulos';
import Mapa from './pages/Mapa';
import Mestre from './pages/Mestre';
import './index.css';

function RouterWrapper() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/cartazes" element={<PageTransition><Cartazes /></PageTransition>} />
        <Route path="/ranking" element={<PageTransition><Ranking /></PageTransition>} />
        <Route path="/conquistas" element={<PageTransition><Conquistas /></PageTransition>} />
        <Route path="/titulos" element={<PageTransition><Titulos /></PageTransition>} />
        <Route path="/mapa" element={<PageTransition><Mapa /></PageTransition>} />
        <Route path="/mestre" element={<PageTransition><Mestre /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AuthProvider>
      <GameProvider>
        <HashRouter>
          <Background />
          <Navbar />
          <main style={{ paddingTop: 80, minHeight: '100vh' }}>
            <RouterWrapper />
          </main>
          <AnimatePresence>
            {loading && (
              <motion.div
                className="loader-overlay"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <div className="loader-box">
                  <div className="loader-ring" />
                  <p>Carregando aventura...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </HashRouter>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
