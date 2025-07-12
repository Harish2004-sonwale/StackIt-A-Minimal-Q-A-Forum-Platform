const axios = require('axios');

// UptimeRobot API configuration
const UPTIMEROBOT_API_KEY = process.env.UPTIMEROBOT_API_KEY;
const WEBSITE_URL = process.env.CLIENT_URL;
const API_URL = process.env.API_URL;

async function setupUptimeMonitoring() {
    try {
        // Add website monitoring
        const websiteResponse = await axios.post('https://api.uptimerobot.com/v2/newMonitor', {
            api_key: UPTIMEROBOT_API_KEY,
            friendly_name: 'StackIt Website',
            url: WEBSITE_URL,
            type: 1, // HTTP
            interval: 300, // Check every 5 minutes
            keyword_type: 1, // Contains
            keyword_value: 'StackIt',
            alert_contacts: [''] // Add your alert contact IDs
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Add API monitoring
        const apiResponse = await axios.post('https://api.uptimerobot.com/v2/newMonitor', {
            api_key: UPTIMEROBOT_API_KEY,
            friendly_name: 'StackIt API',
            url: API_URL,
            type: 1, // HTTP
            interval: 300, // Check every 5 minutes
            keyword_type: 1, // Contains
            keyword_value: 'success',
            alert_contacts: [''] // Add your alert contact IDs
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Monitoring setup completed successfully!');
        console.log('Website Monitor ID:', websiteResponse.data.monitors[0].id);
        console.log('API Monitor ID:', apiResponse.data.monitors[0].id);

    } catch (error) {
        console.error('Error setting up monitoring:', error.response?.data || error.message);
        throw error;
    }
}

setupUptimeMonitoring().catch(console.error);
