import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

export const useSessionStorage = (key, fallback) => {
  const [value, setValue] = useState(() => readStorage(key, fallback, sessionStorage));

  useEffect(() => {
    writeStorage(key, value, sessionStorage);
  }, [key, value]);

  return [value, setValue];
};
