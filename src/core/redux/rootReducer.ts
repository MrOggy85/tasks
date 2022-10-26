import taskSlice from '../tasks/taskSlice';
import tagSlice from '../tags/tagSlice';

const rootReducer = {
  tasks: taskSlice.reducer,
  tags: tagSlice.reducer,
};

export default rootReducer;
