import { getPercent } from "../utils/scoring";

function MoneyProgress({ label, value, max }) {
  const percent = getPercent(value, max);

  return (
    <div className="moneyCard">
      <div className="statTop">
        <span>{label}</span>
        <strong>{Number(value || 0).toLocaleString("ru-RU")} / {Number(max || 0).toLocaleString("ru-RU")} ₽</strong>
      </div>

      <div className="smallProgress">
        <div className="smallProgressFill" style={{ width: `${percent}%` }} />
      </div>

      <small>{percent}%</small>
    </div>
  );
}

export function FinancePanel({
  financeSettings,
  financeToday,
  onUpdateFinanceSettings,
  onUpdateFinanceToday,
}) {
  const debtGoalRub = Number(financeSettings.debtUsd || 0) * Number(financeSettings.usdRate || 0);
  const plannedMonthly = Number(financeSettings.monthlyDebtPlan || 0)
    + Number(financeSettings.monthlyDirectionPlan || 0)
    + Number(financeSettings.monthlyPhonePlus || 0);

  const monthlyLeft = Number(financeSettings.freeAfterFixed || 0) - plannedMonthly;

  return (
    <section className="panel">
      <p className="label">Финансы</p>
      <h2>Долги, налог и свобода</h2>

      <div className="financeSummary">
        <div>
          <small>Остаётся после обязательного</small>
          <strong>{Number(financeSettings.freeAfterFixed || 0).toLocaleString("ru-RU")} ₽</strong>
        </div>

        <div>
          <small>План в месяц</small>
          <strong>{plannedMonthly.toLocaleString("ru-RU")} ₽</strong>
        </div>

        <div>
          <small>Остаток после плана</small>
          <strong>{monthlyLeft.toLocaleString("ru-RU")} ₽</strong>
        </div>
      </div>

      <div className="moneyGrid">
        <MoneyProgress label="Долг $700" value={financeSettings.debtSavedRub} max={debtGoalRub} />
        <MoneyProgress label="Налог" value={financeSettings.taxSaved} max={financeSettings.taxGoal} />
        <MoneyProgress label="Другое направление" value={financeSettings.directionSaved} max={financeSettings.directionGoal} />
        <MoneyProgress label="Резерв свободы" value={financeSettings.reserveSaved} max={financeSettings.reserveGoal} />
      </div>

      <p className="label spacedLabel">Сегодня</p>

      <div className="reportGrid">
        <label>
          Отложил на долг
          <input
            value={financeToday.debtDeposit}
            onChange={(event) => onUpdateFinanceToday("debtDeposit", event.target.value)}
            placeholder="₽"
          />
        </label>

        <label>
          Отложил на налог
          <input
            value={financeToday.taxDeposit}
            onChange={(event) => onUpdateFinanceToday("taxDeposit", event.target.value)}
            placeholder="₽"
          />
        </label>

        <label>
          На направление
          <input
            value={financeToday.directionDeposit}
            onChange={(event) => onUpdateFinanceToday("directionDeposit", event.target.value)}
            placeholder="₽"
          />
        </label>

        <label>
          В резерв
          <input
            value={financeToday.reserveDeposit}
            onChange={(event) => onUpdateFinanceToday("reserveDeposit", event.target.value)}
            placeholder="₽"
          />
        </label>

        <label>
          Траты
          <input
            value={financeToday.spending}
            onChange={(event) => onUpdateFinanceToday("spending", event.target.value)}
            placeholder="₽"
          />
        </label>
      </div>

      <label className="fullLabel">
        Заметка по деньгам
        <textarea
          value={financeToday.note}
          onChange={(event) => onUpdateFinanceToday("note", event.target.value)}
          placeholder="Что понял по деньгам сегодня?"
        />
      </label>

      <p className="label spacedLabel">Настройки целей</p>

      <div className="reportGrid">
        {[
          ["salary", "Зарплата"],
          ["freeAfterFixed", "Остаётся после обязательного"],
          ["debtUsd", "Долг в долларах"],
          ["usdRate", "Курс доллара"],
          ["debtSavedRub", "Уже отложено на долг"],
          ["taxGoal", "Цель налог"],
          ["taxSaved", "Уже отложено на налог"],
          ["directionGoal", "Цель направление"],
          ["directionSaved", "Уже отложено на направление"],
          ["reserveGoal", "Цель резерв"],
          ["reserveSaved", "Уже в резерве"],
          ["monthlyDebtPlan", "План долг/мес"],
          ["monthlyDirectionPlan", "План направление/мес"],
          ["monthlyPhonePlus", "Связь + Plus/мес"],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type="number"
              value={financeSettings[key]}
              onChange={(event) => onUpdateFinanceSettings(key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
