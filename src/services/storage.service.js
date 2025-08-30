export const StorageService = {

  _getNamespacedKey: (key, userId) => {
    if (!userId) {
      throw new Error("UserId is required for storage operation.");
    }
    return `${userId}:${key}`;
  },

  setItem: async (key, data, userId) => {
    try {
      const namespacedKey = StorageService._getNamespacedKey(key, userId);

      if (window.electronAPI?.store) {
        await window.electronAPI.store.set(namespacedKey, data);
      } else {
        localStorage.setItem(namespacedKey, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw error;
    }
  },

  getItem: async (key, userId) => {
    try {
      const namespacedKey = StorageService._getNamespacedKey(key, userId);

      if (window.electronAPI?.store) {
        return await window.electronAPI.store.get(namespacedKey);
      } else {
        const data = localStorage.getItem(namespacedKey);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  },

  removeItem: async (key, userId) => {
    try {
      const namespacedKey = StorageService._getNamespacedKey(key, userId);

      if (window.electronAPI?.store) {
        await window.electronAPI.store.delete(namespacedKey);
      } else {
        localStorage.removeItem(namespacedKey);
      }
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }
};