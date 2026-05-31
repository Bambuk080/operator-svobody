import { useEffect, useMemo, useState } from "react";
import "./App.css";

const VERSION = "8.2 Quick Actions & Schedule";
const FOCUS_DURATION = 10 * 60;

const tabs = [
  { id: "today", label: "Сегодня" },
  { id: "focus", label: "Фокус" },
  { id: "routine", label: "Режим" },
  { id: "prayer", label: "Намаз" },
  { id: "business", label: "Бизнес" },
  { id: "finance", label: "Финансы" },
  { id: "report", label: "Отчёт" },
  { id: "week", label: "Неделя" },
  { id: "history", label: "История" },
  { id: "ai", label: "AI" },
  { id: "settings", label: "Настройки" },
];

const categories = ["Религия", "Дисциплина", "Бизнес", "Тело", "Знания"];

const defaultTasks = [
  { id: "fajr", title: "Фаджр вовремя", category: "Религия", points: 12 },
  { id: "quran", title: "Коран и азкары утром", category: "Религия", points: 10 },
  { id: "duha", title: "Духа или религиозный минимум", category: "Религия", points: 6 },
  { id: "main-task", title: "Главная задача дня выполнена", category: "Дисциплина", points: 15 },
  { id: "no-youtube-before-main", title: "YouTube не открыт до главной задачи", category: "Дисциплина", points: 10 },
  { id: "book-before-sleep", title: "Книга 15–20 минут перед сном", category: "Дисциплина", points: 8 },
  { id: "whatsapp-status", title: "3 WhatsApp-статуса", category: "Бизнес", points: 10 },
  { id: "wb-step", title: "Мини-шаг по WB / главный товар", category: "Бизнес", points: 10 },
  { id: "training", title: "Тренировка / активность по графику", category: "Тело", points: 10 },
  { id: "arabic-learning", title: "Арабский / урок / обучение", category: "Знания", points: 9 },
];

const dayBlocks = [
  {
    id: "morning",
    title: "Утро",
    subtitle: "Фаджр, ясность, первый удар",
    items: [
      { id: "morning-fajr", title: "Фаджр без торга" },
      { id: "morning-quran", title: "Коран / азкары" },
      { id: "morning-main-goal", title: "Главная задача записана" },
      { id: "morning-focus", title: "Первый фокус 10 минут" },
    ],
  },
  {
    id: "day",
    title: "День",
    subtitle: "Двигать дело, не расплываться",
    items: [
      { id: "day-work", title: "Работа / учёба без хаоса" },
      { id: "day-wb", title: "Мини-шаг по WB / товару" },
      { id: "day-whatsapp", title: "WhatsApp-статусы / продажи" },
      { id: "day-no-youtube", title: "YouTube не управляет днём" },
    ],
  },
  {
    id: "evening",
    title: "Вечер",
    subtitle: "Закрыть день и защитить сон",
    items: [
      { id: "evening-prayer", title: "Магриб / Иша закрыты" },
      { id: "evening-report", title: "Вечерний отчёт" },
      { id: "evening-book", title: "Книга перед сном" },
      { id: "evening-sleep", title: "Телефон не ломает ночь" },
    ],
  },
];

const defaultTimedTasks = [
  {
    id: "schedule-after-fajr",
    title: "Коран / азкары после Фаджра",
    type: "prayer",
    prayerKey: "fajr",
    offset: 0,
    hint: "сразу после Фаджра",
  },
  {
    id: "schedule-after-sunrise",
    title: "Арабский или тренировка после восхода",
    type: "prayer",
    prayerKey: "sunrise",
    offset: 30,
    hint: "примерно через 30 минут после восхода",
  },
  {
    id: "schedule-lunch-business",
    title: "Мини-шаг по WB / бизнесу",
    type: "fixed",
    time: "12:40",
    hint: "обеденный перерыв",
  },
  {
    id: "schedule-whatsapp",
    title: "WhatsApp-статусы / продажи",
    type: "fixed",
    time: "20:00",
    hint: "вечерний бизнес-выход",
  },
  {
    id: "schedule-after-isha",
    title: "Отчёт, книга, подготовка ко сну",
    type: "prayer",
    prayerKey: "isha",
    offset: 20,
    hint: "после Иша",
  },
  {
    id: "schedule-sleep",
    title: "Телефон убрать, сон защитить",
    type: "fixed",
    time: "22:00",
    hint: "не ломать Фаджр",
  },
];

const defaultPrayer = {
  fajr: { label: "Фаджр", time: "", done: false },
  sunrise: { label: "Восход", time: "", done: false },
  dhuhr: { label: "Зухр", time: "", done: false },
  asr: { label: "Аср", time: "", done: false },
  maghrib: { label: "Магриб", time: "", done: false },
  isha: { label: "Иша", time: "", done: false },
  quran: { label: "Коран", time: "", done: false },
  adhkar: { label: "Азкары", time: "", done: false },
  sleep: { label: "Сон защищён", time: "", done: false },
};

const emptyBusiness = {
  mainProduct: "Swiss Bork magnesium complex + b6 60 tab",
  wbOrders: "",
  outsideOrders: "",
  buyouts: "",
  reviews: "",
  whatsappStatuses: "",
  mainAction: "",
  obstacle: "",
  result: "",
  tomorrowAction: "",
};

const defaultFinanceSettings = {
  salary: 60000,
  freeAfterFixed: 16250,
  debtUsd: 700,
  usdRate: 90,
  debtSavedRub: 0,
  taxGoal: 60000,
  taxSaved: 0,
  directionGoal: 30000,
  directionSaved: 0,
  reserveGoal: 100000,
  reserveSaved: 0,
  monthlyDebtPlan: 6000,
  monthlyDirectionPlan: 5000,
  monthlyPhonePlus: 1800,
};

