export const createDocSlice = (set) => ({
  uniqueDocId: "",
  docMode: "",
  isURLCopied: false,
  setUniqueDocId: (uniqueId) => set((state) => ({ ...state, uniqueDocId: uniqueId })),
});
