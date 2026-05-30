import { useEffect, useMemo, useState } from "react";
import "./App.css";

const categories = ["Религия", "Дисциплина", "Бизнес", "Тело", "Знания"];

const defaultTasks = [
  {
    id: "fajr",
    title: "Фаджр вовремя",
    category: "Религия",
    points: 12,
  },
  {
    id: "quran",
    title: "Коран и азкары утром",
    category: "Религия",
    points: 10,
  },
  {
    id: "duha",
    title: "Духа или религиозный минимум",
    category: "Религия",
    points: 6,
  },
  {
    id: "main-task",
    title: "Главная задача дня выполнена",
    category: "Дисциплина",
    points: 15,
  },
  {
    id: "no-youtube-before-main",
    title: "YouTube не открыт до главной задачи",
    category: "Дисциплина",
    points: 10,
  },
  {
    id: "book-before-sleep",
    title: "Книга 15–20 минут перед сном",
    category: "Дисциплина",
    points: 8,
  },
  {
    id: "whatsapp-status",
    title: "3 WhatsApp-статуса",
    category: "Бизнес",
    points: 10,
  },
  {
    id: "wb-step",
    title: "Мини-шаг по WB / главный товар",
    category: "Бизнес",
    points: 10,
  },
  {
    id: "training",
    title: "Тренировка / активность по графику",
    category: "Тело",
    points: 10,
  },
  {
    id: "arabic-learning",
    title: "Арабский / урок / обучение",
    category: "Знания",
    points: 9,
  },
];

const emptyReport = {
  energy: "",
  focus: "",
  youtube: "",
  win: "",
  problem: "",
  tomorrow: "",
  note: "",
};

