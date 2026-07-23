import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './SnapshotPanel.css';

export function SnapshotPanel() {
  const {
    playerAllyCode,
    player,
    snapshotStatus, snapshotError,
    requestSnapshot,
  } = useApp();

  const [allyCodeInput, setAllyCodeInput] = useState(playerAllyCode);

  const handleRequest = () => {
    if (allyCodeInput) requestSnapshot(allyCodeInput);
  };

  return (
    <div className="snapshot-panel">
      <h3>Загрузка ростера игрока</h3>
      <p className="snapshot-panel__hint">
        Введите Ally Code игрока для загрузки полных данных (снаряжение, юниты, моды).
        Данные создаются через GitHub Actions и сохраняются на отдельной ветке.
      </p>

      <label className="snapshot-panel__label">Ally Code</label>
      <input
        className="snapshot-panel__input"
        type="text"
        placeholder="743985967"
        value={allyCodeInput}
        onChange={(e) => setAllyCodeInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleRequest(); }}
      />

      <button
        className="snapshot-panel__btn"
        onClick={handleRequest}
        disabled={snapshotStatus === 'requesting' || snapshotStatus === 'pending' || snapshotStatus === 'loading' || !allyCodeInput}
      >
        {snapshotStatus === 'requesting' ? 'Запрос...' :
         snapshotStatus === 'pending' ? 'Ожидание...' :
         snapshotStatus === 'loading' ? 'Загрузка...' :
         'Request Snapshot'}
      </button>

      {snapshotStatus === 'ready' && player && (
        <div className="snapshot-panel__success">
          Загружен: {player.name} (Уровень {player.level}) — {player.rosterUnit.length} юнитов
        </div>
      )}

      {snapshotError && (
        <div className="snapshot-panel__error">{snapshotError}</div>
      )}
    </div>
  );
}
