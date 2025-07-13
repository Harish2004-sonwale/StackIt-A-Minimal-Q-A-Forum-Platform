const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const moment = require('moment');

const backupDir = path.join(__dirname, '../backups');
const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const backupFile = path.join(backupDir, `stackit_backup_${timestamp}.json`);

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function backupDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        const db = client.db();
        
        console.log('Starting database backup...');
        
        // Collections to backup
        const collections = ['users', 'questions', 'answers', 'votes', 'notifications'];
        const backupData = {};

        // Backup each collection
        for (const collectionName of collections) {
            console.log(`Backing up collection: ${collectionName}`);
            try {
                const collection = db.collection(collectionName);
                const docs = await collection.find({}).toArray();
                backupData[collectionName] = docs;
                console.log(`Successfully backed up ${docs.length} documents from ${collectionName}`);
            } catch (error) {
                console.error(`Error backing up ${collectionName}:`, error);
                // Continue with other collections
            }
        }

        // Write to file
        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
        console.log(`Backup completed successfully: ${backupFile}`);
        console.log(`Backup size: ${(fs.statSync(backupFile).size / (1024 * 1024)).toFixed(2)} MB`);

    } catch (error) {
        console.error('Backup failed:', error);
        console.error('Error details:', {
            timestamp: moment().format(),
            errorType: error.constructor.name,
            errorMessage: error.message
        });
        throw error;
    } finally {
        console.log('Closing MongoDB connection...');
        await client.close();
    }
}

backupDatabase().catch(console.error);
