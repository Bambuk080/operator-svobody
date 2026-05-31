export const categories = ["Религия", "Дисциплина", "Бизнес", "Тело", "Знания"];

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

export const storageKeys = {
  tasks: "operator-v1-tasks",
  doneByDate: "operator-v1-done-by-date",
  reportsByDate: "operator-v1-reports-by-date",
  history: "operator-v1-history",
};