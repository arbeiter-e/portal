// store.js
import {create} from 'zustand';
import axios from 'axios';

const useApiStore = create((set) => ({
  data: null,
  fetchData: async (userId, sessionId) => {
    try {
      // Try to get data from local storage
      const cachedData = localStorage.getItem('apiData');
      if (cachedData) {
        set({ data: JSON.parse(cachedData) });
      }

      // If not in local storage, fetch from the API
      const response = await axios.get('/api/playerUtils/getPlayerData', {
        params: { userId, sessionId },
      });
      const newData = response.data;

      if (newData !== null) {
        localStorage.setItem('apiData', JSON.stringify(newData));

        // Update the Zustand store state
        set({ data: newData });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
}));

export default useApiStore;
