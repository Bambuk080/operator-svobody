import { Backup } from "./Backup";

export function Settings({
  categories,
  tasks,
  newTask,
  setNewTask,
  onAddTask,
  onResetTasksToDefault,
  onUpdateTask,
  onDeleteTask,
  backupProps,
}) {
  return (
    <>
      <section className="panel">
        <p className="label">Настройка</p>
        <h2>Добавить задачу</h2>

        <form className="taskForm" onSubmit={onAddTask}>
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

        <button className="ghostButton" onClick={onResetTasksToDefault}>
          Вернуть стандартные задачи
        </button>
      </section>

      <Backup {...backupProps} />

      <section className="panel">
        <p className="label">Редактор задач</p>
        <h2>Изменить текущий список</h2>

        <div className="settingsList">
          {tasks.map((task) => (
            <div key={task.id} className="taskRow">
              <div className="taskEdit">
                <input
                  value={task.title}
                  onChange={(event) =>
                    onUpdateTask(task.id, "title", event.target.value)
                  }
                />

                <div className="taskMeta">
                  <select
                    value={task.category}
                    onChange={(event) =>
                      onUpdateTask(task.id, "category", event.target.value)
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
                      onUpdateTask(task.id, "points", event.target.value)
                    }
                  />
                </div>
              </div>

              <button
                className="deleteButton"
                onClick={() => onDeleteTask(task.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}