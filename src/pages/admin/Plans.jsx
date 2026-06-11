import { useState } from 'react';
import { Plus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import './PageShared.css';

const StatusBadge = ({ status }) => (
  <span className={`badge badge--${status === 'Active' ? 'green' : 'gray'}`}>{status}</span>
);

const BLANK = { name: '', price: '', duration: '', description: '', perks: '', status: 'Active' };

const SAMPLE = [
  { id: 1, name: 'Monthly',     price: '₱800',   duration: '30 days',  description: 'Standard monthly access',       perks: 'All equipment access',                  status: 'Active',   is_deleted: 0 },
  { id: 2, name: 'Quarterly',   price: '₱2,100', duration: '90 days',  description: '3-month package (save 12%)',    perks: 'All equipment + 1 PT session',          status: 'Active',   is_deleted: 0 },
  { id: 3, name: 'Semi-Annual', price: '₱3,800', duration: '180 days', description: '6-month package (save 20%)',    perks: 'All equipment + 3 PT sessions',         status: 'Active',   is_deleted: 0 },
  { id: 4, name: 'Annual',      price: '₱6,500', duration: '365 days', description: 'Best value full year',          perks: 'All equipment + 6 PT sessions + locker', status: 'Active',  is_deleted: 0 },
  { id: 5, name: 'Student',     price: '₱600',   duration: '30 days',  description: 'For valid student ID holders',  perks: 'All equipment access (off-peak)',        status: 'Active',   is_deleted: 0 },
  { id: 6, name: 'Day Pass',    price: '₱150',   duration: '1 day',    description: 'Walk-in single day access',     perks: 'Full equipment access',                 status: 'Active',   is_deleted: 0 },
  { id: 7, name: 'Couples',     price: '₱1,400', duration: '30 days',  description: 'For 2 persons',                perks: 'All equipment access for 2',             status: 'Active',   is_deleted: 0 },
  { id: 8, name: 'Old Plan',    price: '₱700',   duration: '30 days',  description: 'Deprecated plan',              perks: 'Basic access',                           status: 'Archived', is_deleted: 1 },
];

const COLS = [
  { key: 'name',        label: 'Plan Name',   render: (v) => <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{v}</span> },
  { key: 'price',       label: 'Price',       render: (v) => <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{v}</span> },
  { key: 'duration',    label: 'Duration' },
  { key: 'description', label: 'Description', render: (v) => <span style={{ fontSize: '0.75rem' }}>{v}</span> },
  { key: 'perks',       label: 'Perks',       render: (v) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v}</span> },
  { key: 'status',      label: 'Status',      sortable: false, render: (v) => <StatusBadge status={v} /> },
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

export default function Plans() {
  const [data, setData]               = useState(SAMPLE);
  const [showDeleted, setShowDeleted] = useState(false);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editRow, setEditRow]         = useState(null);
  const [form, setForm]               = useState(BLANK);
  const [delRow, setDelRow]           = useState(null);

  const isEdit  = editRow !== null;
  const visible = data.filter(r => showDeleted ? r.is_deleted : !r.is_deleted);
  const delName = delRow ? delRow.name : '';

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
  const handleRestore = (row) => setData(d => d.map(r => r.id === row.id ? { ...r, is_deleted: 0 } : r));

  return (
    <div className="pm">
      <div className="pm-header">
        <div>
          <h1 className="pm-title">Plans</h1>
          <p className="pm-sub">Manage membership plans and pricing</p>
        </div>
        <div className="pm-header__actions">
          <button className="pm-toggle" onClick={() => setShowDeleted(v => !v)}>
            {showDeleted ? <ToggleRight size={16} color="var(--primary)" /> : <ToggleLeft size={16} />}
            <span>{showDeleted ? 'Showing Archived' : 'Show Archived'}</span>
          </button>
          <button className="pm-btn-add" onClick={openAdd}>
            <Plus size={14} /> Add Plan
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
              <h2>{isEdit ? 'Edit Plan' : 'Add Plan'}</h2>
              <button className="pm-modal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <div className="pm-grid-2">
                <FormField label="Plan Name *"        name="name"     value={form.name}     onChange={handleChange} />
                <FormField label="Price (e.g. ₱800)"  name="price"    value={form.price}    onChange={handleChange} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Duration (e.g. 30 days)" name="duration" value={form.duration} onChange={handleChange} />
                <FormField label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'Archived']} />
              </div>
              <FormField label="Description"       name="description" value={form.description} onChange={handleChange} />
              <FormField label="Perks / Inclusions" name="perks"      value={form.perks}       onChange={handleChange} />
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="pm-btn-save" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Plan'}</button>
            </div>
          </div>
        </div>
      )}

      {delRow && (
        <div className="pm-modal-bg" onClick={() => setDelRow(null)}>
          <div className="pm-modal pm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="pm-modal__head">
              <h2>Archive Plan</h2>
              <button className="pm-modal__close" onClick={() => setDelRow(null)}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <p className="pm-confirm-text">Archive the <strong>{delName}</strong> plan? Existing memberships using it are not affected.</p>
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={() => setDelRow(null)}>Cancel</button>
              <button className="pm-btn-delete" onClick={confirmDelete}>Yes, Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
