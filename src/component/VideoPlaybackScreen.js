// src/components/VideoPlaybackScreen.js
import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRecommendedVideos, fetchVideoDetails, clearRecommendedVideos } from '../redux/videoSlice';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function VideoPlaybackScreen() {
  const { id } = useParams(); // Get the video ID from the URL
  const dispatch = useDispatch();
  const { videoDetails, recommendedVideos, loading, recommendedLoading, recommendedError } = useSelector((state) => state.videos);
  const observer = useRef();

  const lastRecommendedElementRef = useCallback((node) => {
    if (loading) return;
    if (recommendedLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('Fetching more recommended videos...'); // Debug log
        dispatch(fetchRecommendedVideos(id)); // Fetch more recommended videos
      }
    });
    if (node) observer.current.observe(node);
  }, [recommendedLoading, dispatch, id]);

  useEffect(() => {
    console.log('Video ID:', id);
    dispatch(fetchVideoDetails(id)); // Fetch details of the selected video
    dispatch(fetchRecommendedVideos(id)); // Initial fetch for recommended videos
    
    // Optional: Clear previous recommendations
    return () => {
      dispatch(clearRecommendedVideos());
    };
  }, [dispatch, id]);
  return (
    <div className='video-playback'>
      <div className='video-player'>
        {videoDetails && videoDetails.id ? (
          <iframe 
            width="100%" 
            height="500" 
            src={`https://www.youtube.com/embed/${id}`} 
            title={videoDetails.snippet?.title || 'Video Player'} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          ></iframe>
        ) : (
          <p>Loading video...</p>
        )}
        <h2>{videoDetails.snippet?.title || 'Video Title'}</h2>
        <p>{videoDetails.snippet?.description || 'Video Description'}</p>
      </div>
      <div className='recommended-videos'>
        <h3>Recommended Videos</h3>
        {recommendedVideos.length > 0 ? (
          recommendedVideos.map((video, index) => (
            <div
              key={video.id.videoId}
              ref={recommendedVideos.length === index + 1 ? lastRecommendedElementRef : null}
              className='recommended-video'
            >
              <Link to={`/video/${video.id.videoId}`} style={{ textDecoration: 'none', color: 'black' }}>
                <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
                <div>
                  <h4>{video.snippet.title}</h4>
                  <p>
                    {video.snippet.channelTitle} |{' '}
                    {formatDistanceToNow(new Date(video.snippet.publishTime))
                      .replace('about', '')  // Remove "about"
                      .replace('over', '')     // Remove "ago"
                      .replace('almost', '')  // Remove "almost"
                      .trim()} ago
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No recommended videos available.</p>
        )}
        {recommendedLoading && <p>Loading more recommended videos...</p>}
        {recommendedError && <p style={{ color: 'red' }}>{recommendedError}</p>}
      </div>
    </div>
  );
}

export default VideoPlaybackScreen;
