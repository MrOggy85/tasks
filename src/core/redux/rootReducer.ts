import { combineReducers } from '@reduxjs/toolkit';
import taskSlice from '../tasks/taskSlice';
import tagSlice from '../tags/tagSlice';


const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
  tags: tagSlice.reducer,
});

export default rootReducer;
