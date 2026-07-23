import { Link } from 'react-router-dom';
import './Header.css';

const navItems = [
  { path: '/', label: 'Дашборд' },
  { path: '/gear-planner', label: 'Снаряжение' },
  { path: '/guild-analytics', label: 'Аналитика' },
  { path: '/tb-planner', label: 'ТБ' },
  { path: '/tw-planner', label: 'ВГ' },
  { path: '/gac-planner', label: 'ВА' },
];

export function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">SWGOH Guild Suite</Link>
      </div>
      <nav className="header__nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="header__nav-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
