import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Project } from '../../types';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
}

const initialState: ProjectState = {
  projects: [],
  activeProject: null,
  loading: false
};

// Fetch all projects user belongs to — fully populated
export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/projects');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// Fetch single project with full member population
export const fetchProjectById = createAsyncThunk('projects/fetchById', async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

// Create project then immediately fetch it fully populated
export const createProject = createAsyncThunk('projects/create', async (projectData: Partial<Project>, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.post('/projects', projectData);
    // Immediately fetch the full populated version so members show real names
    const fullProject = await api.get(`/projects/${data._id}`);
    return fullProject.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setActiveProject: (state, action: PayloadAction<Project>) => {
      state.activeProject = action.payload;
      const idx = state.projects.findIndex(p => p._id === action.payload._id);
      if (idx !== -1) state.projects[idx] = action.payload;
    },
    resetProjects: (state) => {
      state.projects = [];
      state.activeProject = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        if (state.activeProject) {
          const updated = action.payload.find((p: Project) => p._id === state.activeProject!._id);
          state.activeProject = updated || (action.payload.length > 0 ? action.payload[0] : null);
        } else if (action.payload.length > 0) {
          state.activeProject = action.payload[0];
        }
      })
      .addCase(fetchProjects.rejected, (state) => { state.loading = false; })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
        if (state.activeProject?._id === action.payload._id) {
          state.activeProject = action.payload;
        }
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.activeProject = action.payload;
      });
  }
});

export const { setActiveProject, resetProjects } = projectSlice.actions;
export default projectSlice.reducer;