const emptyFinanceDay = {
  debtDeposit: "",
  taxDeposit: "",
  directionDeposit: "",
  reserveDeposit: "",
  spending: "",
  note: "",
};

const emptyReport = {
  energy: "",
  focus: "",
  youtube: "",
  sleep: "",
  win: "",
  problem: "",
  tomorrow: "",
  note: "",
};

const defaultAiSettings = {
  tone: "жёстко, но справедливо",
  mainRule: "YouTube запрещён до выполнения главной задачи",
  goal: "религия, дисциплина, бизнес, тело, знания и финансовая свобода",
};

const keys = {
  tasks: "operator-v8-tasks",
  doneByDate: "operator-v8-done-by-date",
  mainGoals: "operator-v8-main-goals",
  focus: "operator-v8-focus",
  routine: "operator-v8-routine",
  prayer: "operator-v8-prayer",
  business: "operator-v8-business",
  financeDays: "operator-v8-finance-days",
  financeSettings: "operator-v8-finance-settings",
  reports: "operator-v8-reports",
  history: "operator-v8-history",
  aiSettings: "operator-v8-ai-settings",
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getPrettyDate() {
  return new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getTimeNow() {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function addMinutesToTime(time, offsetMinutes) {
  if (!time || !time.includes(":")) return "";

  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + Number(offsetMinutes || 0));
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMinutesFromTime(time) {
  if (!time || !time.includes(":")) return 99999;

  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 99999;

  return hours * 60 + minutes;
}

function getScheduledTasks(prayerToday) {
  return defaultTimedTasks
    .map((task) => {
      if (task.type === "fixed") {
        return {
          ...task,
          displayTime: task.time,
          sortValue: getMinutesFromTime(task.time),
        };
      }

      const prayerTime = prayerToday[task.prayerKey]?.time || "";
      const displayTime = addMinutesToTime(prayerTime, task.offset);

      return {
        ...task,
        displayTime: displayTime || "введи время",
        sortValue: displayTime ? getMinutesFromTime(displayTime) : 99999,
      };
    })
    .sort((a, b) => a.sortValue - b.sortValue);
}

function n(value) {
  return Number(value || 0);
}

function money(value) {
  return n(value).toLocaleString("ru-RU");
}

function percent(value, max) {
  if (!n(max)) return 0;
  return Math.min(100, Math.round((n(value) / n(max)) * 100));
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

function getScoreData(tasks, done) {
  const totalPoints = tasks.reduce((sum, task) => sum + n(task.points), 0);
  const earnedPoints = tasks.reduce((sum, task) => done[task.id] ? sum + n(task.points) : sum, 0);
  const score = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const completedCount = tasks.filter((task) => done[task.id]).length;

  return { totalPoints, earnedPoints, score, completedCount };
}

function getCategoryStats(tasks, done) {
  return categories.map((category) => {
    const items = tasks.filter((task) => task.category === category);
    const max = items.reduce((sum, task) => sum + n(task.points), 0);
    const value = items.reduce((sum, task) => done[task.id] ? sum + n(task.points) : sum, 0);

    return {
      category,
      value,
      max,
      percent: max ? Math.round((value / max) * 100) : 0,
    };
  });
}

function getRoutineStats(done) {
  const all = dayBlocks.flatMap((block) => block.items);
  const completed = all.filter((item) => done[item.id]).length;
  const total = all.length;

  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

function getOperatorText(score, done, tasks, focusSessions, mainGoal) {
  const fajr = tasks.find((task) => task.id === "fajr");
  const main = tasks.find((task) => task.id === "main-task");
  const youtube = tasks.find((task) => task.id === "no-youtube-before-main");

  if (fajr && !done[fajr.id]) {
    return "Фаджр — главный маркер дня. Если он сорван, нельзя делать вид, что всё нормально. Сегодня задача — спасти остаток дня и защитить сон.";
  }

  if (!mainGoal.trim()) {
    return "Главная задача дня не выбрана. Пока нет главной задачи — день управляет тобой, а не ты днём.";
  }

  if (focusSessions < 1) {
    return "Главная задача выбрана. Теперь нужен первый 10-минутный подход. Не думай долго — запускай фокус.";
  }

  if (main && !done[main.id]) {
    return "Главная задача ещё не закрыта. Не бери новые дела. Продолжай подходами по 10 минут.";
  }

  if (youtube && !done[youtube.id]) {
    return "YouTube до главной задачи — это не отдых, а побег. Исправляй день конкретным действием.";
  }

  if (score >= 75) {
    return "День держится. Теперь не испорти вечер. Закрой отчёт, книгу и сон после Иша.";
  }

  if (score >= 40) {
    return "День слабый, но не потерян. Выбери один маленький шаг и закрой его без переговоров.";
  }

  return "День идёт в слив. Сейчас не нужен идеальный план. Нужен один честный шаг: религия, главная задача или сон.";
}

function buildAiPrompt({ scoreData, tasks, done, mainGoal, focusToday, prayerToday, businessToday, financeToday, report, routineDone, aiSettings }) {
  const closedTasks = tasks.filter((task) => done[task.id]).map((task) => `- ${task.title}`).join("\n") || "ничего не закрыто";
  const missedTasks = tasks.filter((task) => !done[task.id]).map((task) => `- ${task.title}`).join("\n") || "нет";

  const prayerText = Object.values(prayerToday)
    .map((item) => `- ${item.label}: ${item.done ? "закрыто" : "не закрыто"} ${item.time ? `(${item.time})` : ""}`)
    .join("\n");

  const routineStats = getRoutineStats(routineDone);

  return `Ты мой оператор дисциплины. Разбери день ${aiSettings.tone}.

Главная цель: ${aiSettings.goal}
Главное правило: ${aiSettings.mainRule}

Рейтинг дня: ${scoreData.score}/100
Баллы: ${scoreData.earnedPoints}/${scoreData.totalPoints}
Главная задача: ${mainGoal || "не выбрана"}
Фокус-подходы: ${focusToday.sessions || 0}
Режим дня: ${routineStats.completed}/${routineStats.total}

Закрытые задачи:
${closedTasks}

Незакрытые задачи:
${missedTasks}

Намаз / религия:
${prayerText}

Бизнес:
- Главный товар: ${businessToday.mainProduct}
- WB заказы: ${businessToday.wbOrders || 0}
- Продажи вне WB: ${businessToday.outsideOrders || 0}
- WhatsApp-статусы: ${businessToday.whatsappStatuses || 0}
- Главный шаг: ${businessToday.mainAction || "не указан"}
- Препятствие: ${businessToday.obstacle || "не указано"}
- Итог: ${businessToday.result || "не указан"}

Финансы сегодня:
- На долг: ${financeToday.debtDeposit || 0} ₽
- На налог: ${financeToday.taxDeposit || 0} ₽
- На направление: ${financeToday.directionDeposit || 0} ₽
- В резерв: ${financeToday.reserveDeposit || 0} ₽
- Траты: ${financeToday.spending || 0} ₽
- Заметка: ${financeToday.note || "нет"}

Вечерний отчёт:
- Энергия: ${report.energy || "нет"}
- Фокус: ${report.focus || "нет"}
- YouTube/скроллинг: ${report.youtube || "нет"}
- Сон: ${report.sleep || "нет"}
- Что получилось: ${report.win || "нет"}
- Что сорвалось: ${report.problem || "нет"}
- Что исправить завтра: ${report.tomorrow || "нет"}
- Заметка: ${report.note || "нет"}

Дай ответ в формате:
1. Жёсткий вывод дня
2. Главная ошибка
3. Что завтра сделать первым
4. Что запретить себе завтра
5. План на завтра по шагам
6. Короткая фраза оператора`;
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

function App() {
  const todayKey = getTodayKey();

  const [activeTab, setActiveTab] = useState("today");
  const [tasks, setTasks] = useState(() => loadJson(keys.tasks, defaultTasks));
  const [doneByDate, setDoneByDate] = useState(() => loadJson(keys.doneByDate, {}));
  const [mainGoals, setMainGoals] = useState(() => loadJson(keys.mainGoals, {}));
  const [focusByDate, setFocusByDate] = useState(() => loadJson(keys.focus, {}));
  const [routineByDate, setRoutineByDate] = useState(() => loadJson(keys.routine, {}));
  const [prayerByDate, setPrayerByDate] = useState(() => loadJson(keys.prayer, {}));
  const [businessByDate, setBusinessByDate] = useState(() => loadJson(keys.business, {}));
  const [financeByDate, setFinanceByDate] = useState(() => loadJson(keys.financeDays, {}));
  const [financeSettings, setFinanceSettings] = useState(() => loadJson(keys.financeSettings, defaultFinanceSettings));
  const [reportsByDate, setReportsByDate] = useState(() => loadJson(keys.reports, {}));
  const [history, setHistory] = useState(() => loadJson(keys.history, []));
  const [aiSettings, setAiSettings] = useState(() => loadJson(keys.aiSettings, defaultAiSettings));
  const [newTask, setNewTask] = useState({ title: "", category: "Дисциплина", points: 10 });
  const [importText, setImportText] = useState("");
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(FOCUS_DURATION);

  const done = doneByDate[todayKey] || {};
  const mainGoal = mainGoals[todayKey] || "";
  const focusToday = focusByDate[todayKey] || { sessions: 0, log: [] };
  const routineDone = routineByDate[todayKey] || {};
  const prayerToday = { ...defaultPrayer, ...(prayerByDate[todayKey] || {}) };
  const businessToday = { ...emptyBusiness, ...(businessByDate[todayKey] || {}) };
  const financeToday = { ...emptyFinanceDay, ...(financeByDate[todayKey] || {}) };
  const report = { ...emptyReport, ...(reportsByDate[todayKey] || {}) };

  useEffect(() => saveJson(keys.tasks, tasks), [tasks]);
  useEffect(() => saveJson(keys.doneByDate, doneByDate), [doneByDate]);
  useEffect(() => saveJson(keys.mainGoals, mainGoals), [mainGoals]);
  useEffect(() => saveJson(keys.focus, focusByDate), [focusByDate]);
  useEffect(() => saveJson(keys.routine, routineByDate), [routineByDate]);
  useEffect(() => saveJson(keys.prayer, prayerByDate), [prayerByDate]);
  useEffect(() => saveJson(keys.business, businessByDate), [businessByDate]);
  useEffect(() => saveJson(keys.financeDays, financeByDate), [financeByDate]);
  useEffect(() => saveJson(keys.financeSettings, financeSettings), [financeSettings]);
  useEffect(() => saveJson(keys.reports, reportsByDate), [reportsByDate]);
  useEffect(() => saveJson(keys.history, history), [history]);
  useEffect(() => saveJson(keys.aiSettings, aiSettings), [aiSettings]);

  useEffect(() => {
    if (!focusRunning) return;

    const timer = setInterval(() => {
      setFocusSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [focusRunning]);

  useEffect(() => {
    if (!focusRunning || focusSeconds !== 0) return;

    setFocusRunning(false);
    setFocusSeconds(FOCUS_DURATION);
    completeFocusSession("timer");
    alert("Фокус-подход завершён.");
  }, [focusRunning, focusSeconds]);

  const scoreData = useMemo(() => getScoreData(tasks, done), [tasks, done]);
  const categoryStats = useMemo(() => getCategoryStats(tasks, done), [tasks, done]);
  const routineStats = useMemo(() => getRoutineStats(routineDone), [routineDone]);

  const aiPrompt = useMemo(() => buildAiPrompt({
    scoreData,
    tasks,
    done,
    mainGoal,
    focusToday,
    prayerToday,
    businessToday,
    financeToday,
    report,
    routineDone,
    aiSettings,
  }), [scoreData, tasks, done, mainGoal, focusToday, prayerToday, businessToday, financeToday, report, routineDone, aiSettings]);

  const backupObject = useMemo(() => ({
    app: "operator-svobody",
    version: VERSION,
    createdAt: new Date().toISOString(),
    tasks,
    doneByDate,
    mainGoals,
    focusByDate,
    routineByDate,
    prayerByDate,
    businessByDate,
    financeByDate,
    financeSettings,
    reportsByDate,
    history,
    aiSettings,
  }), [
    tasks,
    doneByDate,
    mainGoals,
    focusByDate,
    routineByDate,
    prayerByDate,
    businessByDate,
    financeByDate,
    financeSettings,
    reportsByDate,
    history,
    aiSettings,
  ]);

  const backupText = useMemo(() => JSON.stringify(backupObject, null, 2), [backupObject]);

  const debtGoalRub = n(financeSettings.debtUsd) * n(financeSettings.usdRate);
  const monthlyPlan = n(financeSettings.monthlyDebtPlan) + n(financeSettings.monthlyDirectionPlan) + n(financeSettings.monthlyPhonePlus);
  const monthlyLeft = n(financeSettings.freeAfterFixed) - monthlyPlan;

  const weekStats = useMemo(() => {
    const last = history.slice(0, 7);
    const avg = last.length ? Math.round(last.reduce((sum, item) => sum + n(item.score), 0) / last.length) : 0;
    const focus = last.reduce((sum, item) => sum + n(item.focusSessions), 0);
    const wb = last.reduce((sum, item) => sum + n(item.business?.wbOrders), 0);
    const outside = last.reduce((sum, item) => sum + n(item.business?.outsideOrders), 0);

    return { count: last.length, avg, focus, wb, outside };
  }, [history]);

  function toggleTask(id) {
    setDoneByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [id]: !(prev[todayKey] || {})[id],
      },
    }));
  }

  function markTaskDone(id) {
    setDoneByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [id]: true,
      },
    }));
  }

  function incrementBusiness(field) {
    setBusinessByDate((prev) => {
      const current = {
        ...emptyBusiness,
        ...(prev[todayKey] || {}),
      };

      return {
        ...prev,
        [todayKey]: {
          ...current,
          [field]: String(n(current[field]) + 1),
        },
      };
    });
  }

  function quickPrayerDone(key) {
    setPrayerByDate((prev) => {
      const current = {
        ...defaultPrayer,
        ...(prev[todayKey] || {}),
      };

      return {
        ...prev,
        [todayKey]: {
          ...current,
          [key]: {
            ...current[key],
            done: true,
            time: current[key].time || getTimeNow(),
          },
        },
      };
    });
  }

  function toggleRoutine(id) {
    setRoutineByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [id]: !(prev[todayKey] || {})[id],
      },
    }));
  }

  function updateMainGoal(value) {
    setMainGoals((prev) => ({ ...prev, [todayKey]: value }));
  }

  function completeFocusSession(source = "manual") {
    if (!mainGoal.trim()) {
      alert("Сначала напиши главную задачу.");
      return;
    }

    setFocusByDate((prev) => {
      const current = prev[todayKey] || { sessions: 0, log: [] };

      return {
        ...prev,
        [todayKey]: {
          sessions: n(current.sessions) + 1,
          log: [
            ...(current.log || []),
            { time: getTimeNow(), source },
          ],
        },
      };
    });
  }

  function startFocus() {
    if (!mainGoal.trim()) {
      alert("Сначала напиши главную задачу.");
      return;
    }

    setFocusRunning(true);
  }

  function resetFocusTimer() {
    setFocusRunning(false);
    setFocusSeconds(FOCUS_DURATION);
  }

  function updatePrayer(key, field, value) {
    setPrayerByDate((prev) => {
      const current = { ...defaultPrayer, ...(prev[todayKey] || {}) };

      return {
        ...prev,
        [todayKey]: {
          ...current,
          [key]: {
            ...current[key],
            [field]: value,
          },
        },
      };
    });
  }

  function togglePrayer(key) {
    updatePrayer(key, "done", !prayerToday[key].done);
  }

  function updateBusiness(field, value) {
    setBusinessByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...emptyBusiness,
        ...(prev[todayKey] || {}),
        [field]: value,
      },
    }));
  }

  function updateFinanceDay(field, value) {
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

  function applyFinanceDeposits() {
    const confirmApply = window.confirm("Прибавить сегодняшние взносы к финансовым целям?");
    if (!confirmApply) return;

    setFinanceSettings((prev) => ({
      ...prev,
      debtSavedRub: n(prev.debtSavedRub) + n(financeToday.debtDeposit),
      taxSaved: n(prev.taxSaved) + n(financeToday.taxDeposit),
      directionSaved: n(prev.directionSaved) + n(financeToday.directionDeposit),
      reserveSaved: n(prev.reserveSaved) + n(financeToday.reserveDeposit),
    }));

    alert("Взносы добавлены к целям.");
  }

  function updateReport(field, value) {
    setReportsByDate((prev) => ({
      ...prev,
      [todayKey]: {
        ...emptyReport,
        ...(prev[todayKey] || {}),
        [field]: value,
      },
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
      { id: makeId(), title, category: newTask.category, points },
    ]);

    setNewTask({ title: "", category: "Дисциплина", points: 10 });
  }

  function updateTask(id, field, value) {
    setTasks((prev) => prev.map((task) => {
      if (task.id !== id) return task;
      return { ...task, [field]: field === "points" ? Number(value) : value };
    }));
  }

  function deleteTask(id) {
    const confirmDelete = window.confirm("Удалить задачу?");
    if (!confirmDelete) return;

    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function resetTasks() {
    const confirmReset = window.confirm("Вернуть стандартные задачи?");
    if (!confirmReset) return;

    setTasks(defaultTasks);
  }

  function resetToday() {
    const confirmReset = window.confirm("Сбросить данные только за сегодня?");
    if (!confirmReset) return;

    setDoneByDate((prev) => ({ ...prev, [todayKey]: {} }));
    setMainGoals((prev) => ({ ...prev, [todayKey]: "" }));
    setFocusByDate((prev) => ({ ...prev, [todayKey]: { sessions: 0, log: [] } }));
    setRoutineByDate((prev) => ({ ...prev, [todayKey]: {} }));
    setPrayerByDate((prev) => ({ ...prev, [todayKey]: defaultPrayer }));
    setBusinessByDate((prev) => ({ ...prev, [todayKey]: emptyBusiness }));
    setFinanceByDate((prev) => ({ ...prev, [todayKey]: emptyFinanceDay }));
    setReportsByDate((prev) => ({ ...prev, [todayKey]: emptyReport }));
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
      mainGoal,
      focusSessions: focusToday.sessions || 0,
      routine: routineDone,
      prayer: prayerToday,
      business: businessToday,
      finance: financeToday,
      report,
    };

    setHistory((prev) => {
      const withoutToday = prev.filter((item) => item.date !== todayKey);
      return [record, ...withoutToday].slice(0, 100);
    });

    setActiveTab("history");
    alert("День сохранён в истории.");
  }

  async function copyBackup() {
    try {
      await copyToClipboard(backupText);
      alert("Резервная копия скопирована.");
    } catch {
      setImportText(backupText);
      alert("Автокопирование не сработало. Текст вставлен в поле восстановления.");
    }
  }

  function downloadBackup() {
    const blob = new Blob([backupText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `operator-svobody-v8-${todayKey}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function restoreBackup() {
    const confirmRestore = window.confirm("Восстановить данные из резервной копии? Текущие данные будут заменены.");
    if (!confirmRestore) return;

    try {
      const data = JSON.parse(importText);

      setTasks(Array.isArray(data.tasks) ? data.tasks : defaultTasks);
      setDoneByDate(data.doneByDate || {});
      setMainGoals(data.mainGoals || {});
      setFocusByDate(data.focusByDate || {});
      setRoutineByDate(data.routineByDate || {});
      setPrayerByDate(data.prayerByDate || {});
      setBusinessByDate(data.businessByDate || {});
      setFinanceByDate(data.financeByDate || {});
      setFinanceSettings(data.financeSettings || defaultFinanceSettings);
      setReportsByDate(data.reportsByDate || {});
      setHistory(Array.isArray(data.history) ? data.history : []);
      setAiSettings(data.aiSettings || defaultAiSettings);

      alert("Данные восстановлены.");
    } catch {
      alert("Не получилось восстановить. Проверь, что JSON вставлен полностью.");
    }
  }

  async function copyAiPrompt() {
    try {
      await copyToClipboard(aiPrompt);
      alert("AI-разбор скопирован. Вставь его в ChatGPT.");
    } catch {
      alert("Не получилось скопировать. Выдели текст вручную.");
    }
  }

  return (
    <main className="app">
      <div className="shell">
        <header className="topHeader">
          <div>
            <p className="label">Оператор свободы · v{VERSION}</p>
            <h1>Панель дня</h1>
            <p className="subtitle">{getPrettyDate()}</p>
          </div>

          <button className="reset" onClick={resetToday}>Сброс</button>
        </header>

        <nav className="tabBar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "today" && (
          <>
            <section className="panel hero">
              <div className="scoreBlock">
                <div className="circle">
                  <span>{scoreData.score}</span>
                  <small>/100</small>
                </div>

                <div>
                  <p className={`status ${getStatusClass(scoreData.score)}`}>
                    {getStatus(scoreData.score)}
                  </p>

                  <h2>{getOperatorText(scoreData.score, done, tasks, focusToday.sessions || 0, mainGoal)}</h2>

                  <p className="command">
                    Команда дня: YouTube запрещён до выполнения главной задачи.
                  </p>
                </div>
              </div>

              <div className="progress">
                <div className="progressFill" style={{ width: `${scoreData.score}%` }} />
              </div>

              <p className="miniInfo">
                Закрыто задач: {scoreData.completedCount} из {tasks.length}. Набрано: {scoreData.earnedPoints} из {scoreData.totalPoints} баллов.
              </p>
            </section>

            <section className="quickGrid">
              <div className="quickCard">
                <p className="label">Главная задача</p>
                <strong>{mainGoal.trim() || "Не выбрана"}</strong>
              </div>

              <div className="quickCard">
                <p className="label">Фокус</p>
                <strong>{focusToday.sessions || 0} подходов</strong>
              </div>

              <div className="quickCard">
                <p className="label">Режим</p>
                <strong>{routineStats.completed}/{routineStats.total}</strong>
              </div>

              <div className="quickCard">
                <p className="label">Бизнес</p>
                <strong>{businessToday.wbOrders || 0} WB · {businessToday.outsideOrders || 0} вне WB</strong>
              </div>
            </section>

            <section className="panel quickActionsPanel">
              <p className="label">Быстрые действия</p>
              <h2>Закрыть без лишней печати</h2>

              <div className="actionGrid">
                <button className="actionButton" onClick={() => completeFocusSession("quick")}>
                  <strong>+1 фокус</strong>
                  <small>засчитать подход</small>
                </button>

                <button className="actionButton" onClick={() => markTaskDone("main-task")}>
                  <strong>Главная закрыта</strong>
                  <small>день сдвинулся</small>
                </button>

                <button className="actionButton" onClick={() => quickPrayerDone("fajr")}>
                  <strong>Фаджр закрыт</strong>
                  <small>время поставится само</small>
                </button>

                <button className="actionButton" onClick={() => quickPrayerDone("quran")}>
                  <strong>Коран закрыт</strong>
                  <small>религиозный минимум</small>
                </button>

                <button className="actionButton" onClick={() => incrementBusiness("wbOrders")}>
                  <strong>+1 WB</strong>
                  <small>заказ на WB</small>
                </button>

                <button className="actionButton" onClick={() => incrementBusiness("outsideOrders")}>
                  <strong>+1 вне WB</strong>
                  <small>продажа напрямую</small>
                </button>

                <button className="actionButton" onClick={() => incrementBusiness("whatsappStatuses")}>
                  <strong>+1 статус</strong>
                  <small>WhatsApp активность</small>
                </button>

                <button className="actionButton" onClick={() => setActiveTab("report")}>
                  <strong>Отчёт</strong>
                  <small>закрыть день</small>
                </button>
              </div>
            </section>

            <section className="panel schedulePanel">
              <div className="sectionHead">
                <div>
                  <p className="label">План по времени</p>
                  <h2>Что делать и когда</h2>
                </div>

                <strong>
                  {getScheduledTasks(prayerToday).filter((item) => routineDone[item.id]).length}/
                  {getScheduledTasks(prayerToday).length}
                </strong>
              </div>

              <p className="backupHint">
                Задачи “после Фаджра”, “после восхода” и “после Иша” считаются от времени,
                которое ты укажешь во вкладке “Намаз”.
              </p>

              <div className="scheduleList">
                {getScheduledTasks(prayerToday).map((item) => (
                  <button
                    key={item.id}
                    className={`scheduleItem ${routineDone[item.id] ? "done" : ""}`}
                    onClick={() => toggleRoutine(item.id)}
                  >
                    <span className="scheduleTime">{item.displayTime}</span>

                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.hint}</small>
                    </span>

                    <span className="checkBox">
                      {routineDone[item.id] ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="stats">
              {categoryStats.map((item) => (
                <div className="statCard" key={item.category}>
                  <div className="statTop">
                    <span>{item.category}</span>
                    <strong>{item.value}/{item.max}</strong>
                  </div>

                  <div className="smallProgress">
                    <div className="smallProgressFill" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </section>

            <section className="panel">
              <p className="label">Чеклист</p>
              <h2>Что закрыть сегодня</h2>

              <div className="taskList">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    className={`taskCard ${done[task.id] ? "done" : ""}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <span className="checkBox">{done[task.id] ? "✓" : ""}</span>

                    <span>
                      <strong>{task.title}</strong>
                      <small>{task.category} · +{task.points} баллов</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "focus" && (
          <section className="panel focusPanel">
            <p className="label">Фокус</p>
            <h2>Главная задача и 10 минут действия</h2>

            <label className="fullLabel">
              Главная задача дня
              <textarea
                value={mainGoal}
                onChange={(event) => updateMainGoal(event.target.value)}
                placeholder="Например: разобрать карточку WB и найти 3 причины слабых продаж"
              />
            </label>

            <div className="focusBox">
              <div className="timerCircle">
                <span>{formatTime(focusSeconds)}</span>
                <small>фокус</small>
              </div>

              <div className="focusInfo">
                <strong>Подходов сегодня: {focusToday.sessions || 0}</strong>
                <p>Если задача непонятная — не уходи в YouTube. Запусти 10 минут.</p>

                <div className="focusProgress">
                  <div
                    className="focusProgressFill"
                    style={{ width: `${Math.round(((FOCUS_DURATION - focusSeconds) / FOCUS_DURATION) * 100)}%` }}
                  />
                </div>

                <div className="focusActions">
                  {!focusRunning ? (
                    <button className="closeDay" onClick={startFocus}>Старт 10 минут</button>
                  ) : (
                    <button className="ghostButton noMargin" onClick={() => setFocusRunning(false)}>Пауза</button>
                  )}

                  <button className="ghostButton noMargin" onClick={resetFocusTimer}>Сброс таймера</button>
                  <button className="ghostButton noMargin" onClick={() => completeFocusSession("manual")}>Засчитать подход</button>
                </div>

                <div className="focusLog">
                  {(focusToday.log || []).slice(-5).map((item, index) => (
                    <small key={`${item.time}-${index}`}>#{index + 1} · {item.time} · {item.source}</small>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "routine" && (
          <section className="panel dayPlanPanel">
            <div className="sectionHead">
              <div>
                <p className="label">Режим дня</p>
                <h2>Утро · День · Вечер</h2>
              </div>

              <strong>{routineStats.completed}/{routineStats.total}</strong>
            </div>

            <div className="smallProgress dayPlanProgress">
              <div className="smallProgressFill" style={{ width: `${routineStats.percent}%` }} />
            </div>

            <div className="dayPlanGrid">
              {dayBlocks.map((block) => (
                <div className="dayBlock" key={block.id}>
                  <div className="dayBlockHead">
                    <strong>{block.title}</strong>
                    <small>{block.subtitle}</small>
                  </div>

                  <div className="dayBlockItems">
                    {block.items.map((item) => (
                      <button
                        key={item.id}
                        className={`dayPlanItem ${routineDone[item.id] ? "done" : ""}`}
                        onClick={() => toggleRoutine(item.id)}
                      >
                        <span className="checkBox">{routineDone[item.id] ? "✓" : ""}</span>
                        <span>{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "prayer" && (
          <section className="panel">
            <p className="label">Намаз</p>
            <h2>Основа дня</h2>

            <p className="backupHint">Пока время вводится вручную. Автоматический расчёт для города добавим отдельным этапом.</p>

            <div className="prayerList">
              {Object.entries(prayerToday).map(([key, item]) => (
                <div className={`prayerItem ${item.done ? "done" : ""}`} key={key}>
                  <button className="checkBox" onClick={() => togglePrayer(key)}>
                    {item.done ? "✓" : ""}
                  </button>

                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.done ? "закрыто" : "не закрыто"}</small>
                  </div>

                  <input
                    value={item.time}
                    onChange={(event) => updatePrayer(key, "time", event.target.value)}
                    placeholder="время"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "business" && (
          <section className="panel">
            <p className="label">Бизнес</p>
            <h2>WB, WhatsApp и главный товар</h2>

            <div className="businessHero">
              <div>
                <small>Главный товар</small>
                <strong>{businessToday.mainProduct}</strong>
              </div>

              <div>
                <small>WB</small>
                <strong>{businessToday.wbOrders || 0} заказов</strong>
              </div>

              <div>
                <small>Вне WB</small>
                <strong>{businessToday.outsideOrders || 0} продаж</strong>
              </div>
            </div>

            <div className="reportGrid">
              {[
                ["mainProduct", "Главный товар"],
                ["wbOrders", "Заказы WB"],
                ["outsideOrders", "Продажи вне WB"],
                ["buyouts", "Выкупы"],
                ["reviews", "Отзывы"],
                ["whatsappStatuses", "WhatsApp-статусы"],
              ].map(([field, label]) => (
                <label key={field}>
                  {label}
                  <input
                    value={businessToday[field]}
                    onChange={(event) => updateBusiness(field, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <label className="fullLabel">
              Главный бизнес-шаг сегодня
              <textarea
                value={businessToday.mainAction}
                onChange={(event) => updateBusiness("mainAction", event.target.value)}
                placeholder="Что сделал для роста продаж?"
              />
            </label>

            <label className="fullLabel">
              Что мешает продажам?
              <textarea
                value={businessToday.obstacle}
                onChange={(event) => updateBusiness("obstacle", event.target.value)}
                placeholder="Карточка, отзывы, цена, фото, трафик, деньги?"
              />
            </label>

            <label className="fullLabel">
              Итог по бизнесу
              <textarea
                value={businessToday.result}
                onChange={(event) => updateBusiness("result", event.target.value)}
              />
            </label>

            <label className="fullLabel">
              Завтрашний бизнес-шаг
              <textarea
                value={businessToday.tomorrowAction}
                onChange={(event) => updateBusiness("tomorrowAction", event.target.value)}
              />
            </label>
          </section>
        )}

        {activeTab === "finance" && (
          <section className="panel">
            <p className="label">Финансы</p>
            <h2>Долг, налог, резерв, свобода</h2>

            <div className="financeSummary">
              <div>
                <small>Остаётся после обязательного</small>
                <strong>{money(financeSettings.freeAfterFixed)} ₽</strong>
              </div>

              <div>
                <small>План в месяц</small>
                <strong>{money(monthlyPlan)} ₽</strong>
              </div>

              <div>
                <small>После плана</small>
                <strong>{money(monthlyLeft)} ₽</strong>
              </div>
            </div>

            <div className="moneyGrid">
              {[
                ["Долг $700", financeSettings.debtSavedRub, debtGoalRub],
                ["Налог", financeSettings.taxSaved, financeSettings.taxGoal],
                ["Другое направление", financeSettings.directionSaved, financeSettings.directionGoal],
                ["Резерв свободы", financeSettings.reserveSaved, financeSettings.reserveGoal],
              ].map(([label, value, max]) => (
                <div className="moneyCard" key={label}>
                  <div className="statTop">
                    <span>{label}</span>
                    <strong>{money(value)} / {money(max)} ₽</strong>
                  </div>

                  <div className="smallProgress">
                    <div className="smallProgressFill" style={{ width: `${percent(value, max)}%` }} />
                  </div>

                  <small>{percent(value, max)}%</small>
                </div>
              ))}
            </div>

            <p className="label spacedLabel">Сегодня</p>

            <div className="reportGrid">
              {[
                ["debtDeposit", "На долг"],
                ["taxDeposit", "На налог"],
                ["directionDeposit", "На направление"],
                ["reserveDeposit", "В резерв"],
                ["spending", "Траты"],
              ].map(([field, label]) => (
                <label key={field}>
                  {label}
                  <input
                    value={financeToday[field]}
                    onChange={(event) => updateFinanceDay(field, event.target.value)}
                    placeholder="₽"
                  />
                </label>
              ))}
            </div>

            <label className="fullLabel">
              Заметка по деньгам
              <textarea
                value={financeToday.note}
                onChange={(event) => updateFinanceDay("note", event.target.value)}
              />
            </label>

            <button className="closeDay" onClick={applyFinanceDeposits}>Прибавить взносы к целям</button>

            <p className="label spacedLabel">Настройки целей</p>

            <div className="reportGrid">
              {[
                ["salary", "Зарплата"],
                ["freeAfterFixed", "После обязательного"],
                ["debtUsd", "Долг в $"],
                ["usdRate", "Курс $"],
                ["debtSavedRub", "Уже на долг"],
                ["taxGoal", "Цель налог"],
                ["taxSaved", "Уже на налог"],
                ["directionGoal", "Цель направление"],
                ["directionSaved", "Уже на направление"],
                ["reserveGoal", "Цель резерв"],
                ["reserveSaved", "Уже резерв"],
                ["monthlyDebtPlan", "План долг/мес"],
                ["monthlyDirectionPlan", "План направление/мес"],
                ["monthlyPhonePlus", "Связь + Plus"],
              ].map(([field, label]) => (
                <label key={field}>
                  {label}
                  <input
                    type="number"
                    value={financeSettings[field]}
                    onChange={(event) => updateFinanceSettings(field, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        {activeTab === "report" && (
          <section className="panel">
            <p className="label">Вечерний отчёт</p>
            <h2>Закрытие дня без самообмана</h2>

            <div className="reportGrid">
              {[
                ["energy", "Энергия 1–10"],
                ["focus", "Фокус 1–10"],
                ["youtube", "YouTube / скроллинг"],
                ["sleep", "Сон"],
              ].map(([field, label]) => (
                <label key={field}>
                  {label}
                  <input
                    value={report[field]}
                    onChange={(event) => updateReport(field, event.target.value)}
                  />
                </label>
              ))}
            </div>

            {[
              ["win", "Что сегодня получилось?"],
              ["problem", "Что сорвалось и почему?"],
              ["tomorrow", "Что исправить завтра?"],
              ["note", "Заметка дня"],
            ].map(([field, label]) => (
              <label className="fullLabel" key={field}>
                {label}
                <textarea
                  value={report[field]}
                  onChange={(event) => updateReport(field, event.target.value)}
                />
              </label>
            ))}

            <button className="closeDay" onClick={closeDay}>Закрыть день и сохранить</button>
          </section>
        )}

        {activeTab === "week" && (
          <section className="panel">
            <p className="label">Неделя</p>
            <h2>Контроль последних 7 сохранённых дней</h2>

            <div className="quickGrid">
              <div className="quickCard">
                <p className="label">Дней</p>
                <strong>{weekStats.count}/7</strong>
              </div>

              <div className="quickCard">
                <p className="label">Средний рейтинг</p>
                <strong>{weekStats.avg}/100</strong>
              </div>

              <div className="quickCard">
                <p className="label">Фокус</p>
                <strong>{weekStats.focus} подходов</strong>
              </div>

              <div className="quickCard">
                <p className="label">Продажи</p>
                <strong>{weekStats.wb} WB · {weekStats.outside} вне WB</strong>
              </div>
            </div>

            <p className="backupHint">
              Недельный анализ строится по сохранённым дням. Каждый вечер нажимай “Закрыть день и сохранить”.
            </p>
          </section>
        )}

        {activeTab === "history" && (
          <section className="panel">
            <p className="label">История</p>
            <h2>Сохранённые дни</h2>

            {history.length === 0 ? (
              <p className="emptyText">Истории пока нет. Закрой день через вкладку “Отчёт”.</p>
            ) : (
              <div className="historyList">
                {history.map((item) => (
                  <div className="historyItem" key={item.date}>
                    <div>
                      <strong>{item.prettyDate}</strong>
                      <small>
                        {item.completedCount}/{item.totalTasks} задач · {item.earnedPoints}/{item.totalPoints} баллов · фокус: {item.focusSessions || 0}
                      </small>

                      {item.mainGoal ? <p className="historyGoal">{item.mainGoal}</p> : null}
                    </div>

                    <span className={`historyScore ${getStatusClass(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "ai" && (
          <section className="panel">
            <p className="label">AI-разбор</p>
            <h2>Собрать текст для ChatGPT</h2>

            <p className="backupHint">
              Это бесплатный вариант AI: приложение собирает твои данные, ты копируешь текст и вставляешь его в ChatGPT.
            </p>

            <div className="reportGrid">
              <label>
                Тон разбора
                <input
                  value={aiSettings.tone}
                  onChange={(event) => setAiSettings((prev) => ({ ...prev, tone: event.target.value }))}
                />
              </label>

              <label>
                Главное правило
                <input
                  value={aiSettings.mainRule}
                  onChange={(event) => setAiSettings((prev) => ({ ...prev, mainRule: event.target.value }))}
                />
              </label>

              <label>
                Главная цель
                <input
                  value={aiSettings.goal}
                  onChange={(event) => setAiSettings((prev) => ({ ...prev, goal: event.target.value }))}
                />
              </label>
            </div>

            <textarea className="bigTextarea" value={aiPrompt} readOnly />

            <button className="closeDay" onClick={copyAiPrompt}>Скопировать AI-разбор</button>
          </section>
        )}

        {activeTab === "settings" && (
          <>
            <section className="panel">
              <p className="label">Настройки задач</p>
              <h2>Добавить задачу</h2>

              <form className="taskForm" onSubmit={addTask}>
                <input
                  value={newTask.title}
                  onChange={(event) => setNewTask((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Например: 20 минут арабского"
                />

                <select
                  value={newTask.category}
                  onChange={(event) => setNewTask((prev) => ({ ...prev, category: event.target.value }))}
                >
                  {categories.map((category) => (
                    <option value={category} key={category}>{category}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newTask.points}
                  onChange={(event) => setNewTask((prev) => ({ ...prev, points: event.target.value }))}
                />

                <button type="submit">Добавить</button>
              </form>

              <button className="ghostButton" onClick={resetTasks}>Вернуть стандартные задачи</button>
            </section>

            <section className="panel">
              <p className="label">Редактор задач</p>
              <h2>Текущий список</h2>

              <div className="settingsList">
                {tasks.map((task) => (
                  <div className="taskRow" key={task.id}>
                    <div className="taskEdit">
                      <input
                        value={task.title}
                        onChange={(event) => updateTask(task.id, "title", event.target.value)}
                      />

                      <div className="taskMeta">
                        <select
                          value={task.category}
                          onChange={(event) => updateTask(task.id, "category", event.target.value)}
                        >
                          {categories.map((category) => (
                            <option value={category} key={category}>{category}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={task.points}
                          onChange={(event) => updateTask(task.id, "points", event.target.value)}
                        />
                      </div>
                    </div>

                    <button className="deleteButton" onClick={() => deleteTask(task.id)}>×</button>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <p className="label">Резервная копия</p>
              <h2>Экспорт / импорт всего приложения</h2>

              <p className="backupHint">
                Здесь сохраняются задачи, история, финансы, бизнес, намаз, режим, фокус и AI-настройки.
              </p>

              <div className="backupActions">
                <button className="closeDay" onClick={copyBackup}>Скопировать данные</button>
                <button className="ghostButton noMargin" onClick={downloadBackup}>Скачать JSON</button>
              </div>

              <label className="fullLabel">
                Восстановить из резервной копии
                <textarea
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                  placeholder="Вставь сюда JSON"
                />
              </label>

              <button className="dangerButton" onClick={restoreBackup}>Восстановить данные</button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default App;


