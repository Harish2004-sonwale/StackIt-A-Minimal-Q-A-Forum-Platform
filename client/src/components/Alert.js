import React from 'react';
import { useSelector } from 'react-redux';
import {
    Alert as MuiAlert,
    Snackbar,
    Slide,
    IconButton,
    CloseIcon
} from '@mui/material';

const Alert = () => {
    const alert = useSelector((state) => state.alert);

    const handleClose = () => {
        // Clear the alert state
        window.store.dispatch({ type: 'alert/clearAlert' });
    };

    if (!alert.message) return null;

    return (
        <Snackbar
            open={!!alert.message}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={5000}
            TransitionComponent={Slide}
            onClose={handleClose}
        >
            <MuiAlert
                severity={alert.type || 'info'}
                action={
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                sx={{ width: '100%' }}
            >
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
};

export default Alert;
