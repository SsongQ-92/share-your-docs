export const createDocSlice = (set, getState) => ({
  uniqueDocId: "",
  docMode: "",
  isURLCopied: false,
  currentDocData: [],
  setUniqueDocId: (uniqueId) => set((state) => ({ ...state, uniqueDocId: uniqueId })),
});
