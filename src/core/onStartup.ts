import store from './redux/store';
import { getAll as getAllTasks } from './tasks/taskSlice';
import { getAll as getAllTags } from './tags/tagSlice';

async function onStartup() {
  await store.dispatch(getAllTasks());
  await store.dispatch(getAllTags());
}

export default onStartup;
