// src/redux/videoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

// Thunk to fetch videos for listing
export const fetchVideos = createAsyncThunk('videos/fetchVideos', async (_, { getState, rejectWithValue }) => {
    try {
      const { videos, nextPageToken } = getState().videos;
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
          params: {
            part: 'snippet',
            maxResults: 20,
            type: 'video',
            key: API_KEY,
            pageToken: nextPageToken || '', // Fetch the next page of results
          },
        });
        const newVideos = response.data.items.filter(
            (video) => !videos.some((v) => v.id.videoId === video.id.videoId)
          );
          return { videos: newVideos, nextPageToken: response.data.nextPageToken };

      } catch (error) {
        if (error.response && error.response.data.error.code === 403) {
          // Handle quota exceeded error
          return rejectWithValue('Quota exceeded for YouTube Data API.');
        }
        return rejectWithValue('Failed to fetch videos. Please try again.');
      }
    });
//     const { nextPageToken } = getState().videos;
//   const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
//     params: {
//       part: 'snippet',
//       maxResults: 20,
//       q: 'Your query here', // Initial query if needed
//       type: 'video',
//       key: API_KEY,
//       pageToken: nextPageToken || '',
//     },
//   });
  
//   return {
//     videos: response.data.items,
//     nextPageToken: response.data.nextPageToken,
//   };
// });
//   return response.data.items;
// });

// Thunk to fetch videos based on search query
export const searchVideos = createAsyncThunk('videos/searchVideos', async (query) => {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
    params: {
      part: 'snippet',
      maxResults: 50,
      q: query, // Dynamic search query
      type: 'video',
      key: API_KEY,
    },
  });
  console.log('Search response:', response);
  return response.data.items;
});

// Thunk to fetch video details
export const fetchVideoDetails = createAsyncThunk('videos/fetchVideoDetails', async (videoId) => {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
    params: {
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: API_KEY,
    },
  });
  return response.data.items[0]; // Assuming API returns a single video
});

// Thunk to fetch search suggestions
export const fetchSuggestions = createAsyncThunk(
  'videos/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 5,  // Limit the number of suggestions
          q: query,       // Use the query from the user input
          key: API_KEY,
        },
      });
      return response.data.items.map((item) => item.snippet.title); // Map to video titles for suggestions
    } catch (error) {
      console.error('Failed to fetch suggestions:', error.message);
      return rejectWithValue('Failed to fetch suggestions.');
    }
  }
);


// Thunk to fetch recommended videos
export const fetchRecommendedVideos = createAsyncThunk(
  'videos/fetchRecommendedVideos',
  async (videoId, { rejectWithValue }) => {
    try {
      // Ensure the videoId is valid
      if (!videoId || typeof videoId !== 'string' || videoId.trim() === '') {
        throw new Error(`Invalid videoId: ${videoId}`);
      }

      console.log('Attempting to fetch recommended videos for video ID:', videoId);

      // Make the API request
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet', // Correct parameter
          relatedToVideoId: videoId, // Ensure this is a valid video ID
          type: 'video',   // Must be 'video' to fetch related videos
          key: API_KEY,    // Your valid API key
        },
      });

      // Log successful response
      console.log('Recommended videos response:', response.data);

      return response.data.items;

    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.error('API Error:', error.response.data);
        // Return specific error message from API
        return rejectWithValue(error.response.data.message);
      } else if (error.request) {
        console.error('Request Error:', error.request);
        return rejectWithValue('No response received from the server.');
      } else {
        console.error('General Error:', error.message);
        return rejectWithValue('An unexpected error occurred.');
      }
    }
  }
);

// export const fetchSuggestions = async (searchText) => {
//   try {
//     const response = await fetch(`https://api.example.com/suggestions?query=${searchText}`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     setSuggestions(data.suggestions);
//   } catch (error) {
//     console.error('Failed to fetch suggestions:', error);
//   }
// };



const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    videoDetails: {},
    recommendedVideos: [],
    suggestions: [],  // State to store fetched suggestions
    loading: false,
    error: null, // Error state
    nextPageToken: null, // Initialize nextPageToken in state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        const existingVideoIds = new Set(state.videos.map((v) => v.id.videoId));
        const uniqueVideos = action.payload.videos.filter(
          (video) => !existingVideoIds.has(video.id.videoId)
        );
        state.videos = [...state.videos, ...uniqueVideos];
        state.nextPageToken = action.payload.nextPageToken; // Update the nextPageToken
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })
      .addCase(searchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload; // Replace existing videos with search results
        state.nextPageToken = null; // Reset page token as needed
      })
      .addCase(searchVideos.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchVideoDetails.fulfilled, (state, action) => {
        state.videoDetails = action.payload;
      })
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;  // Set fetched suggestions
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecommendedVideos.fulfilled, (state, action) => {
        const existingVideoIds = new Set(state.recommendedVideos.map(v => v.id.videoId));
        const uniqueRecommendedVideos = action.payload.filter(
          video => !existingVideoIds.has(video.id.videoId)
        );
        state.recommendedVideos = [...state.recommendedVideos, ...uniqueRecommendedVideos];
      });
      // .addCase(fetchRecommendedVideos.fulfilled, (state, action) => {
      //   state.recommendedVideos = [...state.recommendedVideos, ...action.payload]; // Append new recommended videos
      // });
  },
});

export default videoSlice.reducer;

