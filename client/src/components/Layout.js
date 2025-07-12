import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton, Badge, Avatar } from '@mui/material';
import { Notifications, Menu, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        StackIt
                    </Typography>
                    <IconButton color="inherit" onClick={() => navigate('/ask')}>
                        Ask Question
                    </IconButton>
                    <IconButton color="inherit" onClick={() => navigate('/notifications')}>
                        <Badge badgeContent={0} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={() => navigate('/profile')}>
                        <Avatar>{user?.username?.[0]}</Avatar>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        Logout
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container component="main" sx={{ mt: 8, mb: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
