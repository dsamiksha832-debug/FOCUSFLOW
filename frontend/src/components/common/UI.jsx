import { Link, NavLink } from 'react-router-dom';

export const Button = ({ children, variant = 'primary', className = '', ...p }) => (
  <button className={`button ${variant} ${className}`} {...p}>
    {children}
  </button>
);

export const Progress = ({ value = 60 }) => (
  <div className="progress">
    <i style={{ width: `${value}%` }} />
  </div>
);

export const Heading = ({ eyebrow, title, action }) => (
  <div className="heading">
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </div>
    {action}
  </div>
);

export const Card = ({ children, className = '' }) => (
  <section className={`card ${className}`}>{children}</section>
);

const nav = [
  ['/dashboard', '⌂', 'Dashboard'],
  ['/tasks', '✓', 'Tasks'],
  ['/pomodoro', '◷', 'Focus timer'],
  ['/mood', '☻', 'Mood check-in'],
  ['/analytics', '↗', 'Statistics'],
  ['/safespace', '♡', 'Safe space']
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" to="/dashboard">
        <b>✦</b>FocusFlow
      </Link>
      <nav>
        {nav.map((x) => (
          <NavLink key={x[0]} to={x[0]}>
            <span>{x[1]}</span>
            {x[2]}
          </NavLink>
        ))}
      </nav>
      <div className="aside-bottom">
        <div className="quote">“One focused hour can change your whole day.”</div>
        <NavLink to="/settings">
          <span>⚙</span>Profile & Settings
        </NavLink>
        <div className="mini-profile">
          <i>SD</i>
          <div>
            <b>Samiksha</b>
            <small>Student plan</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Layout({ children }) {
  return (
    <div className="shell">
      <Sidebar />
      <main>
        <header>
          <p>
            Monday, October 26 <b>•</b> Make today count
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '8px 12px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔔 <span>1</span>
            </button>
            <i className="avatar">SD</i>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
