import { useTheme } from '../../context/ThemeContext';
import { Palette, Monitor, RotateCcw } from 'lucide-react';
import './PageShared.css';
import './Settings.css';

const PRESETS = [
  { key: 'gold',   label: 'Gold',      color: '#F5C518' },
  { key: 'red',    label: 'Red Fire',  color: '#FF1744' },
  { key: 'blue',   label: 'Ice Blue',  color: '#00C2FF' },
  { key: 'purple', label: 'Royal',     color: '#B14EFF' },
];

const BG_PRESETS = [
  { value: '#0A0A0A', label: 'Black'      },
  { value: '#0D0D12', label: 'Midnight'   },
  { value: '#0D1B2A', label: 'Dark Navy'  },
  { value: '#100D0A', label: 'Dark Smoke' },
];

const ACCENT_DOTS = ['#F5C518', '#FF1744', '#00C2FF', '#B14EFF', '#00E676', '#FF6B35'];

export default function Settings() {
  const { theme, updateTheme, applyPreset, resetTheme } = useTheme();

  return (
    <div className="pm">

      {/* ── Header ── */}
      <div className="pm-header">
        <div>
          <h1 className="pm-title">Settings</h1>
          <p className="pm-sub">Customize the site appearance and color scheme</p>
        </div>
      </div>

      <div className="st-layout">

        {/* ── Theme Card ── */}
        <div className="pm-card st-card">
          <div className="st-card-head">
            <Palette size={14} />
            <span>Theme Appearance</span>
          </div>

          {/* Presets */}
          <div className="st-section">
            <div className="st-label">Quick Presets</div>
            <div className="st-presets">
              {PRESETS.map(p => (
                <button
                  key={p.key}
                  className={`st-preset ${theme.primary === p.color ? 'st-preset--active' : ''}`}
                  style={{ '--c': p.color }}
                  onClick={() => applyPreset(p.key)}
                >
                  <span className="st-preset__dot" style={{ background: p.color }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="st-divider" />

          {/* Primary color */}
          <div className="st-section">
            <div className="st-label">
              Primary / Accent Color
              <span className="st-hex">{theme.primary.toUpperCase()}</span>
            </div>
            <div className="st-color-row">
              <input
                type="color"
                className="st-color-picker"
                value={theme.primary}
                onChange={e => updateTheme({ primary: e.target.value, primaryDark: e.target.value })}
              />
              <div className="st-dots">
                {ACCENT_DOTS.map(c => (
                  <button
                    key={c}
                    className="st-dot"
                    style={{
                      background:   c,
                      outlineColor: theme.primary === c ? '#fff' : 'transparent',
                    }}
                    onClick={() => updateTheme({ primary: c, primaryDark: c })}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="st-divider" />

          {/* Background color */}
          <div className="st-section">
            <div className="st-label">
              Background Color
              <span className="st-hex">{theme.bgDark.toUpperCase()}</span>
            </div>
            <div className="st-bg-grid">
              {BG_PRESETS.map(b => (
                <button
                  key={b.value}
                  className={`st-bg-btn ${theme.bgDark === b.value ? 'st-bg-btn--active' : ''}`}
                  onClick={() => updateTheme({ bgDark: b.value, bgCard: b.value + '0D', bgSection: b.value + '05' })}
                >
                  <span className="st-bg-swatch" style={{ background: b.value }} />
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="st-divider" />

          {/* Reset */}
          <button className="st-reset" onClick={resetTheme}>
            <RotateCcw size={13} />
            Reset to Default (Gold)
          </button>
        </div>

        {/* ── Live Preview Card ── */}
        <div className="pm-card st-card">
          <div className="st-card-head">
            <Monitor size={14} />
            <span>Live Preview</span>
          </div>

          <div className="st-section">
            <div className="st-label">Current Colors</div>
            <div className="st-swatches">
              <div className="st-swatch-row">
                <div className="st-swatch" style={{ background: theme.primary }} />
                <div className="st-swatch-info">
                  <span className="st-swatch-name">Primary / Accent</span>
                  <span className="st-swatch-hex">{theme.primary.toUpperCase()}</span>
                </div>
              </div>
              <div className="st-swatch-row">
                <div className="st-swatch st-swatch--bordered" style={{ background: theme.bgDark }} />
                <div className="st-swatch-info">
                  <span className="st-swatch-name">Background</span>
                  <span className="st-swatch-hex">{theme.bgDark.toUpperCase()}</span>
                </div>
              </div>
              <div className="st-swatch-row">
                <div className="st-swatch st-swatch--bordered" style={{ background: theme.bgCard }} />
                <div className="st-swatch-info">
                  <span className="st-swatch-name">Card Surface</span>
                  <span className="st-swatch-hex">{theme.bgCard.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="st-divider" />

          <div className="st-section">
            <div className="st-label">Sample Elements</div>
            <div className="st-samples">
              <button className="pm-btn-add st-sample-btn">Primary Button</button>
              <span className="badge badge--green">Active</span>
              <span className="badge badge--gold">Expiring</span>
              <span className="badge badge--red">Expired</span>
              <span className="badge badge--blue">Plan</span>
            </div>
            <div className="st-sample-card">
              <div className="st-sample-card__bar" style={{ background: theme.primary }} />
              <div className="st-sample-card__body">
                <span className="st-sample-card__title">Sample Member Card</span>
                <span className="st-sample-card__sub">This is how your accent color looks on dark surfaces.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
