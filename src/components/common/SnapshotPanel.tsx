import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './SnapshotPanel.css';

export function SnapshotPanel() {
  const {
    githubToken, setGithubToken,
    playerAllyCode,
    player,
    snapshotStatus, snapshotError,
    requestSnapshot,
  } = useApp();

  const [tokenInput, setTokenInput] = useState(githubToken);
  const [allyCodeInput, setAllyCodeInput] = useState(playerAllyCode);

  const handleRequest = () => {
    if (tokenInput) setGithubToken(tokenInput);
    if (allyCodeInput && tokenInput) requestSnapshot(allyCodeInput);
  };

  return (
    <div className="snapshot-panel">
      <h3>Загрузка ростера игрока</h3>
      <p className="snapshot-panel__hint">
        Для загрузки полных данных игрока (снаряжение, юниты, моды) требуется GitHub токен.
        Снепшот создаётся через GitHub Actions и сохраняется в репозитории.
      </p>

      <label className="snapshot-panel__label">GitHub Token</label>
      <input
        className="snapshot-panel__input"
        type="password"
        placeholder="ghp_..."
        value={tokenInput}
        onChange={(e) => setTokenInput(e.target.value)}
      />

      <label className="snapshot-panel__label">Ally Code</label>
      <input
        className="snapshot-panel__input"
        type="text"
        placeholder="743985967"
        value={allyCodeInput}
        onChange={(e) => setAllyCodeInput(e.target.value)}
      />

      <button
        className="snapshot-panel__btn"
        onClick={handleRequest}
        disabled={snapshotStatus === 'requesting' || snapshotStatus === 'pending' || snapshotStatus === 'loading' || !tokenInput || !allyCodeInput}
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
