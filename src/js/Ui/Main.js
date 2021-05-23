import EventBus from '../components/eventBus';

export default class Main {
  constructor(container) {
    this.container = container;
    this.drawAllTasks();
    this.drawPinedTasks();
    EventBus.subscribe('storage', this.newTask.bind(this));
    EventBus.subscribe('inputTask', this.drawFilterInputTasks.bind(this));
    EventBus.subscribe('alert', this.showAlert.bind(this));
    this.onClickTaskButton.bind(this);
    this.onClickPinedTaskButton.bind(this);
  }

  drawAllTasks() {
    this.container.querySelector('.alert-block').style.display = 'none';
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (!tasks) return;
    const tasksList = this.container.querySelector('.all-tasks');
    tasksList.innerHTML = '';
    tasks.forEach((task) => {
      this.container.querySelector('.all-tasks')
        .innerHTML += `<li class="task">${task}<div class="task-button"><span class="active-task-button">V</span></div></li>`;
    });
    [...tasksList.querySelectorAll('.task-button')]
      .forEach((elem) => elem.addEventListener('click', (e) => this.onClickTaskButton(e)));
  }

  drawFilterInputTasks(object) {
    this.container.querySelector('.alert-block').style.display = 'none';
    const inputValue = object.inputFilterTask.toLowerCase();
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const taskMatchers = tasks.reduce((arr, task) => {
      if (task.toLowerCase().includes(inputValue)) arr.push(task);
      return arr;
    }, []);
    if (taskMatchers.length === 0) {
      this.container.querySelector('.all-tasks').innerHTML = `
         <li class="no-task">No tasks found</li>
      `;
    } else {
      this.container.querySelector('.all-tasks').innerHTML = '';
      taskMatchers.forEach((task) => {
        this.container.querySelector('.all-tasks')
          .innerHTML += `<li class="task">${task}<div class="task-button"><span class="active-task-button">V</span></div></li>`;
      });
      [...this.container.querySelector('.all-tasks').querySelectorAll('.task')]
        .forEach((elem) => elem.addEventListener('click', (e) => this.onClickTaskButton(e)));
    }
  }

  drawPinedTasks() {
    this.container.querySelector('.alert-block').style.display = 'none';
    const pinedTasks = JSON.parse(localStorage.getItem('pinedTasks'));
    if (!pinedTasks) return;
    const pinedTasksList = this.container.querySelector('.pined-tasks');
    pinedTasksList.innerHTML = '';
    pinedTasks.forEach((task) => {
      pinedTasksList
        .innerHTML += `<li class="task">${task}<div class="task-button"><span class="active-task-button">V</span></div></li>`;
    });
    [...pinedTasksList.querySelectorAll('.task-button')]
      .forEach((elem) => {
        const button = elem.querySelector('.active-task-button');
        button.style.display = 'block';
        button.addEventListener('click', (e) => this.onClickPinedTaskButton(e));
      });
  }

  onClickTaskButton(e) {
    const task = e.target.closest('.task').innerText;
    EventBus.publish('deleteActiveTask', {
      activeTask: task,
    });
    const currentPinedTasks = JSON.parse(localStorage.getItem('pinedTasks'));
    const currentTasks = JSON.parse(localStorage.getItem('tasks'));
    currentTasks.forEach((elem, index) => {
      if (elem === task) currentTasks.splice(index, 1);
    });
    if (!currentPinedTasks) {
      localStorage.setItem('pinedTasks', JSON.stringify([task]));
    } else {
      currentPinedTasks.push(task);
      localStorage.setItem('pinedTasks', JSON.stringify(currentPinedTasks));
    }
    localStorage.setItem('tasks', JSON.stringify(currentTasks));
    this.drawAllTasks();
    this.drawPinedTasks();
  }

  onClickPinedTaskButton(e) {
    e.currentTarget.style.display = 'none';
    const task = e.target.closest('.task').innerText;
    const currentTasks = JSON.parse(localStorage.getItem('tasks'));
    currentTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(currentTasks));
    const currentPinedTasks = JSON.parse(localStorage.getItem('pinedTasks'));
    currentPinedTasks.forEach((elem, index) => {
      if (elem === task) currentPinedTasks.splice(index, 1);
    });
    localStorage.setItem('pinedTasks', JSON.stringify(currentPinedTasks));
    this.drawAllTasks();
    this.drawPinedTasks();
  }

  newTask(array) {
    const currentTasks = JSON.parse(localStorage.getItem('tasks'));
    if (!currentTasks) {
      localStorage.setItem('tasks', JSON.stringify(array.taskStorage));
    } else {
      const newTask = array.taskStorage.find((task) => !currentTasks.includes(task));
      currentTasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(currentTasks));
    }
    this.drawAllTasks();
  }

  showAlert(object) {
    const alertBlock = this.container.querySelector('.alert-block');
    alertBlock.style.display = 'block';
    alertBlock.querySelector('.alert-text').textContent = object.alertMessage;
  }
}
