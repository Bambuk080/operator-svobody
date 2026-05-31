export function Header({ prettyDate, version, onResetDay }) {
  return (
    <header className="topHeader">
      <div>
        <p className="label">Оператор свободы · v{version}</p>
        <h1>Панель дня</h1>
        <p className="subtitle">{prettyDate}</p>
      </div>

      <button onClick={onResetDay} className="reset">
        Сброс
      </button>
    </header>
  );
}
