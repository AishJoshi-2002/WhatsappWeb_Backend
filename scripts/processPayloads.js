const fs = require('fs');
const path = require('path');
const { connectToDb, disconnectFromDb } = require('../utils/db');
const { processPayloadMessages, processPayloadStatuses } = require('../utils/sharedProcessPayload');

const runScript = async () => {
    try {
        await connectToDb();
        const folderPath = path.join(__dirname, '../whatsappSamplePayloads');
        const files = fs.readdirSync(folderPath);
        for (const file of files) {
            if (!file.endsWith('.json')) {
                continue;
            }
            const data = JSON.parse(fs.readFileSync(path.join(folderPath, file)));
            if (file.includes('_message')) {
                await processPayloadMessages(data);
            } else if (file.includes('_status')) {
                // await processPayloadStatuses(data);
            }
            console.log('Processed file: ', file);
        }
        console.log('All whatsapp sample payloads processed');
    } catch (err) {
        console.error("Error in running script: ", err);
    } finally {
        await disconnectFromDb();
        process.exit(0);
    }
}

runScript();