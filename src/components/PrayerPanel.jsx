const prayerOrder = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "quran", "adhkar"];

export function PrayerPanel({ prayerToday, onUpdatePrayerTime, onTogglePrayer }) {
  const completed = prayerOrder.filter((key) => prayerToday[key]?.done).length;

  return (
    <section className="panel">
      <p className="label">Намаз и религия</p>
      <h2>Держи основу дня</h2>

      <p className="backupHint">
        Пока время намаза вводим вручную. Следующим большим этапом добавим автоматический расчёт для Грозного.
      </p>

      <div className="summaryLine">
        <strong>Закрыто: {completed} из {prayerOrder.length}</strong>
        <span>Фаджр и Иша — главные маркеры сна и дисциплины.</span>
      </div>

      <div className="prayerList">
        {prayerOrder.map((key) => {
          const item = prayerToday[key];

          return (
            <div className={`prayerItem ${item.done ? "done" : ""}`} key={key}>
              <button className="checkBox" onClick={() => onTogglePrayer(key)}>
                {item.done ? "✓" : ""}
              </button>

              <div>
                <strong>{item.label}</strong>
                <small>{item.done ? "закрыто" : "не закрыто"}</small>
              </div>

              <input
                value={item.time}
                onChange={(event) => onUpdatePrayerTime(key, event.target.value)}
                placeholder="время"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
