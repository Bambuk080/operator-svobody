export const appVersion = "3.0";

export const categories = ["Религия", "Дисциплина", "Бизнес", "Тело", "Знания"];

export const tabs = [
  { id: "today", label: "Сегодня" },
  { id: "focus", label: "Фокус" },
  { id: "prayer", label: "Намаз" },
  { id: "business", label: "Бизнес" },
  { id: "finance", label: "Финансы" },
  { id: "report", label: "Отчёт" },
  { id: "history", label: "История" },
  { id: "settings", label: "Настройки" },
];

export const defaultTasks = [
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

export const emptyReport = {
  energy: "",
  focus: "",
  youtube: "",
  win: "",
  problem: "",
  tomorrow: "",
  note: "",
};

export const defaultPrayerDay = {
  fajr: { label: "Фаджр", time: "", done: false },
  sunrise: { label: "Восход", time: "", done: false },
  dhuhr: { label: "Зухр", time: "", done: false },
  asr: { label: "Аср", time: "", done: false },
  maghrib: { label: "Магриб", time: "", done: false },
  isha: { label: "Иша", time: "", done: false },
  quran: { label: "Коран", time: "", done: false },
  adhkar: { label: "Азкары", time: "", done: false },
};

export const emptyBusinessDay = {
  wbOrders: "",
  outsideOrders: "",
  buyouts: "",
  reviews: "",
  whatsappStatuses: "",
  mainProduct: "Swiss Bork magnesium complex + b6 60 tab",
  mainAction: "",
  obstacle: "",
  result: "",
};

export const defaultFinanceSettings = {
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

export const emptyFinanceDay = {
  debtDeposit: "",
  taxDeposit: "",
  directionDeposit: "",
  reserveDeposit: "",
  spending: "",
  note: "",
};

export const storageKeys = {
  tasks: "operator-v1-tasks",
  doneByDate: "operator-v1-done-by-date",
  reportsByDate: "operator-v1-reports-by-date",
  history: "operator-v1-history",
  focusByDate: "operator-v2-focus-by-date",
  mainGoalsByDate: "operator-v2-main-goals-by-date",
  prayerByDate: "operator-v3-prayer-by-date",
  businessByDate: "operator-v3-business-by-date",
  financeByDate: "operator-v3-finance-by-date",
  financeSettings: "operator-v3-finance-settings",
};
