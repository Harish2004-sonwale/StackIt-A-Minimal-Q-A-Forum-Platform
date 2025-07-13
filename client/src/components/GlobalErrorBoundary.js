import React, { Component } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Snackbar
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePerformance } from '../hooks/usePerformance';

class GlobalErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            loading: false,
            recoveryAttempted: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo,
            loading: false
        });
        
        // Log error to monitoring service
        console.error('Error caught by GlobalErrorBoundary:', {
            error,
            errorInfo,
            timestamp: new Date().toISOString(),
            location: window.location.pathname
        });
    }

    componentDidMount() {
        // Monitor performance
        const { performanceMetrics } = this.props;
        if (performanceMetrics) {
            const { memoryUsage, cpuUsage, responseTime } = performanceMetrics;
            
            // Check for performance issues
            if (memoryUsage > 80 || cpuUsage > 80 || responseTime > 2000) {
                this.setState({ loading: true });
                this.handleRecovery();
            }
        }
    }

    handleRecovery = async () => {
        try {
            // Attempt to recover
            await this.props.api.get('/api/health');
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                recoveryAttempted: true
            });
        } catch (error) {
            console.error('Recovery failed:', error);
            this.setState({ loading: false });
        }
    };

    handleLogout = () => {
        const { auth } = this.props;
        auth.logout();
        window.location.href = '/login';
    };

    render() {
        const { hasError, error, loading, recoveryAttempted } = this.state;
        const { children } = this.props;

        if (loading) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        bgcolor: 'background.paper'
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }

        if (hasError) {
            return (
                <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
                    <Paper elevation={3} sx={{ p: 4, mx: 2, my: 4 }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            An unexpected error occurred
                        </Alert>
                        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                            Something went wrong
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                            {error?.message || 'Please try again later'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleRecovery}
                                disabled={recoveryAttempted}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={this.handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return children;
    }
}

export default GlobalErrorBoundary;
