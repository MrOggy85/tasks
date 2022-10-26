import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EmptyObject } from '../../types';
import getAllTasksFromApi from './getAll';
import addFromApi from './add';
import updateFromApi from './update';
import removeFromApi from './remove';
import type { Tag } from './types';

type Add = Parameters<typeof addFromApi>[0];
type Update = Parameters<typeof updateFromApi>[0];

const NAMESPACE = 'tag';

export const getAll = createAsyncThunk<Tag[], void, EmptyObject>(
  `${NAMESPACE}/getAll`,
  async (_, _thunkApi) => {
    const e = await getAllTasksFromApi();
    return e.sort((a, b) => {
      return a.id - b.id;
    });
  },
);

export const add = createAsyncThunk<boolean, Add, EmptyObject>(
  `${NAMESPACE}/add`,
  async (task, thunkApi) => {
    const result = await addFromApi(task);
    await thunkApi.dispatch(getAll());

    return result;
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
    await thunkApi.dispatch(getAll());

    return result;
  },
);

const tagSlice = createSlice({
  name: NAMESPACE,
  initialState: {
    tags: [] as Tag[],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAll.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.loading = false;
      })
      .addCase(getAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAll.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(add.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(add.pending, (state) => {
        state.loading = true;
      })
      .addCase(add.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(update.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(update.pending, (state) => {
        state.loading = true;
      })
      .addCase(update.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(remove.fulfilled, (state, _) => {
        state.loading = false;
      })
      .addCase(remove.pending, (state) => {
        state.loading = true;
      })
      .addCase(remove.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default tagSlice;
