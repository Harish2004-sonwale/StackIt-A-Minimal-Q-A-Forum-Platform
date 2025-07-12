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
        await client.connect();
        const db = client.db();
        
        // Collections to backup
        const collections = ['users', 'questions', 'answers', 'votes', 'notifications'];
        const backupData = {};

        // Backup each collection
        for (const collectionName of collections) {
            const collection = db.collection(collectionName);
            const docs = await collection.find({}).toArray();
            backupData[collectionName] = docs;
        }

        // Write to file
        fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
        console.log(`Backup completed successfully: ${backupFile}`);

    } catch (error) {
        console.error('Backup failed:', error);
        throw error;
    } finally {
        await client.close();
    }
}

backupDatabase().catch(console.error);
