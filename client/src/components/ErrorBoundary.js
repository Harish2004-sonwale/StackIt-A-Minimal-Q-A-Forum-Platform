import React, { Component } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Alert,
    Container,
    IconButton
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to external service if needed
        console.error('Error caught:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Something went wrong! Please try again or contact support.
                        </Alert>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                                An unexpected error occurred
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                                {this.state.error?.message || 'Please try again later'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<RefreshIcon />}
                                    onClick={this.handleRetry}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload Page
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
