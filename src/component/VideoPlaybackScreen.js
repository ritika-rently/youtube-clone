// src/components/VideoPlaybackScreen.js
import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRecommendedVideos, fetchVideoDetails } from '../redux/videoSlice';

function VideoPlaybackScreen() {
  const { id } = useParams(); // Get the video ID from the URL
  const dispatch = useDispatch();
  const { videoDetails, recommendedVideos, loading } = useSelector((state) => state.videos);
  const observer = useRef();

  const lastRecommendedElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('Fetching more recommended videos...'); // Debug log
        dispatch(fetchRecommendedVideos(id)); // Fetch more recommended videos
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, dispatch, id]);

  useEffect(() => {
    dispatch(fetchVideoDetails(id)); // Fetch details of the selected video
    dispatch(fetchRecommendedVideos(id)); // Initial fetch for recommended videos
  }, [dispatch, id]);

  return (
    <div className='video-playback'>
      <div className='video-player'>
        {/* Assuming videoDetails contains a URL or embedded player */}
        <iframe 
          width="100%" 
          height="500" 
          src={`https://www.youtube.com/embed/${id}`} 
          title={videoDetails.title} 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
        ></iframe>
        <h2>{videoDetails.title}</h2>
        <p>{videoDetails.description}</p>
      </div>
      <div className='recommended-videos'>
        <h3>Recommended Videos</h3>
        {recommendedVideos.map((video, index) => (
          <div key={video.id.videoId} ref={recommendedVideos.length === index + 1 ? lastRecommendedElementRef : null}>
            <h4>{video.snippet.title}</h4>
            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default VideoPlaybackScreen;
