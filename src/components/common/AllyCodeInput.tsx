import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './AllyCodeInput.css';

export function AllyCodeInput() {
  const { setAllyCode, loading } = useApp();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length >= 9) {
      setAllyCode(input.trim());
    }
  };

  return (
    <form className="ally-code-form" onSubmit={handleSubmit}>
      <h2>Введите Ally Code</h2>
      <p className="ally-code-form__hint">
        Введите ваш Ally Code из игры, чтобы загрузить данные гильдии
      </p>
      <div className="ally-code-form__row">
        <input
          className="ally-code-form__input"
          type="text"
          placeholder="743985967"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="ally-code-form__btn"
          type="submit"
          disabled={loading || input.trim().length < 9}
        >
          {loading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </div>
    </form>
  );
}
