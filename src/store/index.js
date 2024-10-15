import { create } from 'zustand';
import { createAuthSlice } from '../services/slices/authSlice';
import { createDocSlice } from '../services/slices/docSlice';
import { createErrorSlice } from '../services/slices/errorSlice';

export const useBoundStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createErrorSlice(...a),
  ...createDocSlice(...a),
}));
