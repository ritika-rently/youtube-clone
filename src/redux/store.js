// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './videoSlice'; // Import your videoSlice reducer

// Configure the store with your reducers
const store = configureStore({
  reducer: {
    videos: videoReducer, // Add your video reducer here
    // You can add more reducers here if needed in the future
  },
  // You can add additional middleware here if needed, or leave it as the default
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  // Optional: configure any additional settings such as devTools, enhancers, etc.
});

export default store;
