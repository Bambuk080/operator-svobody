import { getStatusClass } from "../utils/scoring";

export function History({ history }) {
  const lastHistory = history.slice(0, 10);

  return (
    <section className="panel">
      <p className="label">История</p>
      <h2>Последние сохранённые дни</h2>

      {lastHistory.length === 0 ? (
        <p className="emptyText">
          Истории пока нет. Заполни вечерний отчёт и нажми “Закрыть день”.
        </p>
      ) : (
        <div className="historyList">
          {lastHistory.map((item) => (
            <div className="historyItem" key={item.date}>
              <div>
                <strong>{item.prettyDate}</strong>
                <small>
                  {item.completedCount}/{item.totalTasks} задач ·{" "}
                  {item.earnedPoints}/{item.totalPoints} баллов
                </small>
              </div>

              <span className={`historyScore ${getStatusClass(item.score)}`}>
                {item.score}/100
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}