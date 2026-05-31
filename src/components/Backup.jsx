export function Backup({
  importText,
  setImportText,
  onCopyBackup,
  onDownloadBackup,
  onRestoreBackup,
}) {
  return (
    <section className="panel">
      <p className="label">Резервная копия</p>
      <h2>Сохранить или восстановить данные</h2>

      <p className="backupHint">
        Здесь хранятся задачи, галочки, вечерние отчёты и история.
        Перед крупными обновлениями лучше делать резервную копию.
      </p>

      <div className="backupActions">
        <button className="closeDay" onClick={onCopyBackup}>
          Скопировать данные
        </button>

        <button className="ghostButton noMargin" onClick={onDownloadBackup}>
          Скачать JSON
        </button>
      </div>

      <label className="fullLabel">
        Восстановить из резервной копии
        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Вставь сюда JSON резервной копии"
        />
      </label>

      <button className="dangerButton" onClick={onRestoreBackup}>
        Восстановить данные
      </button>
    </section>
  );
}