function makeId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTodayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPrettyDate() {
  return new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function loadJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getStatus(score) {
  if (score >= 90) return "Отличный день";
  if (score >= 75) return "Сильный день";
  if (score >= 60) return "Нормальный день";
  if (score >= 40) return "Слабый день";
  return "День слит";
}

function getStatusClass(score) {
  if (score >= 90) return "excellent";
  if (score >= 75) return "strong";
  if (score >= 60) return "normal";
  if (score >= 40) return "weak";
  return "failed";
}

function getOperatorText(score, done, tasks) {
  const mainTask = tasks.find((task) => task.id === "main-task");
  const fajrTask = tasks.find((task) => task.id === "fajr");
  const youtubeTask = tasks.find((task) => task.id === "no-youtube-before-main");

  if (fajrTask && !done[fajrTask.id]) {
    return "Фаджр — главный маркер дня. Если он сорван, нельзя делать вид, что всё нормально. Сегодня задача — спасти остаток дня и защитить сон.";
  }

  if (mainTask && !done[mainTask.id]) {
    return "Главная задача не закрыта. Не бери новые дела. Не уходи в YouTube. Разбей главную задачу на 10 минут и сделай первый подход.";
  }

  if (youtubeTask && !done[youtubeTask.id]) {
    return "YouTube до главной задачи — это не отдых, а побег от неопределённости. Исправляй день конкретным действием.";
  }

  if (score >= 75) {
    return "День держится. Теперь не испорти вечер. Закрой отчёт, книгу и сон после Иша.";
  }

  if (score >= 40) {
    return "День слабый, но не потерян. Выбери один маленький шаг и закрой его без переговоров с собой.";
  }

  return "День идёт в слив. Сейчас не нужен идеальный план. Нужен один честный шаг: религия, главная задача или сон.";
}

function App() {
  const todayKey = getTodayKey();

  const [tasks, setTasks] = useState(() =>
    loadJson("operator-v1-tasks", defaultTasks)
  );

  const [doneByDate, setDoneByDate] = useState(() =>
    loadJson("operator-v1-done-by-date", {})
  );

  const [reportsByDate, setReportsByDate] = useState(() =>
    loadJson("operator-v1-reports-by-date", {})
  );

  const [history, setHistory] = useState(() =>
    loadJson("operator-v1-history", [])
  );

  const [newTask, setNewTask] = useState({
    title: "",
    category: "Дисциплина",
    points: 10,
  });

  const done = doneByDate[todayKey] || {};
  const report = reportsByDate[todayKey] || emptyReport;

  useEffect(() => {
    localStorage.setItem("operator-v1-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("operator-v1-done-by-date", JSON.stringify(doneByDate));
  }, [doneByDate]);

  useEffect(() => {
    localStorage.setItem("operator-v1-reports-by-date", JSON.stringify(reportsByDate));
  }, [reportsByDate]);

  useEffect(() => {
    localStorage.setItem("operator-v1-history", JSON.stringify(history));
  }, [history]);

  const totalPoints = useMemo(() => {
    return tasks.reduce((sum, task) => sum + Number(task.points || 0), 0);
  }, [tasks]);

  const earnedPoints = useMemo(() => {
    return tasks.reduce((sum, task) => {
      return done[task.id] ? sum + Number(task.points || 0) : sum;
    }, 0);
  }, [done, tasks]);

  const score = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  const completedCount = tasks.filter((task) => done[task.id]).length;

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const categoryTasks = tasks.filter((task) => task.category === category);

      const max = categoryTasks.reduce(
        (sum, task) => sum + Number(task.points || 0),
        0
      );

      const value = categoryTasks.reduce((sum, task) => {
        return done[task.id] ? sum + Number(task.points || 0) : sum;
      }, 0);

      return {
        category,
        value,
        max,
        percent: max === 0 ? 0 : Math.round((value / max) * 100),
      };
    });
  }, [done, tasks]);

  const lastHistory = history.slice(0, 7);

  function toggleTask(id) {
    setDoneByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [id]: !(prev[todayKey] || {})[id],
      },
    }));
  }

  function resetDay() {
    const confirmReset = window.confirm("Сбросить отметки и отчёт за сегодня?");
    if (!confirmReset) return;

    setDoneByDate((prev) => ({
      ...prev,
      [todayKey]: {},
    }));

    setReportsByDate((prev) => ({
      ...prev,
      [todayKey]: emptyReport,
    }));
  }

  function addTask(event) {
    event.preventDefault();

    const title = newTask.title.trim();
    const points = Number(newTask.points);

    if (!title) {
      alert("Напиши название задачи.");
      return;
    }

    if (!points || points < 1) {
      alert("Баллы должны быть больше 0.");
      return;
    }

    setTasks((prev) => [
      ...prev,
      {
        id: makeId(),
        title,
        category: newTask.category,
        points,
      },
    ]);

    setNewTask({
      title: "",
      category: "Дисциплина",
      points: 10,
    });
  }

  function deleteTask(id) {
    const confirmDelete = window.confirm("Удалить эту задачу?");
    if (!confirmDelete) return;

    setTasks((prev) => prev.filter((task) => task.id !== id));

    setDoneByDate((prev) => {
      const copy = { ...prev };
      const todayDone = { ...(copy[todayKey] || {}) };
      delete todayDone[id];
      copy[todayKey] = todayDone;
      return copy;
    });
  }

  function updateTask(id, field, value) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        return {
          ...task,
          [field]: field === "points" ? Number(value) : value,
        };
      })
    );
  }

  function updateReport(field, value) {
    setReportsByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || emptyReport),
        [field]: value,
      },
    }));
  }

  function resetTasksToDefault() {
    const confirmReset = window.confirm("Вернуть стандартные задачи?");
    if (!confirmReset) return;

    setTasks(defaultTasks);
  }

  function closeDay() {
    const record = {
      date: todayKey,
      prettyDate: getPrettyDate(),
      score,
      status: getStatus(score),
      completedCount,
      totalTasks: tasks.length,
      earnedPoints,
      totalPoints,
      report,
    };

    setHistory((prev) => {
      const withoutToday = prev.filter((item) => item.date !== todayKey);
      return [record, ...withoutToday].slice(0, 30);
    });

    alert("День сохранён в истории.");
  }

  return (
    <main className="app">
      <section className="panel hero">
        <div className="header">
          <div>
            <p className="label">Оператор свободы</p>
            <h1>Панель дня</h1>
            <p className="subtitle">
              {getPrettyDate()} · религия · дисциплина · бизнес · тело · знания
            </p>
          </div>

          <button onClick={resetDay} className="reset">
            Сброс дня
          </button>
        </div>

        <div className="scoreBlock">
          <div className="circle">
            <span>{score}</span>
            <small>/100</small>
          </div>

          <div>
            <p className={`status ${getStatusClass(score)}`}>{getStatus(score)}</p>
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
        <div className="sectionHeader">
          <div>
            <p className="label">Чеклист</p>
            <h2>Что закрыть сегодня</h2>
          </div>
        </div>

        <div className="taskList">
          {tasks.map((task) => (
            <div key={task.id} className={`taskRow ${done[task.id] ? "done" : ""}`}>
              <button className="taskCheck" onClick={() => toggleTask(task.id)}>
                <span>{done[task.id] ? "✓" : ""}</span>
              </button>

              <div className="taskEdit">
                <input
                  value={task.title}
                  onChange={(event) =>
                    updateTask(task.id, "title", event.target.value)
                  }
                />

                <div className="taskMeta">
                  <select
                    value={task.category}
                    onChange={(event) =>
                      updateTask(task.id, "category", event.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={task.points}
                    onChange={(event) =>
                      updateTask(task.id, "points", event.target.value)
                    }
                  />

                  <span>баллов</span>
                </div>
              </div>

              <button className="deleteButton" onClick={() => deleteTask(task.id)}>
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="label">Настройка</p>
        <h2>Добавить задачу</h2>

        <form className="taskForm" onSubmit={addTask}>
          <input
            value={newTask.title}
            onChange={(event) =>
              setNewTask((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
            placeholder="Например: 20 минут арабского"
          />

          <select
            value={newTask.category}
            onChange={(event) =>
              setNewTask((prev) => ({
                ...prev,
                category: event.target.value,
              }))
            }
          >
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max="50"
            value={newTask.points}
            onChange={(event) =>
              setNewTask((prev) => ({
                ...prev,
                points: event.target.value,
              }))
            }
          />

          <button type="submit">Добавить</button>
        </form>

        <button className="ghostButton" onClick={resetTasksToDefault}>
          Вернуть стандартные задачи
        </button>
      </section>

      <section className="panel">
        <p className="label">Вечерний отчёт</p>
        <h2>Закрытие дня без самообмана</h2>

        <div className="reportGrid">
          <label>
            Энергия 1–10
            <input
              value={report.energy}
              onChange={(event) => updateReport("energy", event.target.value)}
              placeholder="Например: 6"
            />
          </label>

          <label>
            Фокус 1–10
            <input
              value={report.focus}
              onChange={(event) => updateReport("focus", event.target.value)}
              placeholder="Например: 7"
            />
          </label>

          <label>
            YouTube / скроллинг
            <input
              value={report.youtube}
              onChange={(event) => updateReport("youtube", event.target.value)}
              placeholder="Например: 40 минут"
            />
          </label>
        </div>

        <label className="fullLabel">
          Что сегодня получилось?
          <textarea
            value={report.win}
            onChange={(event) => updateReport("win", event.target.value)}
            placeholder="Например: сделал WhatsApp-статусы и не сорвал утро"
          />
        </label>

        <label className="fullLabel">
          Что сорвалось и почему?
          <textarea
            value={report.problem}
            onChange={(event) => updateReport("problem", event.target.value)}
            placeholder="Пиши честно. Не красиво, а правду."
          />
        </label>

        <label className="fullLabel">
          Что исправить завтра?
          <textarea
            value={report.tomorrow}
            onChange={(event) => updateReport("tomorrow", event.target.value)}
            placeholder="Один конкретный шаг на завтра"
          />
        </label>

        <label className="fullLabel">
          Заметка дня
          <textarea
            value={report.note}
            onChange={(event) => updateReport("note", event.target.value)}
            placeholder="Любой вывод, мысль или наблюдение"
          />
        </label>

        <button className="closeDay" onClick={closeDay}>
          Закрыть день и сохранить в историю
        </button>
      </section>

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

      <section className="panel rule">
        <p className="label">Жёсткое правило</p>
        <h2>Не уходи в YouTube, когда задача непонятная</h2>
        <p>
          Если не знаешь, что делать — разбей задачу на шаг на 10 минут.
          Свобода строится не мыслями, а закрытыми действиями.
        </p>
      </section>
    </main>
  );
}

export default App;