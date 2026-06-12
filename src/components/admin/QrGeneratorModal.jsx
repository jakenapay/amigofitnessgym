import { useState } from 'react';
import QRCode from 'qrcode';
import { X, Search, Download, QrCode, RotateCcw } from 'lucide-react';
import '../../pages/admin/PageShared.css';
import './QrGeneratorModal.css';

function memberToken(member) {
  return `AMIGO-${String(member.id).padStart(3, '0')}`;
}

export default function QrGeneratorModal({ members, onClose }) {
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState(null);
  const [listOpen, setListOpen]       = useState(false);
  const [qrDataUrl, setQrDataUrl]     = useState('');
  const [generating, setGenerating]   = useState(false);

  const filtered = search.trim()
    ? members.filter(m => m.name.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 8)
    : [];

  // React Compiler safety — never access .property on null in JSX
  const selName  = selected ? selected.name  : '';
  const selToken = selected ? memberToken(selected) : '';
  const selPlan  = selected ? selected.plan  : '';
  const hasQr    = qrDataUrl.length > 0;

  const pickMember = (m) => {
    setSelected(m);
    setSearch(m.name);
    setListOpen(false);
    setQrDataUrl('');
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setListOpen(true);
    // Clear selection if user is typing a different name
    if (selected && val !== selected.name) {
      setSelected(null);
      setQrDataUrl('');
    }
  };

  const generate = async () => {
    if (!selected) return;
    setGenerating(true);
    try {
      const url = await QRCode.toDataURL(memberToken(selected), {
        width: 260,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      setQrDataUrl(url);
    } catch { /* ignore */ }
    setGenerating(false);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${selName.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setSelected(null);
    setSearch('');
    setQrDataUrl('');
    setListOpen(false);
  };

  return (
    <div className="pm-modal-bg" onClick={onClose}>
      <div className="pm-modal pm-modal--qrgen" onClick={e => e.stopPropagation()}>

        <div className="pm-modal__head">
          <h2>Generate Member QR Code</h2>
          <button className="pm-modal__close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="pm-modal__body">

          {/* ── Search ── */}
          <div className="qrg-search-wrap">
            <label className="pm-label">Search Member</label>
            <div className="qrg-search-field">
              <Search size={13} className="qrg-search-icon" />
              <input
                className="pm-input qrg-search-input"
                placeholder="Type member name..."
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search.trim() && setListOpen(true)}
                onBlur={() => setTimeout(() => setListOpen(false), 150)}
                autoFocus
              />
            </div>

            {listOpen && filtered.length > 0 && (
              <ul className="qrg-dropdown">
                {filtered.map(m => (
                  <li
                    key={m.id}
                    className={`qrg-dropdown__item ${selected && selected.id === m.id ? 'qrg-dropdown__item--active' : ''}`}
                    onMouseDown={() => pickMember(m)}
                  >
                    <span className="qrg-dropdown__name">{m.name}</span>
                    <span className="badge badge--blue" style={{ fontSize: '0.6rem' }}>{m.plan}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Selected member pill ── */}
          {selected && (
            <div className="qrg-selected">
              <div className="qrg-selected__info">
                <span className="qrg-selected__name">{selName}</span>
                <span className="qrg-selected__token">{selToken}</span>
              </div>
              <span className="badge badge--blue">{selPlan}</span>
            </div>
          )}

          {/* ── Generate button (before QR is shown) ── */}
          {selected && !hasQr && (
            <button
              className="pm-btn-save qrg-gen-btn"
              onClick={generate}
              disabled={generating}
            >
              <QrCode size={14} />
              {generating ? 'Generating…' : 'Generate QR Code'}
            </button>
          )}

          {/* ── QR result ── */}
          {hasQr && (
            <div className="qrg-result">
              <div className="qrg-result__card">
                <img src={qrDataUrl} alt={`QR for ${selName}`} className="qrg-result__img" />
                <div className="qrg-result__caption">
                  <span className="qrg-result__member">{selName}</span>
                  <span className="qrg-result__token">{selToken}</span>
                </div>
              </div>

              <div className="qrg-result__actions">
                <button className="pm-btn-save qrg-download-btn" onClick={download}>
                  <Download size={14} /> Download PNG
                </button>
                <button className="pm-btn-cancel qrg-reset-btn" onClick={reset}>
                  <RotateCcw size={13} /> Generate Another
                </button>
              </div>
            </div>
          )}

        </div>

        <div className="pm-modal__foot">
          <button className="pm-btn-cancel" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
