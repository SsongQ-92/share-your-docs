import { create } from 'zustand';
import { createAuthSlice } from '../services/slices/authSlice';
import { createErrorSlice } from '../services/slices/errorSlice';

export const useBoundStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createErrorSlice(...a),
}));
