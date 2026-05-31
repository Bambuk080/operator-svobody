export function Report({ report, onUpdateReport, onCloseDay }) {
  return (
    <section className="panel">
      <p className="label">Вечерний отчёт</p>
      <h2>Закрытие дня без самообмана</h2>

      <div className="reportGrid">
        <label>
          Энергия 1–10
          <input
            value={report.energy}
            onChange={(event) => onUpdateReport("energy", event.target.value)}
            placeholder="Например: 6"
          />
        </label>

        <label>
          Фокус 1–10
          <input
            value={report.focus}
            onChange={(event) => onUpdateReport("focus", event.target.value)}
            placeholder="Например: 7"
          />
        </label>

        <label>
          YouTube / скроллинг
          <input
            value={report.youtube}
            onChange={(event) => onUpdateReport("youtube", event.target.value)}
            placeholder="Например: 40 минут"
          />
        </label>
      </div>

      <label className="fullLabel">
        Что сегодня получилось?
        <textarea
          value={report.win}
          onChange={(event) => onUpdateReport("win", event.target.value)}
          placeholder="Например: сделал WhatsApp-статусы и не сорвал утро"
        />
      </label>

      <label className="fullLabel">
        Что сорвалось и почему?
        <textarea
          value={report.problem}
          onChange={(event) => onUpdateReport("problem", event.target.value)}
          placeholder="Пиши честно. Не красиво, а правду."
        />
      </label>

      <label className="fullLabel">
        Что исправить завтра?
        <textarea
          value={report.tomorrow}
          onChange={(event) => onUpdateReport("tomorrow", event.target.value)}
          placeholder="Один конкретный шаг на завтра"
        />
      </label>

      <label className="fullLabel">
        Заметка дня
        <textarea
          value={report.note}
          onChange={(event) => onUpdateReport("note", event.target.value)}
          placeholder="Любой вывод, мысль или наблюдение"
        />
      </label>

      <button className="closeDay" onClick={onCloseDay}>
        Закрыть день и сохранить
      </button>
    </section>
  );
}
