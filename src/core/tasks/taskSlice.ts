import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../redux/store';
import { EmptyObject } from '../../types';
import sendNotification from '../sendNotification';
import getAllTasksFromApi from './getAll';
import addFromApi from './add';
import updateFromApi from './update';
import removeFromApi from './remove';
import doneFromApi from './done';
import unDoneFromApi from './unDone';
import type { Task } from './types';

type Add = Parameters<typeof addFromApi>[0];
type Update = Parameters<typeof updateFromApi>[0];

const NAMESPACE = 'task';

export const getAll = createAsyncThunk<Task[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_, _thunkApi) => {
    const e = await getAllTasksFromApi();
    return e.sort((a, b) => {
      return a.id - b.id;
    });
  },
);

export const add = createAsyncThunk<boolean, Add, {
  state: RootState
}>(
  `${NAMESPACE}/add`,
  async (task, thunkApi) => {
    const result = await addFromApi(task);

    const allTags = thunkApi.getState().tags.tags;

    const tags = task.tagIds.map<Task['tags'][0]>(id => {
      const tag = allTags.find(x => x.id === id)
      return tag || {
        id: -1,
        name: 'fallback',
        bgColor: 'black',
        textColor: 'white'
      }
    })

    thunkApi.dispatch(taskSlice.actions.add({
      ...task,
      id: result,
      tags,
    }))

    await sendNotification(`Added ${task.title} Success!`)

    return true;
  },
);

export const update = createAsyncThunk<boolean, Update, EmptyObject>(
  `${NAMESPACE}/update`,
  async (task, thunkApi) => {
    const result = await updateFromApi(task);
    await thunkApi.dispatch(getAll());

    return result;
  },
);

export const remove = createAsyncThunk<boolean, number, EmptyObject>(
  `${NAMESPACE}/remove`,
  async (id, thunkApi) => {
    const result = await removeFromApi(id);

    thunkApi.dispatch(taskSlice.actions.remove(id))

    await sendNotification(`Deleted ${id} Success!`)

    return result;
  },
);

export const done = createAsyncThunk<boolean, number, EmptyObject>(
  `${NAMESPACE}/done`,
  async (id, thunkApi) => {
    const result = await doneFromApi(id);
    await thunkApi.dispatch(getAll());

    return result;
  },
);

export const unDone = createAsyncThunk<boolean, number, EmptyObject>(
  `${NAMESPACE}/unDone`,
  async (id, thunkApi) => {
    const result = await unDoneFromApi(id);
    await thunkApi.dispatch(getAll());

    return result;
  },
);

const taskSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    tasks: [] as Task[],
    loadingAll: false,
    loadingChange: false,
  },
  reducers: {
    add(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload)
    },
    remove(state, action: PayloadAction<number>) {
      state.tasks.splice(state.tasks.findIndex((task) => task.id === action.payload), 1);

    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loadingAll = false;
      })
      .addCase(getAll.pending, (state) => {
        state.loadingAll = true;
      })
      .addCase(getAll.rejected, (state) => {
        state.loadingAll = false;
      });

    builder
      .addCase(add.fulfilled, (state, _) => {
        state.loadingChange = false;
      })
      .addCase(add.pending, (state) => {
        state.loadingChange = true;
      })
      .addCase(add.rejected, (state) => {
        state.loadingChange = false;
      });

    builder
      .addCase(update.fulfilled, (state, _) => {
        state.loadingChange = false;
      })
      .addCase(update.pending, (state) => {
        state.loadingChange = true;
      })
      .addCase(update.rejected, (state) => {
        state.loadingChange = false;
      });

    builder
      .addCase(remove.fulfilled, (state, _) => {
        state.loadingChange = false;
      })
      .addCase(remove.pending, (state) => {
        state.loadingChange = true;
      })
      .addCase(remove.rejected, (state) => {
        state.loadingChange = false;
      });

    builder
      .addCase(done.fulfilled, (state, _) => {
        state.loadingChange = false;
      })
      .addCase(done.pending, (state) => {
        state.loadingChange = true;
      })
      .addCase(done.rejected, (state) => {
        state.loadingChange = false;
      });

    builder
      .addCase(unDone.fulfilled, (state, _) => {
        state.loadingChange = false;
      })
      .addCase(unDone.pending, (state) => {
        state.loadingChange = true;
      })
      .addCase(unDone.rejected, (state) => {
        state.loadingChange = false;
      });
  },
});

export default taskSlice;
