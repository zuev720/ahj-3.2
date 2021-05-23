import Main from './Ui/Main';
import Form from './components/Form';
import Storage from './base/Storage';

window.taskStorage = new Storage();
window.form = new Form();
window.taskContainer = new Main(document.querySelector('.task-container'));
