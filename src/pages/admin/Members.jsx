import { useState } from 'react';
import { UserPlus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import './PageShared.css';

const STATUS_COLOR = { Active: 'green', 'Expiring Soon': 'gold', Expired: 'red', Frozen: 'blue' };
const StatusBadge = ({ status }) => (
  <span className={`badge badge--${STATUS_COLOR[status] || 'gray'}`}>{status}</span>
);

const PLANS    = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Student'];
const BRANCHES = ['Kamias', 'Branch 2', 'Branch 3', 'Branch 4', 'Branch 5', 'Branch 6', 'Branch 7'];
const BLANK    = { name: '', contact: '', plan: 'Monthly', branch: 'Kamias', start: '', expiry: '', status: 'Active' };

const SAMPLE = [
  { id: 1,  name: 'Juan dela Cruz',  contact: '+63 912 345 6789', plan: 'Monthly',     branch: 'Kamias', start: '2025-05-01', expiry: '2025-06-01', status: 'Expired',       is_deleted: 0 },
  { id: 2,  name: 'Maria Santos',    contact: '+63 917 234 5678', plan: 'Quarterly',   branch: 'Kamias', start: '2025-03-15', expiry: '2025-06-15', status: 'Expiring Soon', is_deleted: 0 },
  { id: 3,  name: 'Carlo Reyes',     contact: '+63 918 123 4567', plan: 'Annual',      branch: 'Kamias', start: '2025-01-10', expiry: '2026-01-10', status: 'Active',        is_deleted: 0 },
  { id: 4,  name: 'Ana Lim',         contact: '+63 919 876 5432', plan: 'Monthly',     branch: 'Kamias', start: '2025-06-01', expiry: '2025-07-01', status: 'Active',        is_deleted: 0 },
  { id: 5,  name: 'Paolo Torres',    contact: '+63 920 765 4321', plan: 'Semi-Annual', branch: 'Kamias', start: '2025-02-01', expiry: '2025-08-01', status: 'Active',        is_deleted: 0 },
  { id: 6,  name: 'Nina Cruz',       contact: '+63 921 654 3210', plan: 'Monthly',     branch: 'Kamias', start: '2025-05-13', expiry: '2025-06-13', status: 'Expiring Soon', is_deleted: 0 },
  { id: 7,  name: 'Mark Villanueva', contact: '+63 922 543 2109', plan: 'Quarterly',   branch: 'Kamias', start: '2025-03-14', expiry: '2025-06-14', status: 'Expiring Soon', is_deleted: 0 },
  { id: 8,  name: 'Lisa Gomez',      contact: '+63 923 432 1098', plan: 'Monthly',     branch: 'Kamias', start: '2025-05-15', expiry: '2025-06-15', status: 'Expiring Soon', is_deleted: 0 },
  { id: 9,  name: 'Renz Dela Vega',  contact: '+63 924 321 0987', plan: 'Monthly',     branch: 'Kamias', start: '2025-05-16', expiry: '2025-06-16', status: 'Expiring Soon', is_deleted: 0 },
  { id: 10, name: 'Kim Andres',      contact: '+63 925 210 9876', plan: 'Annual',      branch: 'Kamias', start: '2024-12-01', expiry: '2025-12-01', status: 'Active',        is_deleted: 0 },
  { id: 11, name: 'Jose Bautista',   contact: '+63 926 109 8765', plan: 'Monthly',     branch: 'Kamias', start: '2025-05-12', expiry: '2025-06-12', status: 'Expiring Soon', is_deleted: 0 },
  { id: 12, name: 'Grace Fernandez', contact: '+63 927 098 7654', plan: 'Student',     branch: 'Kamias', start: '2025-06-01', expiry: '2025-07-01', status: 'Active',        is_deleted: 0 },
  { id: 13, name: 'Deleted Member',  contact: '+63 928 987 6543', plan: 'Monthly',     branch: 'Kamias', start: '2025-04-01', expiry: '2025-05-01', status: 'Expired',       is_deleted: 1 },
];

const COLS = [
  { key: 'name',    label: 'Name',    render: (v) => <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span> },
  { key: 'contact', label: 'Contact' },
  { key: 'plan',    label: 'Plan',    render: (v) => <span className="badge badge--blue">{v}</span> },
  { key: 'branch',  label: 'Branch' },
  { key: 'start',   label: 'Start',   render: (v) => <span style={{ fontSize: '0.75rem' }}>{v}</span> },
  { key: 'expiry',  label: 'Expiry',  render: (v) => <span style={{ fontSize: '0.75rem' }}>{v}</span> },
  { key: 'status',  label: 'Status',  sortable: false, render: (v) => <StatusBadge status={v} /> },
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

export default function Members() {
  const [data, setData] = useState(SAMPLE);
  const [showDeleted, setShowDeleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow]     = useState(null);
  const [form, setForm]           = useState(BLANK);
  const [delRow, setDelRow]       = useState(null);

  const isEdit = editRow !== null;
  const visible = data.filter(r => showDeleted ? r.is_deleted : !r.is_deleted);

  const openAdd  = () => { setForm(BLANK); setEditRow(null); setModalOpen(true); };
  const openEdit = (row) => { setForm({ ...row }); setEditRow(row); setModalOpen(true); };
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
  const handleRestore = (row) => setData(d => d.map(r => r.id === row.id ? { ...r, is_deleted: 0 } : r));

  const delName = delRow ? delRow.name : '';

  return (
    <div className="pm">
      <div className="pm-header">
        <div>
          <h1 className="pm-title">Members</h1>
          <p className="pm-sub">Manage gym memberships and renewals</p>
        </div>
        <div className="pm-header__actions">
          <button className="pm-toggle" onClick={() => setShowDeleted(v => !v)}>
            {showDeleted ? <ToggleRight size={16} color="var(--primary)" /> : <ToggleLeft size={16} />}
            <span>{showDeleted ? 'Showing Deleted' : 'Show Deleted'}</span>
          </button>
          <button className="pm-btn-add" onClick={openAdd}>
            <UserPlus size={14} /> Add Member
          </button>
        </div>
      </div>

      <div className="pm-card">
        <AdminTable columns={COLS} data={visible} onEdit={openEdit} onDelete={handleDelete} onRestore={handleRestore} />
      </div>

      {modalOpen && (
        <div className="pm-modal-bg" onClick={closeModal}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-modal__head">
              <h2>{isEdit ? 'Edit Member' : 'Add Member'}</h2>
              <button className="pm-modal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <div className="pm-grid-2">
                <FormField label="Full Name *"      name="name"    value={form.name}    onChange={handleChange} />
                <FormField label="Contact Number *" name="contact" value={form.contact} onChange={handleChange} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Plan"   name="plan"   value={form.plan}   onChange={handleChange} options={PLANS} />
                <FormField label="Branch" name="branch" value={form.branch} onChange={handleChange} options={BRANCHES} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Start Date"  name="start"  type="date" value={form.start}  onChange={handleChange} />
                <FormField label="Expiry Date" name="expiry" type="date" value={form.expiry} onChange={handleChange} />
              </div>
              <FormField label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'Expiring Soon', 'Expired', 'Frozen']} />
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="pm-btn-save" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}

      {delRow && (
        <div className="pm-modal-bg" onClick={() => setDelRow(null)}>
          <div className="pm-modal pm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="pm-modal__head">
              <h2>Remove Member</h2>
              <button className="pm-modal__close" onClick={() => setDelRow(null)}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <p className="pm-confirm-text">Mark <strong>{delName}</strong> as deleted? The record will be kept but hidden from active lists.</p>
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={() => setDelRow(null)}>Cancel</button>
              <button className="pm-btn-delete" onClick={confirmDelete}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
