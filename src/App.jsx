import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { categories, defaultTasks, emptyReport, storageKeys } from "./data/defaults";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { Today } from "./components/Today";
import { Report } from "./components/Report";
import { History } from "./components/History";
import { Settings } from "./components/Settings";

import { getPrettyDate, getTodayKey, makeId } from "./utils/date";
import { loadJson, saveJson } from "./utils/storage";
import { getCategoryStats, getScoreData, getStatus } from "./utils/scoring";

function App() {
  const todayKey = getTodayKey();

  const [activeTab, setActiveTab] = useState("today");

  const [tasks, setTasks] = useState(() =>
    loadJson(storageKeys.tasks, defaultTasks)
  );

  const [doneByDate, setDoneByDate] = useState(() =>
    loadJson(storageKeys.doneByDate, {})
  );

  const [reportsByDate, setReportsByDate] = useState(() =>
    loadJson(storageKeys.reportsByDate, {})
  );

  const [history, setHistory] = useState(() =>
    loadJson(storageKeys.history, [])
  );

  const [focusByDate, setFocusByDate] = useState(() =>
    loadJson(storageKeys.focusByDate, {})
  );

  const [mainGoalsByDate, setMainGoalsByDate] = useState(() =>
    loadJson(storageKeys.mainGoalsByDate, {})
  );

  const [newTask, setNewTask] = useState({
    title: "",
    category: "Дисциплина",
    points: 10,
  });

  const [importText, setImportText] = useState("");

  const done = doneByDate[todayKey] || {};
  const report = reportsByDate[todayKey] || emptyReport;
  const focusToday = focusByDate[todayKey] || { sessions: 0 };
  const mainGoal = mainGoalsByDate[todayKey] || "";

  useEffect(() => {
    saveJson(storageKeys.tasks, tasks);
  }, [tasks]);

  useEffect(() => {
    saveJson(storageKeys.doneByDate, doneByDate);
  }, [doneByDate]);

  useEffect(() => {
    saveJson(storageKeys.reportsByDate, reportsByDate);
  }, [reportsByDate]);

  useEffect(() => {
    saveJson(storageKeys.history, history);
  }, [history]);

  useEffect(() => {
    saveJson(storageKeys.focusByDate, focusByDate);
  }, [focusByDate]);

  useEffect(() => {
    saveJson(storageKeys.mainGoalsByDate, mainGoalsByDate);
  }, [mainGoalsByDate]);

  const scoreData = useMemo(() => {
    return getScoreData(tasks, done);
  }, [tasks, done]);

  const categoryStats = useMemo(() => {
    return getCategoryStats(categories, tasks, done);
  }, [tasks, done]);

  const backupObject = useMemo(() => {
    return {
      app: "operator-svobody",
      version: "2.1",
      createdAt: new Date().toISOString(),
      tasks,
      doneByDate,
      reportsByDate,
      history,
      focusByDate,
      mainGoalsByDate,
    };
  }, [tasks, doneByDate, reportsByDate, history, focusByDate, mainGoalsByDate]);

  const backupText = useMemo(() => {
    return JSON.stringify(backupObject, null, 2);
  }, [backupObject]);

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
    const confirmReset = window.confirm("Сбросить отметки, отчёт, фокус и главную задачу за сегодня?");
    if (!confirmReset) return;

    setDoneByDate((prev) => ({
      ...prev,
      [todayKey]: {},
    }));

    setReportsByDate((prev) => ({
      ...prev,
      [todayKey]: emptyReport,
    }));

    setFocusByDate((prev) => ({
      ...prev,
      [todayKey]: { sessions: 0 },
    }));

    setMainGoalsByDate((prev) => ({
      ...prev,
      [todayKey]: "",
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

  function updateMainGoal(value) {
    setMainGoalsByDate((prev) => ({
      ...prev,
      [todayKey]: value,
    }));
  }

  function completeFocusSession() {
    setFocusByDate((prev) => {
      const current = prev[todayKey] || { sessions: 0 };

      return {
        ...prev,
        [todayKey]: {
          ...current,
          sessions: Number(current.sessions || 0) + 1,
        },
      };
    });
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
      score: scoreData.score,
      status: getStatus(scoreData.score),
      completedCount: scoreData.completedCount,
      totalTasks: tasks.length,
      earnedPoints: scoreData.earnedPoints,
      totalPoints: scoreData.totalPoints,
      report,
      mainGoal,
      focusSessions: focusToday.sessions || 0,
    };

    setHistory((prev) => {
      const withoutToday = prev.filter((item) => item.date !== todayKey);
      return [record, ...withoutToday].slice(0, 30);
    });

    setActiveTab("history");
    alert("День сохранён в истории.");
  }

  async function copyBackup() {
    try {
      await navigator.clipboard.writeText(backupText);
      alert("Резервная копия скопирована. Сохрани её в Заметки, Telegram или файл.");
    } catch {
      setImportText(backupText);
      alert("Автокопирование не сработало. Текст резервной копии вставлен в поле ниже — скопируй его вручную.");
    }
  }

  function downloadBackup() {
    const blob = new Blob([backupText], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `operator-svobody-backup-${todayKey}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function restoreBackup() {
    const confirmRestore = window.confirm(
      "Восстановить данные из резервной копии? Текущие задачи, отчёты и история будут заменены."
    );

    if (!confirmRestore) return;

    try {
      const data = JSON.parse(importText);

      if (!Array.isArray(data.tasks)) {
        alert("Ошибка: в резервной копии нет списка задач.");
        return;
      }

      setTasks(data.tasks);
      setDoneByDate(data.doneByDate || {});
      setReportsByDate(data.reportsByDate || {});
      setHistory(Array.isArray(data.history) ? data.history : []);
      setFocusByDate(data.focusByDate || {});
      setMainGoalsByDate(data.mainGoalsByDate || {});

      alert("Данные восстановлены.");
    } catch {
      alert("Не получилось прочитать резервную копию. Проверь, что ты вставил полный JSON-текст.");
    }
  }

  return (
    <main className="app">
      <div className="shell">
        <Header prettyDate={getPrettyDate()} onResetDay={resetDay} />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "today" && (
          <Today
            tasks={tasks}
            done={done}
            scoreData={scoreData}
            categoryStats={categoryStats}
            onToggleTask={toggleTask}
            mainGoal={mainGoal}
            onUpdateMainGoal={updateMainGoal}
            focusSessions={focusToday.sessions || 0}
            onFocusComplete={completeFocusSession}
          />
        )}

        {activeTab === "report" && (
          <Report
            report={report}
            onUpdateReport={updateReport}
            onCloseDay={closeDay}
          />
        )}

        {activeTab === "history" && <History history={history} />}

        {activeTab === "settings" && (
          <Settings
            categories={categories}
            tasks={tasks}
            newTask={newTask}
            setNewTask={setNewTask}
            onAddTask={addTask}
            onResetTasksToDefault={resetTasksToDefault}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            backupProps={{
              importText,
              setImportText,
              onCopyBackup: copyBackup,
              onDownloadBackup: downloadBackup,
              onRestoreBackup: restoreBackup,
            }}
          />
        )}
      </div>
    </main>
  );
}

export default App;