import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Task } from '../../types';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = { tasks: [], loading: false, error: null };

export const fetchTasks = createAsyncThunk('tasks/fetchByProject', async (projectId: string, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/tasks/project/${projectId}`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData: Partial<Task>, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', taskData);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateTaskStatus = createAsyncThunk('tasks/updateStatus', async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    socketTaskCreated: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.find(t => t._id === action.payload._id);
      if (!exists) state.tasks.unshift(action.payload);
    },
    socketTaskUpdated: (state, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex(t => t._id === action.payload._id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    socketTaskDeleted: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t._id !== action.payload);
    },
    socketStatusChanged: (state, action: PayloadAction<{ taskId: string; status: string; task: Task }>) => {
      const idx = state.tasks.findIndex(t => t._id === action.payload.taskId);
      if (idx !== -1) state.tasks[idx] = action.payload.task;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createTask.fulfilled, (state, action) => {
        const exists = state.tasks.find(t => t._id === action.payload._id);
        if (!exists) state.tasks.unshift(action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  }
});

export const { socketTaskCreated, socketTaskUpdated, socketTaskDeleted, socketStatusChanged } = taskSlice.actions;
export default taskSlice.reducer;
