import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ShortTextIcon from '@mui/icons-material/ShortText';

const Sidebar = () => {
    return (
        <div>
            {/* Home, Shorts, Subscriptions */}
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ShortTextIcon />
                    </ListItemIcon>
                    <ListItemText primary="Shorts" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <SubscriptionsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Subscriptions" />
                </ListItem>
            </List>

            <Divider />

            {/* 'You' Section */}
            <Typography variant="subtitle1" style={{ padding: '10px 16px' }}>
                You
            </Typography>
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="History" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <PlaylistPlayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Playlists" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <WatchLaterIcon />
                    </ListItemIcon>
                    <ListItemText primary="Watch later" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ThumbUpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Liked videos" />
                </ListItem>
            </List>

            <Divider />

            {/* 'Explore' Section */}
            <Typography variant="subtitle1" style={{ padding: '10px 16px' }}>
                Explore
            </Typography>
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <WhatshotIcon />
                    </ListItemIcon>
                    <ListItemText primary="Trending" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <ShoppingBagIcon />
                    </ListItemIcon>
                    <ListItemText primary="Shopping" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <MusicNoteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Music" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <MovieIcon />
                    </ListItemIcon>
                    <ListItemText primary="Movies" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <LiveTvIcon />
                    </ListItemIcon>
                    <ListItemText primary="Live" />
                </ListItem>
            </List>
        </div>
    );
};

export default Sidebar;
