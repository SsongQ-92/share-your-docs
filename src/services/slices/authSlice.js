export const createAuthSlice = (set) => ({
  userLocalId: 0,
  setUserLocalId: (newLocalId) => set({ userLocalId: newLocalId }), 
});
