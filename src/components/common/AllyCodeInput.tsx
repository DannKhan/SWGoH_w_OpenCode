import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGalaxyPower } from '../../utils';
import './AllyCodeInput.css';

function isAllyCode(input: string): boolean {
  return /^\d{9,}$/.test(input.trim());
}

export function GuildSearchForm() {
  const {
    searchGuilds, searchResults, searchLoading, searchByAllyCode,
    searchByAllyCodeLoading, setGuild, loading, snapshotStatus,
    snapshotError,
  } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const q = query.trim();
    if (!q || q.length < 2) return;
    if (isAllyCode(q)) {
      searchByAllyCode(q);
    } else {
      searchGuilds(q);
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (loading) {
    return <div className="ally-code-form"><p className="dashboard-loading">Загрузка данных гильдии...</p></div>;
  }

  const isSearchingAllyCode = searchByAllyCodeLoading;

  const allyCodeSearchHint = () => {
    switch (snapshotStatus) {
      case 'requesting':
        return 'Отправка запроса...';
      case 'pending':
        return 'Ожидание обработки...';
      case 'loading':
        return 'Загрузка снепшота...';
      case 'error':
        return `Ошибка: ${snapshotError ?? 'неизвестная ошибка'}`;
      default:
        return null;
    }
  };

  return (
    <div className="ally-code-form">
      <h2>Поиск гильдии</h2>
      <p className="ally-code-form__hint">
        Введите название гильдии или Ally Code (9+ цифр)
      </p>
      <div className="ally-code-form__row">
        <input
          className="ally-code-form__input"
          type="text"
          placeholder="BuzzLighter или 743985967"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={searchLoading || isSearchingAllyCode}
        />
        <button
          className="ally-code-form__button"
          onClick={handleSearch}
          disabled={searchLoading || isSearchingAllyCode || query.trim().length < 2}
        >
          {isSearchingAllyCode ? 'Поиск...' : 'Искать'}
        </button>
      </div>

      {isSearchingAllyCode && (
        <p className="ally-code-form__hint ally-code-form__hint--ally">
          {allyCodeSearchHint()}
        </p>
      )}

      {searchLoading && <p className="ally-code-form__hint">Поиск...</p>}

      {searched && !searchLoading && searchResults.length === 0 && (
        <p className="ally-code-form__hint">Гильдии не найдены</p>
      )}

      {searchResults.length > 0 && (
        <div className="ally-code-form__results">
          {searchResults.map((g) => (
            <button
              key={g.id}
              className="ally-code-form__result"
              onClick={() => setGuild(g.id, g.name)}
            >
              <span className="ally-code-form__result-name">{g.name}</span>
              <span className="ally-code-form__result-meta">
                {formatGalaxyPower(Number(g.guildGalacticPower))} · {g.memberCount}/{g.memberMax} участников
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
