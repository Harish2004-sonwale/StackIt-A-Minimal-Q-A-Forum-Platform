import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

export const usePerformance = () => {
    const [metrics, setMetrics] = useState(null);

    // Get memory usage
    const getMemoryUsage = () => {
        const memory = process.memoryUsage();
        const rss = Math.round(memory.rss / 1024 / 1024); // Resident Set Size in MB
        const heapTotal = Math.round(memory.heapTotal / 1024 / 1024); // Total heap allocated in MB
        const heapUsed = Math.round(memory.heapUsed / 1024 / 1024); // Used heap in MB
        return {
            rss,
            heapTotal,
            heapUsed,
            heapFree: heapTotal - heapUsed
        };
    };

    // Get CPU usage
    const getCpuUsage = () => {
        const start = process.hrtime();
        // Do some work
        const end = process.hrtime(start);
        const cpuTime = (end[0] * 1e9 + end[1]) / 1e6; // Convert to milliseconds
        return cpuTime;
    };

    // Get response time
    const getResponseTime = async (url) => {
        const start = Date.now();
        try {
            await fetch(url);
            return Date.now() - start;
        } catch (error) {
            return null;
        }
    };

    // Monitor performance
    useEffect(() => {
        const interval = setInterval(async () => {
            const memory = getMemoryUsage();
            const cpu = getCpuUsage();
            const responseTime = await getResponseTime('/api/health');

            setMetrics({
                memoryUsage: memory.heapUsed / memory.heapTotal * 100,
                cpuUsage: cpu,
                responseTime,
                timestamp: new Date().toISOString()
            });
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return { performanceMetrics: metrics };
};

export default usePerformance;
