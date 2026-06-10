import { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_THEME = {
  primary: '#F5C518',
  primaryDark: '#D4A017',
  bgDark: '#0A0A0A',
  bgCard: '#111111',
  bgSection: '#0E0E0E',
};

const PRESETS = {
  gold:   { primary: '#F5C518', primaryDark: '#D4A017', bgDark: '#0A0A0A', bgCard: '#111111', bgSection: '#0E0E0E' },
  red:    { primary: '#FF1744', primaryDark: '#C62828', bgDark: '#0A0000', bgCard: '#110000', bgSection: '#0E0000' },
  blue:   { primary: '#00C2FF', primaryDark: '#0090CC', bgDark: '#00050A', bgCard: '#000B11', bgSection: '#00080E' },
  purple: { primary: '#B14EFF', primaryDark: '#8B2FCC', bgDark: '#05000A', bgCard: '#0A0011', bgSection: '#08000E' },
};

const ThemeContext = createContext(null);

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function applyThemeToDom(theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--primary-rgb', hexToRgb(theme.primary));
  root.style.setProperty('--bg-dark', theme.bgDark);
  root.style.setProperty('--bg-card', theme.bgCard);
  root.style.setProperty('--bg-section', theme.bgSection);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('amigo_theme');
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    applyThemeToDom(theme);
    localStorage.setItem('amigo_theme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (updates) => setTheme(prev => ({ ...prev, ...updates }));
  const applyPreset = (name) => setTheme(PRESETS[name] ?? DEFAULT_THEME);
  const resetTheme = () => setTheme(DEFAULT_THEME);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, applyPreset, resetTheme, PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
