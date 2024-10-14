const getMap = (ref) => {
  if (!ref.current) {
    ref.current = new Map();
  }
  
  return ref.current;
}

export default getMap;
