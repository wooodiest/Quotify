/**
 * Storage Service - odpowiedzialny za zarządzanie przechowywaniem danych lokalnie
 * Obsługuje zarówno localStorage jak i electronAPI.store
 */

export const StorageService = {
  /**
   * Zapisuje dane do lokalnego magazynu
   * @param {string} key - Klucz, pod którym dane będą przechowywane
   * @param {any} data - Dane do zapisania
   * @returns {Promise<void>}
   */
  setItem: async (key, data) => {
    try {
      // Próbujemy użyć electronAPI.store jeśli jest dostępny
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.set(key, data);
      } else {
        // Fallback do localStorage
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Pobiera dane z lokalnego magazynu
   * @param {string} key - Klucz, pod którym dane są przechowywane
   * @returns {Promise<any>} Pobrane dane lub null jeśli nie znaleziono
   */
  getItem: async (key) => {
    try {
      // Próbujemy użyć electronAPI.store jeśli jest dostępny
      if (window.electronAPI && window.electronAPI.store) {
        return await window.electronAPI.store.get(key);
      } else {
        // Fallback do localStorage
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  },

  /**
   * Usuwa dane z lokalnego magazynu
   * @param {string} key - Klucz, pod którym dane są przechowywane
   * @returns {Promise<void>}
   */
  removeItem: async (key) => {
    try {
      // Próbujemy użyć electronAPI.store jeśli jest dostępny
      if (window.electronAPI && window.electronAPI.store) {
        await window.electronAPI.store.delete(key);
      } else {
        // Fallback do localStorage
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  }
};