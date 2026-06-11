import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import './PageShared.css';

const METHOD_MAP = { Cash: 'green', GCash: 'blue', Maya: 'purple', Card: 'gold' };
const MethodBadge = ({ method }) => (
  <span className={`badge badge--${METHOD_MAP[method] || 'gray'}`}>{method}</span>
);

const PLANS = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Student', 'Day Pass', 'Couples'];
const BLANK = { member: '', plan: 'Monthly', amount: '', method: 'Cash', date: '', or_no: '' };

const SAMPLE = [
  { id: 1,  member: 'Carlo Reyes',      plan: 'Annual',      amount: '₱6,500', method: 'Cash',  date: '2025-01-10', or_no: 'OR-001', is_deleted: 0 },
  { id: 2,  member: 'Ana Lim',          plan: 'Monthly',     amount: '₱800',   method: 'GCash', date: '2025-06-01', or_no: 'OR-002', is_deleted: 0 },
  { id: 3,  member: 'Paolo Torres',     plan: 'Semi-Annual', amount: '₱3,800', method: 'Maya',  date: '2025-02-01', or_no: 'OR-003', is_deleted: 0 },
  { id: 4,  member: 'Kim Andres',       plan: 'Annual',      amount: '₱6,500', method: 'Card',  date: '2024-12-01', or_no: 'OR-004', is_deleted: 0 },
  { id: 5,  member: 'Grace Fernandez',  plan: 'Student',     amount: '₱600',   method: 'Cash',  date: '2025-06-01', or_no: 'OR-005', is_deleted: 0 },
  { id: 6,  member: 'Maria Santos',     plan: 'Quarterly',   amount: '₱2,100', method: 'GCash', date: '2025-03-15', or_no: 'OR-006', is_deleted: 0 },
  { id: 7,  member: 'Juan dela Cruz',   plan: 'Monthly',     amount: '₱800',   method: 'Cash',  date: '2025-05-01', or_no: 'OR-007', is_deleted: 0 },
  { id: 8,  member: 'Nina Cruz',        plan: 'Monthly',     amount: '₱800',   method: 'GCash', date: '2025-05-13', or_no: 'OR-008', is_deleted: 0 },
  { id: 9,  member: 'Mark Villanueva',  plan: 'Quarterly',   amount: '₱2,100', method: 'Maya',  date: '2025-03-14', or_no: 'OR-009', is_deleted: 0 },
  { id: 10, member: 'Renz Dela Vega',   plan: 'Monthly',     amount: '₱800',   method: 'Cash',  date: '2025-05-16', or_no: 'OR-010', is_deleted: 0 },
];

const COLS = [
  { key: 'or_no',  label: 'OR #',    render: (v) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v}</span> },
  { key: 'member', label: 'Member',  render: (v) => <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span> },
  { key: 'plan',   label: 'Plan',    render: (v) => <span className="badge badge--blue">{v}</span> },
  { key: 'amount', label: 'Amount',  render: (v) => <span style={{ color: '#22c55e', fontWeight: 700 }}>{v}</span> },
  { key: 'method', label: 'Method',  sortable: false, render: (v) => <MethodBadge method={v} /> },
  { key: 'date',   label: 'Date',    render: (v) => <span style={{ fontSize: '0.75rem' }}>{v}</span> },
];

function FormField({ label, name, type = 'text', value, onChange, options }) {
  return (
    <div className="pm-field">
      <label className="pm-label">{label}</label>
      {options ? (
        <select className="pm-input" name={name} value={value} onChange={onChange}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input className="pm-input" type={type} name={name} value={value} onChange={onChange} />
      )}
    </div>
  );
}

export default function Payments() {
  const [data, setData]           = useState(SAMPLE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow]     = useState(null);
  const [form, setForm]           = useState(BLANK);
  const [delRow, setDelRow]       = useState(null);

  const isEdit  = editRow !== null;
  const visible = data.filter(r => !r.is_deleted);
  const delInfo = delRow ? `${delRow.or_no} for ${delRow.member}` : '';

  const openAdd    = () => { setForm(BLANK); setEditRow(null); setModalOpen(true); };
  const openEdit   = (row) => { setForm({ ...row }); setEditRow(row); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditRow(null); };
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!isEdit) {
      setData(d => [...d, { ...form, id: Date.now(), is_deleted: 0 }]);
    } else {
      setData(d => d.map(r => r.id === editRow.id ? { ...r, ...form } : r));
    }
    closeModal();
  };

  const handleDelete  = (row) => setDelRow(row);
  const confirmDelete = () => { setData(d => d.map(r => r.id === delRow.id ? { ...r, is_deleted: 1 } : r)); setDelRow(null); };

  return (
    <div className="pm">
      <div className="pm-header">
        <div>
          <h1 className="pm-title">Payments</h1>
          <p className="pm-sub">Track membership payment records</p>
        </div>
        <div className="pm-header__actions">
          <button className="pm-btn-add" onClick={openAdd}>
            <Plus size={14} /> Record Payment
          </button>
        </div>
      </div>

      <div className="pm-card">
        <AdminTable columns={COLS} data={visible} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      {modalOpen && (
        <div className="pm-modal-bg" onClick={closeModal}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-modal__head">
              <h2>{isEdit ? 'Edit Payment' : 'Record Payment'}</h2>
              <button className="pm-modal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <div className="pm-grid-2">
                <FormField label="Member Name *" name="member" value={form.member} onChange={handleChange} />
                <FormField label="OR Number"     name="or_no"  value={form.or_no}  onChange={handleChange} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Plan"           name="plan"   value={form.plan}   onChange={handleChange} options={PLANS} />
                <FormField label="Payment Method" name="method" value={form.method} onChange={handleChange} options={['Cash', 'GCash', 'Maya', 'Card']} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Amount (e.g. ₱800)" name="amount" value={form.amount} onChange={handleChange} />
                <FormField label="Payment Date"        name="date"   type="date" value={form.date} onChange={handleChange} />
              </div>
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="pm-btn-save" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Save Payment'}</button>
            </div>
          </div>
        </div>
      )}

      {delRow && (
        <div className="pm-modal-bg" onClick={() => setDelRow(null)}>
          <div className="pm-modal pm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="pm-modal__head">
              <h2>Delete Payment</h2>
              <button className="pm-modal__close" onClick={() => setDelRow(null)}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <p className="pm-confirm-text">Delete payment record <strong>{delInfo}</strong>? This cannot be undone.</p>
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={() => setDelRow(null)}>Cancel</button>
              <button className="pm-btn-delete" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
