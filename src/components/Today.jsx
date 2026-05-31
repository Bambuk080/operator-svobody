import {
  getOperatorText,
  getStatus,
  getStatusClass,
} from "../utils/scoring";

import { FocusTimer } from "./FocusTimer";

export function Today({
  tasks,
  done,
  scoreData,
  categoryStats,
  onToggleTask,
  mainGoal,
  onUpdateMainGoal,
  focusSessions,
  onFocusComplete,
}) {
  const { score, completedCount, earnedPoints, totalPoints } = scoreData;

  return (
    <>
      <section className="panel hero">
        <div className="scoreBlock">
          <div className="circle">
            <span>{score}</span>
            <small>/100</small>
          </div>

          <div>
            <p className={`status ${getStatusClass(score)}`}>
              {getStatus(score)}
            </p>
            <h2>{getOperatorText(score, done, tasks)}</h2>
            <p className="command">
              Команда дня: YouTube запрещён до выполнения главной задачи.
            </p>
          </div>
        </div>

        <div className="progress">
          <div className="progressFill" style={{ width: `${score}%` }} />
        </div>

        <p className="miniInfo">
          Закрыто задач: {completedCount} из {tasks.length}. Набрано:{" "}
          {earnedPoints} из {totalPoints} баллов.
        </p>
      </section>

      <FocusTimer
        mainGoal={mainGoal}
        onUpdateMainGoal={onUpdateMainGoal}
        focusSessions={focusSessions}
        onFocusComplete={onFocusComplete}
      />

      <section className="stats">
        {categoryStats.map((item) => (
          <div className="statCard" key={item.category}>
            <div className="statTop">
              <span>{item.category}</span>
              <strong>
                {item.value}/{item.max}
              </strong>
            </div>

            <div className="smallProgress">
              <div
                className="smallProgressFill"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="panel">
        <p className="label">Чеклист</p>
        <h2>Что закрыть сегодня</h2>

        <div className="taskList simple">
          {tasks.map((task) => (
            <button
              key={task.id}
              className={`taskCard ${done[task.id] ? "done" : ""}`}
              onClick={() => onToggleTask(task.id)}
            >
              <span className="checkBox">{done[task.id] ? "✓" : ""}</span>

              <span>
                <strong>{task.title}</strong>
                <small>
                  {task.category} · +{task.points} баллов
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel rule">
        <p className="label">Жёсткое правило</p>
        <h2>Не уходи в YouTube, когда задача непонятная</h2>
        <p>
          Если не знаешь, что делать — разбей задачу на шаг на 10 минут.
          Свобода строится не мыслями, а закрытыми действиями.
        </p>
      </section>
    </>
  );
}