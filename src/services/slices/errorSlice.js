export const createErrorSlice = (set) => ({
  errorMessage: "",
  errorName: "",
  isNoExistDocUrlError: false,
  setErrorMessage: (newErrorMessage) => set({ errorMessage: newErrorMessage }),
  setErrorName: (newErrorName) => set({ errorName: newErrorName }),
});
