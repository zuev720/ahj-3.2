import EventBus from '../components/eventBus';

export default class Storage {
  constructor() {
    this.storage = [];
    EventBus.subscribe('new task', this.addStorage.bind(this));
    EventBus.subscribe('deleteActiveTask', this.deleteElement.bind(this));
  }

  addStorage(object) {
    this.storage.push(object.newTask);
    EventBus.publish('storage', {
      taskStorage: this.storage,
    });
  }

  deleteElement(object) {
    this.storage.forEach((task, index) => {
      if (task === object.activeTask) this.storage.splice(index, 1);
    });
  }
}
