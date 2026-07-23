import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
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
  const { allyCode, setAllyCode, player } = useApp();

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
      {allyCode && (
        <div className="header__user">
          <span className="header__user-name">{player?.name ?? allyCode}</span>
          <button className="header__user-btn" onClick={() => setAllyCode('')}>
            Сменить
          </button>
        </div>
      )}
    </header>
  );
}
