import { useState, useEffect, useCallback } from 'react';
import { QrCode, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import QrScannerModal from '../../components/admin/QrScannerModal';
import './PageShared.css';
import './CheckIn.css';

// Token → member map (mirrors the Members page sample data)
const MEMBER_TOKENS = {
  'AMIGO-001': { name: 'Juan dela Cruz',  plan: 'Monthly',     memberStatus: 'Expired' },
  'AMIGO-002': { name: 'Maria Santos',    plan: 'Quarterly',   memberStatus: 'Expiring Soon' },
  'AMIGO-003': { name: 'Carlo Reyes',     plan: 'Annual',      memberStatus: 'Active' },
  'AMIGO-004': { name: 'Ana Lim',         plan: 'Monthly',     memberStatus: 'Active' },
  'AMIGO-005': { name: 'Paolo Torres',    plan: 'Semi-Annual', memberStatus: 'Active' },
  'AMIGO-006': { name: 'Nina Cruz',       plan: 'Monthly',     memberStatus: 'Expiring Soon' },
  'AMIGO-007': { name: 'Mark Villanueva', plan: 'Quarterly',   memberStatus: 'Expiring Soon' },
  'AMIGO-008': { name: 'Lisa Gomez',      plan: 'Monthly',     memberStatus: 'Expiring Soon' },
  'AMIGO-009': { name: 'Renz Dela Vega',  plan: 'Monthly',     memberStatus: 'Expiring Soon' },
  'AMIGO-010': { name: 'Kim Andres',      plan: 'Annual',      memberStatus: 'Active' },
  'AMIGO-011': { name: 'Jose Bautista',   plan: 'Monthly',     memberStatus: 'Expiring Soon' },
  'AMIGO-012': { name: 'Grace Fernandez', plan: 'Student',     memberStatus: 'Active' },
};

function validateToken(raw) {
  // Support plain tokens and JSON payloads: {"token":"AMIGO-003"} or {"id":"AMIGO-003"}
  let resolved = raw.trim().toUpperCase();
  try {
    const parsed = JSON.parse(raw);
    resolved = String(parsed.token ?? parsed.id ?? raw).trim().toUpperCase();
  } catch { /* not JSON — use raw */ }

  const member = MEMBER_TOKENS[resolved];
  if (!member) return { granted: false, member: null, reason: 'Member not found', token: resolved };
  if (member.memberStatus === 'Expired') return { granted: false, member, reason: 'Membership expired', token: resolved };
  return { granted: true, member, reason: 'Access granted', token: resolved };
}

function nowTime() {
  return new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

const SAMPLE_LOGS = [
  { id: 1, time: '09:14:22', member: 'Carlo Reyes',    plan: 'Annual',      result: 'Granted', note: '',                   is_deleted: 0 },
  { id: 2, time: '09:11:05', member: 'Kim Andres',     plan: 'Annual',      result: 'Granted', note: '',                   is_deleted: 0 },
  { id: 3, time: '08:57:43', member: 'Juan dela Cruz', plan: 'Monthly',     result: 'Denied',  note: 'Membership expired', is_deleted: 0 },
  { id: 4, time: '08:44:18', member: 'Ana Lim',        plan: 'Monthly',     result: 'Granted', note: '',                   is_deleted: 0 },
  { id: 5, time: '08:31:09', member: 'Paolo Torres',   plan: 'Semi-Annual', result: 'Granted', note: '',                   is_deleted: 0 },
];

const LOG_COLS = [
  { key: 'time',   label: 'Time',   width: 100, render: (v) => <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.78rem' }}>{v}</span> },
  { key: 'member', label: 'Member', render: (v) => <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span> },
  { key: 'plan',   label: 'Plan',   render: (v) => <span className="badge badge--blue">{v}</span> },
  {
    key: 'result',
    label: 'Result',
    sortable: false,
    render: (v) => (
      <span className={`badge badge--${v === 'Granted' ? 'green' : 'red'}`}>{v}</span>
    ),
  },
  {
    key: 'note',
    label: 'Note',
    render: (v) => v
      ? <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{v}</span>
      : <span style={{ color: 'var(--text-muted)', opacity: 0.4 }}>—</span>,
  },
];

export default function CheckIn() {
  const [logs, setLogs]               = useState(SAMPLE_LOGS);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [toast, setToast]             = useState(null); // { type: 'success'|'error', message: '' }

  // Auto-dismiss toast after 3.5 s
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const handleScanResult = useCallback((raw) => {
    setScannerOpen(false);

    const result = validateToken(raw);

    const entry = {
      id:         Date.now(),
      time:       nowTime(),
      member:     result.member ? result.member.name : raw,
      plan:       result.member ? result.member.plan : '—',
      result:     result.granted ? 'Granted' : 'Denied',
      note:       result.granted ? '' : result.reason,
      is_deleted: 0,
    };

    // Prepend to top of log — no page reload needed
    setLogs(prev => [entry, ...prev]);

    setToast({
      type: result.granted ? 'success' : 'error',
      message: result.granted
        ? `Access Granted — ${result.member.name}`
        : `Access Denied — ${result.reason}${result.member ? ` (${result.member.name})` : ''}`,
    });
  }, []);

  // Extract before JSX so React Compiler never reads .message/.type on null
  const toastMessage = toast ? toast.message : '';
  const toastType    = toast ? toast.type    : '';

  return (
    <div className="pm">

      {/* ---- Toast ---- */}
      {toast && (
        <div className={`ci-toast ci-toast--${toastType}`} key={toastMessage}>
          <span className="ci-toast__dot">
            {toastType === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
          </span>
          <span className="ci-toast__text">{toastMessage}</span>
        </div>
      )}

      {/* ---- Header ---- */}
      <div className="pm-header">
        <div>
          <h1 className="pm-title">Check-In</h1>
          <p className="pm-sub">Scan member QR codes to log gym entry</p>
        </div>
        <button className="pm-btn-add" onClick={() => setScannerOpen(true)}>
          <QrCode size={14} /> Scan Entry
        </button>
      </div>

      {/* ---- Access Log ---- */}
      <div className="pm-card">
        <div className="ci-log-header">
          <Clock size={13} />
          <span>Access Log — Today</span>
          <span className="ci-log-count">{logs.length} entries</span>
        </div>
        <AdminTable columns={LOG_COLS} data={logs} readOnly />
      </div>

      {/* ---- Scanner Modal ---- */}
      {scannerOpen && (
        <QrScannerModal
          onResult={handleScanResult}
          onClose={() => setScannerOpen(false)}
        />
      )}

    </div>
  );
}
