import { create } from 'zustand';
import { createAuthSlice } from '../services/slices/authSlice';

export const useBoundStore = create((...a) => ({
  ...createAuthSlice(...a),
}));
