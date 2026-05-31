export function Header({ prettyDate, onResetDay }) {
  return (
    <header className="topHeader">
      <div>
        <p className="label">Оператор свободы</p>
        <h1>Панель дня</h1>
        <p className="subtitle">{prettyDate}</p>
      </div>

      <button onClick={onResetDay} className="reset">
        Сброс
      </button>
    </header>
  );
}