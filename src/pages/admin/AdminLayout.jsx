import { useState, useEffect, Component } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, ClipboardList,
  CreditCard, LogOut, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import logo from '../../assets/amigo.png';
import './AdminLayout.css';

class PageErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, color: '#ef4444', fontFamily: 'monospace', fontSize: 13 }}>
          <strong>Page Error:</strong>
          <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const NAV = [
  { label: 'Dashboard',  Icon: LayoutDashboard, to: '/admin' },
  { label: 'Members',    Icon: Users,            to: '/admin/members' },
  { label: 'Employees',  Icon: UserCheck,        to: '/admin/employees' },
  { label: 'Plans',      Icon: ClipboardList,    to: '/admin/plans' },
  { label: 'Payments',   Icon: CreditCard,       to: '/admin/payments' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('amigo_admin')) navigate('/login', { replace: true });
  }, []);

  const logout = () => {
    localStorage.removeItem('amigo_admin');
    navigate('/login', { replace: true });
  };

  return (
    <div className={`al ${collapsed ? 'al--col' : ''}`}>

      {/* ---- Sidebar ---- */}
      <aside className={`al-side ${mobileOpen ? 'al-side--open' : ''}`}>
        <div className="al-side__head">
          <img src={logo} alt="Amigo's" className="al-side__logo" />
          {!collapsed && <span className="al-side__brand">AMIGO&apos;S</span>}
          <button className="al-side__toggle" onClick={() => setCollapsed(v => !v)}>
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        <nav className="al-side__nav">
          {!collapsed && <span className="al-side__group-label">MAIN MENU</span>}
          {NAV.map(({ label, Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `al-nav ${isActive ? 'al-nav--active' : ''}`}
            >
              <Icon size={15} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="al-side__foot">
          <button className="al-nav al-nav--logout" onClick={logout}>
            <LogOut size={15} strokeWidth={1.8} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ---- Main area ---- */}
      <div className="al-main">
        <header className="al-topbar">
          <button className="al-topbar__hamburger" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="al-topbar__right">
            <a href="/" className="al-topbar__site-link" target="_blank" rel="noreferrer">
              View Site
            </a>
            <div className="al-topbar__avatar">A</div>
          </div>
        </header>

        <main className="al-content">
          <PageErrorBoundary>
            <Outlet />
          </PageErrorBoundary>
        </main>
      </div>

      {mobileOpen && <div className="al-overlay" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}
