
import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'YOUTUBE_API_KEY';

export const useApiKey = () => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(null);
  const [isKeyLoading, setIsKeyLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey) {
        setApiKeyInternal(storedKey);
      }
    } catch (error) {
      console.error("Could not access local storage:", error);
    } finally {
      setIsKeyLoading(false);
    }
  }, []);

  const setApiKey = (newKey: string | null) => {
    try {
      if (newKey) {
        localStorage.setItem(API_KEY_STORAGE_KEY, newKey);
      } else {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
      }
      setApiKeyInternal(newKey);
    } catch (error) {
      console.error("Could not access local storage:", error);
    }
  };

  return { apiKey, setApiKey, isKeyLoading };
};
