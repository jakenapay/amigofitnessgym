import { Users, UserCheck, AlertTriangle, TrendingUp, PhilippinePeso, UserPlus } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Dashboard.css';

const STATS = [
  { label: 'Active Members',    value: '189',     sub: '+12 this month',  Icon: Users,           color: '#22c55e' },
  { label: 'Expiring (7 days)', value: '12',      sub: 'Need renewal',    Icon: AlertTriangle,   color: '#f59e0b' },
  { label: 'New This Month',    value: '23',      sub: 'Enrolled',        Icon: UserPlus,        color: 'var(--primary)' },
  { label: 'Total Employees',   value: '34',      sub: '5 branches',      Icon: UserCheck,       color: '#60a5fa' },
  { label: 'Monthly Revenue',   value: '₱48,500', sub: '+₱3,200 vs last', Icon: TrendingUp,      color: '#a78bfa' },
];

const MONTHLY = [
  { month: 'Jan', members: 140 },
  { month: 'Feb', members: 158 },
  { month: 'Mar', members: 162 },
  { month: 'Apr', members: 171 },
  { month: 'May', members: 180 },
  { month: 'Jun', members: 189 },
];

const PLANS_DIST = [
  { name: 'Monthly',     value: 89,  color: '#F5C518' },
  { name: 'Quarterly',   value: 45,  color: '#a78bfa' },
  { name: 'Semi-Annual', value: 32,  color: '#60a5fa' },
  { name: 'Annual',      value: 23,  color: '#22c55e' },
];

const RECENT = [
  { name: 'Juan dela Cruz',  plan: 'Monthly',     date: 'Jun 10, 2025', branch: 'Kamias' },
  { name: 'Maria Santos',    plan: 'Quarterly',   date: 'Jun 9, 2025',  branch: 'Kamias' },
  { name: 'Carlo Reyes',     plan: 'Annual',      date: 'Jun 8, 2025',  branch: 'Kamias' },
  { name: 'Ana Lim',         plan: 'Monthly',     date: 'Jun 7, 2025',  branch: 'Kamias' },
  { name: 'Paolo Torres',    plan: 'Semi-Annual', date: 'Jun 6, 2025',  branch: 'Kamias' },
];

const EXPIRING = [
  { name: 'Jose Bautista',   plan: 'Monthly',   expiry: 'Jun 12, 2025' },
  { name: 'Nina Cruz',       plan: 'Monthly',   expiry: 'Jun 13, 2025' },
  { name: 'Mark Villanueva', plan: 'Quarterly', expiry: 'Jun 14, 2025' },
  { name: 'Lisa Gomez',      plan: 'Monthly',   expiry: 'Jun 15, 2025' },
  { name: 'Renz Dela Vega',  plan: 'Monthly',   expiry: 'Jun 16, 2025' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <p className="db-tooltip__label">{label}</p>
      <p className="db-tooltip__val">{payload[0].value} members</p>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="db">
      <div className="db-page-header">
        <div>
          <h1 className="db-page-title">Dashboard</h1>
          <p className="db-page-sub">Welcome back, Admin</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="db-stats">
        {STATS.map(({ label, value, sub, Icon, color }) => (
          <div className="db-stat" key={label}>
            <div className="db-stat__icon" style={{ '--ic': color }}>
              <Icon size={16} strokeWidth={1.75} />
            </div>
            <div>
              <div className="db-stat__val">{value}</div>
              <div className="db-stat__label">{label}</div>
              <div className="db-stat__sub">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="db-charts">
        <div className="db-card db-card--chart">
          <div className="db-card__head">
            <span className="db-card__title">Member Growth</span>
            <span className="db-card__badge">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245,197,24,0.06)' }} />
              <Bar dataKey="members" fill="#F5C518" radius={[4,4,0,0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="db-card db-card--pie">
          <div className="db-card__head">
            <span className="db-card__title">Plan Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PLANS_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                dataKey="value" paddingAngle={3}>
                {PLANS_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v + ' members', n]} contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick tables */}
      <div className="db-tables">
        <div className="db-card">
          <div className="db-card__head">
            <span className="db-card__title">Recent Enrollments</span>
          </div>
          <table className="db-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Date</th>
                <th>Branch</th>
              </tr>
            </thead>
            <tbody>
              {RECENT.map((r, i) => (
                <tr key={i}>
                  <td className="db-table__name">{r.name}</td>
                  <td><span className="db-badge db-badge--blue">{r.plan}</span></td>
                  <td className="db-table__muted">{r.date}</td>
                  <td className="db-table__muted">{r.branch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="db-card">
          <div className="db-card__head">
            <span className="db-card__title">Expiring Soon</span>
            <span className="db-card__badge db-card__badge--warn">Next 7 days</span>
          </div>
          <table className="db-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {EXPIRING.map((r, i) => (
                <tr key={i}>
                  <td className="db-table__name">{r.name}</td>
                  <td><span className="db-badge db-badge--gold">{r.plan}</span></td>
                  <td className="db-table__warn">{r.expiry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
