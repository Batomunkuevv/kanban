const initKanban = () => {
  const kanban = document.querySelector('.kanban');

  if (!kanban) return;

  const kanbanLists = kanban.querySelectorAll('.kanban__list');
  const kanbanTasks = kanban.querySelectorAll('.kanban__item');

  kanbanTasks.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");
    });

    task.addEventListener("touchstart", () => {
      task.classList.add("is-dragging");
    });

    task.addEventListener("touchend", () => {
      task.classList.remove("is-dragging");
    });
  });

  kanbanLists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();

      const bottomTask = insertAboveTask(list, e.clientY);
      const currentTask = kanban.querySelector(".is-dragging");

      if (!bottomTask) {
        list.appendChild(currentTask);
      } else {
        list.insertBefore(currentTask, bottomTask);
      }
    });

    list.addEventListener("touchover", (e) => {
      e.preventDefault();

      const bottomTask = insertAboveTask(list, e.clientY);
      const currentTask = kanban.querySelector(".is-dragging");

      if (!bottomTask) {
        list.appendChild(currentTask);
      } else {
        list.insertBefore(currentTask, bottomTask);
      }
    });
  });

  const insertAboveTask = (list, mouseY) => {
    const els = list.querySelectorAll(".kanban__item:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
      const { top, height } = task.getBoundingClientRect();

      const offset = mouseY - top - height / 2;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }

      if(mouseY < 150){
        closestTask = els[0];
      }
    });

    return closestTask;
  };
}


window.addEventListener('DOMContentLoaded', () => {
  initKanban();
})