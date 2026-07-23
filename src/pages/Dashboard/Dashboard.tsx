import { useApp } from '../../context/AppContext';
import { AllyCodeInput } from '../../components/common/AllyCodeInput';
import { formatGalaxyPower } from '../../utils';
import './Dashboard.css';

export function Dashboard() {
  const { allyCode, player, guild, loading, error } = useApp();

  if (!allyCode) {
    return <AllyCodeInput />;
  }

  if (loading) {
    return <div className="dashboard-loading">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Ошибка: {error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }

  if (!player || !guild) {
    return <div className="dashboard-loading">Нет данных</div>;
  }

  const activeMembers = guild.member.filter((m) => {
    const now = Date.now();
    const last = Number(m.lastActivityTime);
    return now - last < 86400000;
  });

  const totalGp = Number(guild.profile.guildGalacticPower);
  const avgGp = totalGp / guild.member.length;

  return (
    <section className="dashboard">
      <h1>BuzzLighter</h1>
      <p className="dashboard__subtitle">Дашборд гильдии</p>

      <div className="dashboard__cards">
        <div className="dashboard__card">
          <span className="dashboard__card-label">Галактическая мощь</span>
          <span className="dashboard__card-value">{formatGalaxyPower(totalGp)}</span>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Участников</span>
          <span className="dashboard__card-value">{guild.profile.memberCount} / {guild.profile.memberMax}</span>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Средняя ГМ</span>
          <span className="dashboard__card-value">{formatGalaxyPower(avgGp)}</span>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Активны сегодня</span>
          <span className="dashboard__card-value">{activeMembers.length}</span>
        </div>
      </div>

      <h2>Игроки</h2>
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
            {guild.member
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
    </section>
  );
}

function formatActivityTime(timestamp: string): string {
  const now = Date.now();
  const time = Number(timestamp);
  const diff = now - time;
  const hours = Math.floor(diff / 3600000);
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
