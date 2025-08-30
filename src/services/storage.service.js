export const StorageService = {

  setItem: async (key, data) => {
    try {
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.set(key, data);
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw error;
    }
  },

  getItem: async (key) => {
    try {
      if (window.electronAPI && window.electronAPI.store) {
        return await window.electronAPI.store.get(key);
      } else {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  },

  removeItem: async (key) => {
    try {
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.delete(key);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }
};