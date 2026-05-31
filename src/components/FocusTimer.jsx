import { useEffect, useMemo, useState } from "react";

const FOCUS_DURATION = 10 * 60;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}

export function FocusTimer({
  mainGoal,
  onUpdateMainGoal,
  focusSessions,
  onFocusComplete,
}) {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  const progress = useMemo(() => {
    return Math.round(((FOCUS_DURATION - secondsLeft) / FOCUS_DURATION) * 100);
  }, [secondsLeft]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || secondsLeft !== 0) return;

    setIsRunning(false);
    setSecondsLeft(FOCUS_DURATION);
    onFocusComplete();

    alert("Фокус-подход завершён. Засчитан один подход.");
  }, [secondsLeft, isRunning, onFocusComplete]);

  function startFocus() {
    if (!mainGoal.trim()) {
      alert("Сначала напиши главную задачу дня.");
      return;
    }

    setIsRunning(true);
  }

  function pauseFocus() {
    setIsRunning(false);
  }

  function resetFocus() {
    const confirmReset = window.confirm("Сбросить текущий таймер?");
    if (!confirmReset) return;

    setIsRunning(false);
    setSecondsLeft(FOCUS_DURATION);
  }

  function manualComplete() {
    if (!mainGoal.trim()) {
      alert("Сначала напиши главную задачу дня.");
      return;
    }

    onFocusComplete();
    alert("Фокус-подход засчитан.");
  }

  return (
    <section className="panel focusPanel">
      <p className="label">Главная задача</p>
      <h2>Один главный удар дня</h2>

      <label className="fullLabel">
        Что сегодня двигает тебя к свободе?
        <textarea
          value={mainGoal}
          onChange={(event) => onUpdateMainGoal(event.target.value)}
          placeholder="Например: разобрать карточку WB главного товара и найти 3 причины слабых продаж"
        />
      </label>

      <div className="focusBox">
        <div className="timerCircle">
          <span>{formatTime(secondsLeft)}</span>
          <small>фокус</small>
        </div>

        <div className="focusInfo">
          <strong>Подходов сегодня: {focusSessions}</strong>
          <p>
            Если задача непонятная — не уходи в YouTube. Запусти 10 минут и
            сделай первый конкретный шаг.
          </p>

          <div className="focusProgress">
            <div className="focusProgressFill" style={{ width: `${progress}%` }} />
          </div>

          <div className="focusActions">
            {!isRunning ? (
              <button className="closeDay" onClick={startFocus}>
                Старт 10 минут
              </button>
            ) : (
              <button className="ghostButton noMargin" onClick={pauseFocus}>
                Пауза
              </button>
            )}

            <button className="ghostButton noMargin" onClick={resetFocus}>
              Сброс
            </button>

            <button className="ghostButton noMargin" onClick={manualComplete}>
              Засчитать подход
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}