import React from 'react';
import {
    CircularProgress,
    Box,
    Typography,
    Paper,
    Container,
    Grid,
    Alert
} from '@mui/material';

const Loading = ({ message = 'Loading...', error = null }) => {
    if (error) {
        return (
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                    <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                        Please wait while we fix this...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" align="center">
                        {message}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Loading;
