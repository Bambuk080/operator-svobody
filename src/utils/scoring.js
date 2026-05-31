export function getStatus(score) {
  if (score >= 90) return "Отличный день";
  if (score >= 75) return "Сильный день";
  if (score >= 60) return "Нормальный день";
  if (score >= 40) return "Слабый день";
  return "День слит";
}

export function getStatusClass(score) {
  if (score >= 90) return "excellent";
  if (score >= 75) return "strong";
  if (score >= 60) return "normal";
  if (score >= 40) return "weak";
  return "failed";
}

export function getScoreData(tasks, done) {
  const totalPoints = tasks.reduce((sum, task) => {
    return sum + Number(task.points || 0);
  }, 0);

  const earnedPoints = tasks.reduce((sum, task) => {
    return done[task.id] ? sum + Number(task.points || 0) : sum;
  }, 0);

  const score = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  const completedCount = tasks.filter((task) => done[task.id]).length;

  return {
    totalPoints,
    earnedPoints,
    score,
    completedCount,
  };
}

export function getCategoryStats(categories, tasks, done) {
  return categories.map((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category);

    const max = categoryTasks.reduce((sum, task) => {
      return sum + Number(task.points || 0);
    }, 0);

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
}

export function getOperatorText(score, done, tasks, focusSessions, mainGoal) {
  const mainTask = tasks.find((task) => task.id === "main-task");
  const fajrTask = tasks.find((task) => task.id === "fajr");
  const youtubeTask = tasks.find((task) => task.id === "no-youtube-before-main");

  if (fajrTask && !done[fajrTask.id]) {
    return "Фаджр — главный маркер дня. Если он сорван, нельзя делать вид, что всё нормально. Сегодня задача — спасти остаток дня и защитить сон.";
  }

  if (!mainGoal?.trim()) {
    return "Главная задача дня ещё не выбрана. Пока нет главной задачи — день управляет тобой, а не ты днём.";
  }

  if (focusSessions < 1) {
    return "Главная задача выбрана. Теперь нужен первый 10-минутный подход. Не думай долго — запускай фокус.";
  }

  if (mainTask && !done[mainTask.id]) {
    return "Главная задача ещё не закрыта. Не бери новые дела. Продолжай подходами по 10 минут.";
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

export function getPercent(value, max) {
  const numericValue = Number(value || 0);
  const numericMax = Number(max || 0);

  if (!numericMax) return 0;

  return Math.min(100, Math.round((numericValue / numericMax) * 100));
}
