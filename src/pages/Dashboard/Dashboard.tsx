import { useApp } from '../../context/AppContext';
import { GuildSearchForm } from '../../components/common/AllyCodeInput';
import { GALACTIC_LEGENDS } from '../../data/galacticLegends';
import { formatGalaxyPower } from '../../utils';
import './Dashboard.css';

export function Dashboard() {
  const { guildId, guild, loading, error, glScanData, glScanStatus, glScanError, scanGuildGLs } = useApp();

  if (!guildId) {
    return <GuildSearchForm />;
  }

  if (loading) {
    return <div className="dashboard-loading">Загрузка данных гильдии...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Ошибка: {error}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Возможно, ответ слишком большой для бесплатного CORS-прокси.
        </p>
      </div>
    );
  }

  if (!guild) {
    return <div className="dashboard-loading">Нет данных</div>;
  }

  const profile = guild.profile;
  const members = guild.member ?? [];
  const nowSec = Math.floor(Date.now() / 1000);
  const activeToday = members.filter((m) => {
    const last = Number(m.lastActivityTime) / 1000;
    return nowSec - last < 86400;
  });

  const totalGp = Number(profile.guildGalacticPower);
  const avgGp = members.length > 0 ? totalGp / members.length : 0;

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__header-info">
          <h1>{profile.name}</h1>
          <p className="dashboard__meta">
            {profile.memberCount} / {profile.memberMax} участников · Уровень {profile.level}
          </p>
        </div>
      </div>

      <div className="dashboard__cards">
        <div className="dashboard__card">
          <span className="dashboard__card-label">Галактическая мощь</span>
          <span className="dashboard__card-value">{formatGalaxyPower(totalGp)}</span>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Средняя ГМ</span>
          <span className="dashboard__card-value">{formatGalaxyPower(avgGp)}</span>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Активны сегодня</span>
          <span className="dashboard__card-value">{activeToday.length}/{members.length}</span>
        </div>
      </div>

      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2>Galactic Legends</h2>
          {glScanStatus === 'idle' && (
            <button className="dashboard__scan-btn" onClick={scanGuildGLs}>
              Сканировать гильдию
            </button>
          )}
          {glScanStatus === 'scanning' && (
            <span className="dashboard__scan-status">Сканирование (~5 мин)...</span>
          )}
          {glScanStatus === 'error' && (
            <span className="dashboard__scan-status dashboard__scan-status--error">
              {glScanError}
            </span>
          )}
        </div>
        <p className="dashboard__section-desc">
          {glScanData
            ? `Сканировано ${glScanData.totalMembers} игроков`
            : 'Нажмите «Сканировать гильдию», чтобы увидеть GL всех участников'}
        </p>

        <div className="gl-grid">
          {GALACTIC_LEGENDS.map((gl) => {
            const count = glScanData?.counts[gl.id] ?? 0;
            const hasData = glScanData !== null;
            return (
              <div key={gl.id} className={`gl-item${count > 0 ? ' gl-item--owned' : ''}`}>
                <div className="gl-item__icon">{gl.ship ? '🛸' : '⚔'}</div>
                <span className="gl-item__name">{gl.name}</span>
                <span className="gl-item__count">{hasData ? count : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2>Участники</h2>
          <span className="dashboard__section-count">{members.length} игроков</span>
        </div>
        <div className="dashboard__table-wrap">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>ГМ</th>
                <th>Персонажи</th>
                <th>Корабли</th>
                <th>Активность</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {members
                .sort((a, b) => Number(b.galacticPower) - Number(a.galacticPower))
                .map((m) => (
                  <tr key={m.playerId}>
                    <td className="dashboard__name">{m.playerName}</td>
                    <td>{formatGalaxyPower(Number(m.galacticPower))}</td>
                    <td>{formatGalaxyPower(Number(m.characterGalacticPower))}</td>
                    <td>{formatGalaxyPower(Number(m.shipGalacticPower))}</td>
                    <td>{formatActivityTime(m.lastActivityTime)}</td>
                    <td>{memberLevelLabel(m.memberLevel)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function formatActivityTime(timestamp: string): string {
  const now = Math.floor(Date.now() / 1000);
  const time = Math.floor(Number(timestamp) / 1000);
  const diff = now - time;
  const hours = Math.floor(diff / 3600);
  if (hours < 1) return '<1ч';
  if (hours < 24) return `${hours}ч`;
  const days = Math.floor(hours / 24);
  return `${days}д`;
}

function memberLevelLabel(level: number): string {
  switch (level) {
    case 1: return 'Лидер';
    case 3: return 'Офицер';
    default: return 'Участник';
  }
}
