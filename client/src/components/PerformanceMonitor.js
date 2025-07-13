import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useQuery } from 'react-query';
import { usePerformance } from '../hooks/usePerformance';

const PerformanceMonitor = () => {
    const [showAlert, setShowAlert] = useState(false);
    const { performanceMetrics } = usePerformance();

    // Monitor performance metrics
    useEffect(() => {
        if (performanceMetrics) {
            const { memoryUsage, cpuUsage, responseTime } = performanceMetrics;
            
            // Check for performance issues
            if (memoryUsage > 80 || cpuUsage > 80 || responseTime > 2000) {
                setShowAlert(true);
            }
        }
    }, [performanceMetrics]);

    // Handle performance alert
    const handleAlert = () => {
        // Log performance issue
        console.warn('Performance Alert:', performanceMetrics);
        // Send alert to monitoring service
        // sendPerformanceAlert(performanceMetrics);
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 0, right: 0, p: 2, zIndex: 1000 }}>
            {showAlert && (
                <Alert severity="warning" onClose={() => setShowAlert(false)}>
                    Performance Alert: High resource usage detected
                </Alert>
            )}
            <Button 
                variant="outlined" 
                size="small"
                onClick={handleAlert}
                sx={{ display: 'none' }} // Hidden by default
            >
                Check Performance
            </Button>
        </Box>
    );
};

export default PerformanceMonitor;
