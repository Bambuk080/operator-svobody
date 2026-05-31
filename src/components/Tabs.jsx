const tabs = [
  { id: "today", label: "Сегодня" },
  { id: "report", label: "Отчёт" },
  { id: "history", label: "История" },
  { id: "settings", label: "Настройки" },
];

export function Tabs({ activeTab, setActiveTab }) {
  return (
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
  );
}