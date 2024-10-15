export const createDocSlice = (set, getState) => ({
  uniqueDocId: "",
  docMode: "",
  isURLCopied: false,
  currentDocData: [],
  setUniqueDocId: (uniqueId) => set((state) => ({ ...state, uniqueDocId: uniqueId })),
  // getUserDocList: async (uid) => {
  //   try {
  //     const dbRef = ref(db, "user");
  //     const response = await get(child(dbRef, uid));

      
  //   } catch ({ name, message }) {
  //     set((state) => ({ ...state, errorMessage: message , errorName: name }));
  //   }
  // },
});
