import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos, searchVideos, fetchSuggestions } from '../redux/videoSlice';
import { useAuth } from './useAuth';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { formatDistanceToNow } from 'date-fns';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Sidebar from './sidebar';  // Import the Sidebar component

const drawerWidth = 240;

function ListingScreen() {
    const { isSignedIn, signIn, signOut } = useAuth();
    const { videos, loading, suggestions } = useSelector((state) => state.videos); 
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);  // State for suggestion menu
    const inputRef = useRef(null);  // Reference to the input element
    const observer = useRef();
    const dispatch = useDispatch();
    // const [mobileOpen, setMobileOpen] = useState(false);

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


    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            dispatch(fetchSuggestions(value));  // Dispatch the fetchSuggestions thunk
            setAnchorEl(inputRef.current);  // Set anchor for the menu
        } else {
            setAnchorEl(null);  // Close suggestions when input is empty
        }
    };

    const handleSearchClick = () => {
        dispatch(searchVideos(searchTerm)); // Trigger the search with the current searchTerm
        setAnchorEl(null);  // Close the suggestion menu
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);  // Set the clicked suggestion as the search term
        handleSearchClick();  // Trigger the search
    };

    // const handleDrawerTransitionEnd = () => {
    //     setIsClosing(false);
    // };

    // const handleDrawerToggle = () => {
    //     if (!isClosing) {
    //         setMobileOpen(!mobileOpen);
    //     }
    // };

    return (
      
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar className='header' position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <div className='youtube-logo'></div>
                    <Box sx={{ flexGrow: 1 }} />
                    <Paper
                        className='search'
                        component="form"
                        onSubmit={(e) => { e.preventDefault(); handleSearchClick(); }}
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 500 }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'Search' }}
                            value={searchTerm}
                            // onChange={(e) => setSearchTerm(e.target.value)}
                            onChange={handleSearchInputChange}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchClick}>
                            <SearchIcon />
                        </IconButton>
                        {/* Suggestions Dropdown */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            {suggestions.map((suggestion, index) => (
                                <MenuItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                    {suggestion}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Paper>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    // open={mobileOpen}
                    //onTransitionEnd={handleDrawerTransitionEnd}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <Sidebar />  {/* Use the Sidebar component */}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <Sidebar />  {/* Use the Sidebar component */}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar /> {/* To offset the content below the header */}
                {isSignedIn ? (
                    <>
                        <Button className="signOutButton" variant="outlined" size="medium" startIcon={<DoubleArrowIcon />} onClick={signOut}> Sign Out </Button>
                        <div className="display-video">
                            {videos.map((video, index) => (
                                <div className="video-content" key={video.id.videoId} ref={videos.length === index + 1 ? lastVideoElementRef : null}>
                                    <div className='meta'>
                                        <Link to={`/video/${video.id.videoId}`} className='meta-link'>
                                            <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} />
                                            <h4 className='video-title'>{video.snippet.title}</h4>
                                        </Link>
                                    </div>
                                    <div className='metadata'>
                                        <a href={`https://www.youtube.com/channel/${video.snippet.channelId}`} target="_blank" rel="noopener noreferrer">
                                            {video.snippet.channelTitle}
                                        </a>
                                        <span>|</span>
                                        <p>{formatDistanceToNow(new Date(video.snippet.publishTime))
                                            .replace('about', '')  // Remove "about"
                                            .replace('over', '')     // Remove "ago"
                                            .replace('almost', '')  // Remove "almost"
                                            .trim()} ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <Button className="signInButton" variant="outlined" startIcon={<AccountCircleIcon />} size="medium" onClick={signIn}> Sign in </Button>
                        <div className='message'>
                            <h3>Please sign in and try searching to get started</h3>
                        </div>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default ListingScreen;
