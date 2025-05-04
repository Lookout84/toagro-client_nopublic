import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import listingsReducer from './slices/listingsSlice';
import categoriesReducer from './slices/categoriesSlice';
import chatReducer from './slices/chatSlice';
import paymentsReducer from './slices/paymentsSlice';
import userReducer from './slices/userSlice';
import notificationsReducer from './slices/notificationsSlice';
import uiReducer from './slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  listings: listingsReducer,
  categories: categoriesReducer,
  chat: chatReducer,
  payments: paymentsReducer,
  user: userReducer,
  notifications: notificationsReducer,
  ui: uiReducer,
});