import { useState } from "react";
// Load initial state from localStorage
export const getInitialState = <T extends unknown>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      if (saved === 'undefined') return defaultValue
      return JSON.parse(saved);
    }
  }
  return defaultValue;
};

// Save state to localStorage
export const useLocalStorage = <T extends unknown>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => getInitialState(key, initialValue));

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, JSON.stringify(valueToStore));
      localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue];
};
