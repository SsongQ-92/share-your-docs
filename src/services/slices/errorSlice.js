export const createErrorSlice = (set) => ({
  errorMessage: "",
  errorName: "",
  setErrorMessage: (newErrorMessage) => set({ errorMessage: newErrorMessage }),
  setErrorName: (newErrorName) => set({ errorName: newErrorName }),
});
