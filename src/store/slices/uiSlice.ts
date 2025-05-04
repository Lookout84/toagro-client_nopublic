import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  modalTitle: string;
  isLoading: boolean;
  toast: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning' | null;
  };
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  isSidebarOpen: false,
  isModalOpen: false,
  modalContent: null,
  modalTitle: '',
  isLoading: false,
  toast: {
    show: false,
    message: '',
    type: null,
  },
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openModal: (state, action: PayloadAction<{ title: string; content: React.ReactNode }>) => {
      state.isModalOpen = true;
      state.modalTitle = action.payload.title;
      state.modalContent = action.payload.content;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalContent = null;
      state.modalTitle = '';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  openModal,
  closeModal,
  setLoading,
  showToast,
  hideToast,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;