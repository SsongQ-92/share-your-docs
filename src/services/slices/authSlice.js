export const createAuthSlice = (set) => ({
  userLocalId: 0,
  setUserLocalId: (newLocalId) => set((state) => {
    state.userLocalId = newLocalId;
  }) 
});
