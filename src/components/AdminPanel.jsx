import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import './AdminPanel.css';

const PRESET_LIST = [
  { key: 'gold',   label: 'Gold',   color: '#F5C518' },
  { key: 'red',    label: 'Red Fire', color: '#FF1744' },
  { key: 'blue',   label: 'Ice Blue', color: '#00C2FF' },
  { key: 'purple', label: 'Royal', color: '#B14EFF' },
];

const BG_PRESETS = [
  { value: '#0A0A0A', label: 'Black' },
  { value: '#0D0D12', label: 'Midnight' },
  { value: '#0D1B2A', label: 'Dark Navy' },
  { value: '#100D0A', label: 'Dark Smoke' },
];

export default function AdminPanel() {
  const { theme, updateTheme, applyPreset, resetTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`admin-toggle ${open ? 'admin-toggle--open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Theme Settings"
        title="Theme Settings"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      <div className={`admin-panel ${open ? 'admin-panel--open' : ''}`}>
        <div className="admin-panel__header">
          <div>
            <div className="admin-panel__title">Theme Settings</div>
            <div className="admin-panel__sub">Customize the site&apos;s color scheme</div>
          </div>
          <button className="admin-panel__close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        </div>

        {/* Presets */}
        <div className="admin-section">
          <div className="admin-section__label">Quick Presets</div>
          <div className="admin-presets">
            {PRESET_LIST.map(p => (
              <button
                key={p.key}
                className={`admin-preset ${theme.primary === p.color ? 'admin-preset--active' : ''}`}
                style={{ '--preset-color': p.color }}
                onClick={() => applyPreset(p.key)}
              >
                <span className="admin-preset__swatch" style={{ background: p.color }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-divider" />

        {/* Primary Color */}
        <div className="admin-section">
          <div className="admin-section__label">
            Primary / Accent Color
            <span className="admin-hex">{theme.primary.toUpperCase()}</span>
          </div>
          <div className="admin-color-row">
            <input
              type="color"
              className="admin-color-input"
              value={theme.primary}
              onChange={e => updateTheme({ primary: e.target.value, primaryDark: e.target.value })}
            />
            <div className="admin-color-dots">
              {['#F5C518','#FF1744','#00C2FF','#B14EFF','#00E676','#FF6B35'].map(c => (
                <button
                  key={c}
                  className="admin-color-dot"
                  style={{ background: c, outline: theme.primary === c ? `2px solid #fff` : 'none' }}
                  onClick={() => updateTheme({ primary: c, primaryDark: c })}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Background Color */}
        <div className="admin-section">
          <div className="admin-section__label">
            Background Color
            <span className="admin-hex">{theme.bgDark.toUpperCase()}</span>
          </div>
          <div className="admin-bg-presets">
            {BG_PRESETS.map(b => (
              <button
                key={b.value}
                className={`admin-bg-btn ${theme.bgDark === b.value ? 'admin-bg-btn--active' : ''}`}
                onClick={() => updateTheme({ bgDark: b.value, bgCard: b.value + '0D', bgSection: b.value + '05' })}
              >
                <span className="admin-bg-swatch" style={{ background: b.value }} />
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-divider" />

        <button className="admin-reset" onClick={resetTheme}>
          ↺ Reset to Default (Gold)
        </button>
      </div>

      {/* Backdrop */}
      {open && <div className="admin-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
