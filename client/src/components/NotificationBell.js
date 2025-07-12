import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const NotificationBell = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        // Mark all notifications as read when opening menu
        if (unreadCount > 0) {
            axios.put('/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).catch(error => console.error('Error marking notifications as read:', error));
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (link) => {
        handleClose();
        window.location.href = link;
    };

    return (
        <Box sx={{ ml: 2 }}>
            <IconButton
                color="inherit"
                onClick={handleOpen}
                size="large"
            >
                {loading ? (
                    <CircularProgress size={24} />
                ) : (
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                )}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                PaperProps={{
                    sx: {
                        width: 350,
                        maxHeight: 400,
                        overflow: 'auto'
                    }
                }}
            >
                {loading ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography>No notifications yet</Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <React.Fragment key={notification._id}>
                            <MenuItem
                                onClick={() => handleNotificationClick(notification.link)}
                                sx={{
                                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                <ListItemIcon>
                                    {notification.type === 'answer' && <NotificationsActiveIcon />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={notification.message}
                                    secondary={
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </Typography>
                                    }
                                />
                            </MenuItem>
                            <Divider />
                        </React.Fragment>
                    ))
                )}
            </Menu>
        </Box>
    );
};

export default NotificationBell;
