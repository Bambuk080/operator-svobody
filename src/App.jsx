import { useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  appVersion,
  categories,
  defaultTasks,
  emptyReport,
  storageKeys,
  tabs,
  defaultPrayerDay,
  emptyBusinessDay,
  emptyFinanceDay,
  defaultFinanceSettings,
} from "./data/defaults";

import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { Today } from "./components/Today";
import { FocusTimer } from "./components/FocusTimer";
import { PrayerPanel } from "./components/PrayerPanel";
import { BusinessPanel } from "./components/BusinessPanel";
import { FinancePanel } from "./components/FinancePanel";
import { Report } from "./components/Report";
import { History } from "./components/History";
import { Settings } from "./components/Settings";

import { getPrettyDate, getTodayKey, makeId } from "./utils/date";
import { loadJson, saveJson } from "./utils/storage";
import { getCategoryStats, getScoreData, getStatus } from "./utils/scoring";

function mergePrayerDay(day) {
  return {
    ...defaultPrayerDay,
    ...(day || {}),
  };
}

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

  const [prayerByDate, setPrayerByDate] = useState(() =>
    loadJson(storageKeys.prayerByDate, {})
  );

  const [businessByDate, setBusinessByDate] = useState(() =>
    loadJson(storageKeys.businessByDate, {})
  );

  const [financeByDate, setFinanceByDate] = useState(() =>
    loadJson(storageKeys.financeByDate, {})
  );

  const [financeSettings, setFinanceSettings] = useState(() =>
    loadJson(storageKeys.financeSettings, defaultFinanceSettings)
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
  const prayerToday = mergePrayerDay(prayerByDate[todayKey]);
  const businessToday = { ...emptyBusinessDay, ...(businessByDate[todayKey] || {}) };
  const financeToday = { ...emptyFinanceDay, ...(financeByDate[todayKey] || {}) };

  useEffect(() => saveJson(storageKeys.tasks, tasks), [tasks]);
  useEffect(() => saveJson(storageKeys.doneByDate, doneByDate), [doneByDate]);
  useEffect(() => saveJson(storageKeys.reportsByDate, reportsByDate), [reportsByDate]);
  useEffect(() => saveJson(storageKeys.history, history), [history]);
  useEffect(() => saveJson(storageKeys.focusByDate, focusByDate), [focusByDate]);
  useEffect(() => saveJson(storageKeys.mainGoalsByDate, mainGoalsByDate), [mainGoalsByDate]);
  useEffect(() => saveJson(storageKeys.prayerByDate, prayerByDate), [prayerByDate]);
  useEffect(() => saveJson(storageKeys.businessByDate, businessByDate), [businessByDate]);
  useEffect(() => saveJson(storageKeys.financeByDate, financeByDate), [financeByDate]);
  useEffect(() => saveJson(storageKeys.financeSettings, financeSettings), [financeSettings]);

  const scoreData = useMemo(() => getScoreData(tasks, done), [tasks, done]);

  const categoryStats = useMemo(() => {
    return getCategoryStats(categories, tasks, done);
  }, [tasks, done]);

  const backupObject = useMemo(() => {
    return {
      app: "operator-svobody",
      version: appVersion,
      createdAt: new Date().toISOString(),
      tasks,
      doneByDate,
      reportsByDate,
      history,
      focusByDate,
      mainGoalsByDate,
      prayerByDate,
      businessByDate,
      financeByDate,
      financeSettings,
    };
  }, [
    tasks,
    doneByDate,
    reportsByDate,
    history,
    focusByDate,
    mainGoalsByDate,
    prayerByDate,
    businessByDate,
    financeByDate,
    financeSettings,
  ]);

  const backupText = useMemo(() => JSON.stringify(backupObject, null, 2), [backupObject]);

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
    const confirmReset = window.confirm("Сбросить данные за сегодня?");
    if (!confirmReset) return;

    setDoneByDate((prev) => ({ ...prev, [todayKey]: {} }));
    setReportsByDate((prev) => ({ ...prev, [todayKey]: emptyReport }));
    setFocusByDate((prev) => ({ ...prev, [todayKey]: { sessions: 0 } }));
    setMainGoalsByDate((prev) => ({ ...prev, [todayKey]: "" }));
    setPrayerByDate((prev) => ({ ...prev, [todayKey]: defaultPrayerDay }));
    setBusinessByDate((prev) => ({ ...prev, [todayKey]: emptyBusinessDay }));
    setFinanceByDate((prev) => ({ ...prev, [todayKey]: emptyFinanceDay }));
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

  function updatePrayerTime(key, value) {
    setPrayerByDate((prev) => {
      const current = mergePrayerDay(prev[todayKey]);

      return {
        ...prev,
        [todayKey]: {
          ...current,
          [key]: {
            ...current[key],
            time: value,
          },
        },
      };
    });
  }

  function togglePrayer(key) {
    setPrayerByDate((prev) => {
      const current = mergePrayerDay(prev[todayKey]);

      return {
        ...prev,
        [todayKey]: {
          ...current,
          [key]: {
            ...current[key],
            done: !current[key].done,
          },
        },
      };
    });
  }

  function updateBusiness(field, value) {
    setBusinessByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...emptyBusinessDay,
        ...(prev[todayKey] || {}),
        [field]: value,
      },
    }));
  }

  function updateFinanceToday(field, value) {
    setFinanceByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...emptyFinanceDay,
        ...(prev[todayKey] || {}),
        [field]: value,
      },
    }));
  }

  function updateFinanceSettings(field, value) {
    setFinanceSettings((prev) => ({
      ...prev,
      [field]: Number(value),
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
      score: scoreData.score,
      status: getStatus(scoreData.score),
      completedCount: scoreData.completedCount,
      totalTasks: tasks.length,
      earnedPoints: scoreData.earnedPoints,
      totalPoints: scoreData.totalPoints,
      report,
      mainGoal,
      focusSessions: focusToday.sessions || 0,
      prayer: prayerToday,
      business: businessToday,
      finance: financeToday,
    };

    setHistory((prev) => {
      const withoutToday = prev.filter((item) => item.date !== todayKey);
      return [record, ...withoutToday].slice(0, 60);
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
      "Восстановить данные из резервной копии? Текущие данные будут заменены."
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
      setPrayerByDate(data.prayerByDate || {});
      setBusinessByDate(data.businessByDate || {});
      setFinanceByDate(data.financeByDate || {});
      setFinanceSettings(data.financeSettings || defaultFinanceSettings);

      alert("Данные восстановлены.");
    } catch {
      alert("Не получилось прочитать резервную копию. Проверь, что ты вставил полный JSON-текст.");
    }
  }

  return (
    <main className="app">
      <div className="shell">
        <Header
          prettyDate={getPrettyDate()}
          version={appVersion}
          onResetDay={resetDay}
        />

        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "today" && (
          <Today
            tasks={tasks}
            done={done}
            scoreData={scoreData}
            categoryStats={categoryStats}
            onToggleTask={toggleTask}
            mainGoal={mainGoal}
            focusSessions={focusToday.sessions || 0}
            businessToday={businessToday}
            financeToday={financeToday}
          />
        )}

        {activeTab === "focus" && (
          <FocusTimer
            mainGoal={mainGoal}
            onUpdateMainGoal={updateMainGoal}
            focusSessions={focusToday.sessions || 0}
            onFocusComplete={completeFocusSession}
          />
        )}

        {activeTab === "prayer" && (
          <PrayerPanel
            prayerToday={prayerToday}
            onUpdatePrayerTime={updatePrayerTime}
            onTogglePrayer={togglePrayer}
          />
        )}

        {activeTab === "business" && (
          <BusinessPanel
            businessToday={businessToday}
            onUpdateBusiness={updateBusiness}
          />
        )}

        {activeTab === "finance" && (
          <FinancePanel
            financeSettings={financeSettings}
            financeToday={financeToday}
            onUpdateFinanceSettings={updateFinanceSettings}
            onUpdateFinanceToday={updateFinanceToday}
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
