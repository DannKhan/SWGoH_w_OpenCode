import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatGalaxyPower } from '../../utils';
import './AllyCodeInput.css';

export function GuildSearchForm() {
  const { searchGuilds, searchResults, searchLoading, setGuild, loading } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSearched(false);
      return;
    }
    const timer = setTimeout(() => {
      searchGuilds(query);
      setSearched(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, searchGuilds]);

  if (loading) {
    return <div className="ally-code-form"><p className="dashboard-loading">Загрузка данных гильдии...</p></div>;
  }

  return (
    <div className="ally-code-form">
      <h2>Поиск гильдии</h2>
      <p className="ally-code-form__hint">
        Введите название гильдии для загрузки данных
      </p>
      <div className="ally-code-form__row">
        <input
          className="ally-code-form__input"
          type="text"
          placeholder="BuzzLighter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={searchLoading}
        />
      </div>

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
