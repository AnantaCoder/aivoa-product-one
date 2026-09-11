import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../services/api';
import complaintReducer from '../features/complaint/complaintSlice';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  complaint: complaintReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
