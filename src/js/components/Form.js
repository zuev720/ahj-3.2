import EventBus from './eventBus';
import Task from '../base/Task';

export default class Form {
  constructor() {
    this.form = document.querySelector('.filter-widget__form');
    this.form.addEventListener('input', (e) => this.onInput(e));
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
    this.onSubmit.bind(this);
  }

  onInput(e) {
    e.preventDefault();
    EventBus.publish('inputTask', {
      inputFilterTask: this.form.querySelector('.input').value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const inputValue = this.form.querySelector('.input').value;
    if (inputValue === '') {
      EventBus.publish('alert', {
        alertMessage: 'Ошибка! Пустое поле ввода недопустимо!',
      });
      return;
    }
    this.form.querySelector('.input').value = '';
    EventBus.publish('new task', {
      newTask: new Task(inputValue).task,
    });
  }
}
