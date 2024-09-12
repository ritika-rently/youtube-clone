import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, searchVideos } from '../redux/videoSlice';
import { useAuth } from './useAuth';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { formatDistanceToNow } from 'date-fns'; // Import the formatting function

function ListingScreen() {
    const { isSignedIn, signIn, signOut } = useAuth();
    const dispatch = useDispatch();
    const { videos, loading, error } = useSelector((state) => state.videos);
    const observer = useRef();
    const [searchTerm, setSearchTerm] = useState('');
console.log(videos);

    const lastVideoElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            dispatch(fetchVideos()); // Fetch more videos
          }
        });
        if (node) observer.current.observe(node);
      }, [loading, dispatch]);
    
      useEffect(() => {
        dispatch(fetchVideos()); // Initial fetch
      }, [dispatch]);

    //   const handleSearch = (e) => {
    //     e.preventDefault();
    //     if (searchTerm.trim() !== '') {
    //       dispatch(searchVideos(searchTerm)); // Dispatch the search action
    //     }
    //   };
    // const handleSearch = (term) => {
    //     if (term.trim() !== '') {
    //         dispatch(searchVideos(term)); // Dispatch the search action
    //     }
    // };

    const handleSearchClick = () => {
        dispatch(searchVideos(searchTerm)); // Trigger the search with the current searchTerm
    };

  return (
    <div className='main-wrapper'>
        <header className='header'>
            <div className="youtube-logo"> </div> 
            <Paper className='search' component="form" onSubmit={(e) => { e.preventDefault(); handleSearchClick(); }} sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }} >
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" inputProps={{ 'aria-label': 'Search' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClick}>
                    <SearchIcon />
                </IconButton>
            </Paper>  
        </header>
      {isSignedIn ? (
        <>
            {/* <p>User is signed in</p> */}
            <Button className="signOutButton" variant="outlined" size="medium" startIcon={<DoubleArrowIcon />} onClick={signOut}> Sign Out </Button> 
            <div className="display-video">
              {videos.map((video, index) => (
                <div className="video-content" key={video.id.videoId} ref={videos.length === index + 1 ? lastVideoElementRef : null}>
                  <div className='meta'>
                    <Link to={`/video/${video.id.videoId}`} className='meta-link'>
                      <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
                      <h4>{video.snippet.title}</h4>
                    </Link>
                  </div>  
                  <div className='metadata'>
                    {/* Link to the channel */}
                    <a href={`https://www.youtube.com/channel/${video.snippet.channelId}`} target="_blank" rel="noopener noreferrer">
                      {video.snippet.channelTitle}
                    </a>
                    {/* Format the publish time to 'time ago' format */}
                    <p>{formatDistanceToNow(new Date(video.snippet.publishTime))} ago</p>
                  </div>
                </div>
            
              ))}
            </div>
        </>    
      ) : (
        <>
            {/* <p>User is not signed in</p> */}
                <Button className="signInButton" variant="outlined" startIcon={<AccountCircleIcon />} size="medium" onClick={signIn}> Sign in </Button>  
                <div className='message'>
                    <h3>Please signIn and try searching to get started</h3>
                </div>
        </>    
      )}
      {/* Your application content goes here */}
    </div>
  )
}

export default ListingScreen
