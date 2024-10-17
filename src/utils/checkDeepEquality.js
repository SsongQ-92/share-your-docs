const checkDeepEquality = (serverData, localData) => {
  if (serverData.length !== localData.length) return false;

  let result = true;

  for (let i = 0; i < serverData.length; i++) {
    let isAllSame = true;
    
    const serverLineObject = serverData[i];
    const localLineObject = localData[i];
    const keysArray = Object.keys(serverLineObject);

    for (let j = 0; j < keysArray.length; j++) {
      const propertyKey = keysArray[j];

      if (serverLineObject[propertyKey] !== localLineObject[propertyKey]) {
        isAllSame = false;
        break;
      }
    }

    if (isAllSame === false) {
      result = false;
      break;
    }
  }

  return result;
};

export default checkDeepEquality;
