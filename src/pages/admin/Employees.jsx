import { useState } from 'react';
import { UserPlus, X, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import './PageShared.css';

const STATUS_MAP = { Active: 'green', 'On Leave': 'gold', Resigned: 'red' };
const StatusBadge = ({ status }) => (
  <span className={`badge badge--${STATUS_MAP[status] || 'gray'}`}>{status}</span>
);

const ROLES    = ['Trainer', 'Front Desk', 'Cashier', 'Janitor', 'Branch Manager', 'Nutritionist'];
const BRANCHES = ['Kamias', 'Branch 2', 'Branch 3', 'Branch 4', 'Branch 5', 'Branch 6', 'Branch 7'];
const BLANK    = { name: '', role: 'Trainer', branch: 'Kamias', contact: '', hired: '', salary: '', status: 'Active' };

const SAMPLE = [
  { id: 1, name: 'Ricardo Mendez',  role: 'Branch Manager', branch: 'Kamias', contact: '+63 912 111 2222', hired: '2021-03-01', salary: '₱28,000', status: 'Active',   is_deleted: 0 },
  { id: 2, name: 'Janet Cruz',      role: 'Front Desk',     branch: 'Kamias', contact: '+63 913 222 3333', hired: '2022-01-15', salary: '₱18,000', status: 'Active',   is_deleted: 0 },
  { id: 3, name: 'Bryan Soriano',   role: 'Trainer',        branch: 'Kamias', contact: '+63 914 333 4444', hired: '2022-06-01', salary: '₱22,000', status: 'Active',   is_deleted: 0 },
  { id: 4, name: 'Lorna Castillo',  role: 'Cashier',        branch: 'Kamias', contact: '+63 915 444 5555', hired: '2023-02-10', salary: '₱16,500', status: 'Active',   is_deleted: 0 },
  { id: 5, name: 'Dennis Valdez',   role: 'Trainer',        branch: 'Kamias', contact: '+63 916 555 6666', hired: '2022-09-01', salary: '₱22,000', status: 'On Leave', is_deleted: 0 },
  { id: 6, name: 'Cecile Navarro',  role: 'Nutritionist',   branch: 'Kamias', contact: '+63 917 666 7777', hired: '2023-05-20', salary: '₱24,000', status: 'Active',   is_deleted: 0 },
  { id: 7, name: 'Felix Ramos',     role: 'Janitor',        branch: 'Kamias', contact: '+63 918 777 8888', hired: '2021-08-01', salary: '₱14,000', status: 'Active',   is_deleted: 0 },
  { id: 8, name: 'Former Employee', role: 'Trainer',        branch: 'Kamias', contact: '+63 919 888 9999', hired: '2020-01-01', salary: '₱20,000', status: 'Resigned', is_deleted: 1 },
];

const COLS = [
  { key: 'name',    label: 'Name',    render: (v) => <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{v}</span> },
  { key: 'role',    label: 'Role',    render: (v) => <span className="badge badge--purple">{v}</span> },
  { key: 'branch',  label: 'Branch' },
  { key: 'contact', label: 'Contact' },
  { key: 'hired',   label: 'Hired',   render: (v) => <span style={{ fontSize: '0.75rem' }}>{v}</span> },
  { key: 'salary',  label: 'Salary' },
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

export default function Employees() {
  const [data, setData]       = useState(SAMPLE);
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
          <h1 className="pm-title">Employees</h1>
          <p className="pm-sub">Manage staff across all branches</p>
        </div>
        <div className="pm-header__actions">
          <button className="pm-toggle" onClick={() => setShowDeleted(v => !v)}>
            {showDeleted ? <ToggleRight size={16} color="var(--primary)" /> : <ToggleLeft size={16} />}
            <span>{showDeleted ? 'Showing Deleted' : 'Show Deleted'}</span>
          </button>
          <button className="pm-btn-add" onClick={openAdd}>
            <UserPlus size={14} /> Add Employee
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
              <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
              <button className="pm-modal__close" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <div className="pm-grid-2">
                <FormField label="Full Name *"    name="name"    value={form.name}    onChange={handleChange} />
                <FormField label="Contact Number" name="contact" value={form.contact} onChange={handleChange} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Role"   name="role"   value={form.role}   onChange={handleChange} options={ROLES} />
                <FormField label="Branch" name="branch" value={form.branch} onChange={handleChange} options={BRANCHES} />
              </div>
              <div className="pm-grid-2">
                <FormField label="Hire Date"    name="hired"  type="date" value={form.hired}  onChange={handleChange} />
                <FormField label="Salary (₱)"   name="salary"             value={form.salary} onChange={handleChange} />
              </div>
              <FormField label="Status" name="status" value={form.status} onChange={handleChange} options={['Active', 'On Leave', 'Resigned']} />
            </div>
            <div className="pm-modal__foot">
              <button className="pm-btn-cancel" onClick={closeModal}>Cancel</button>
              <button className="pm-btn-save" onClick={handleSave}>{isEdit ? 'Save Changes' : 'Add Employee'}</button>
            </div>
          </div>
        </div>
      )}

      {delRow && (
        <div className="pm-modal-bg" onClick={() => setDelRow(null)}>
          <div className="pm-modal pm-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="pm-modal__head">
              <h2>Remove Employee</h2>
              <button className="pm-modal__close" onClick={() => setDelRow(null)}><X size={16} /></button>
            </div>
            <div className="pm-modal__body">
              <p className="pm-confirm-text">Mark <strong>{delName}</strong> as deleted? Their record will be kept but hidden from active lists.</p>
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
