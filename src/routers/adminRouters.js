const express = require('express');
const debug = require('debug')('app:adminRouter'); 
const { MongoClient } = require('mongodb'); 
const adminRouter = express.Router();
const sessions = require('../data/sessions.json');



adminRouter.route('/').get((req, res) => {
    const url = "mongodb+srv://dbUser:<M9BdpQMZ-FvF6yw>@globomantics.anfnram.mongodb.net/?appName=Globomantics";
    const dbName = 'Globalmantics';
    (async function mongo() {
        let client;
        try {
        client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        debug('Connected to MongoDB');
        const db = client.db(dbName);

        const response = await db.collection('sessions').insertMany(sessions);
        res.json(response);
        } catch (error) {
        debug(error.stack);
        res.status(500).json({ error: 'Database error' });
        } finally {
        if (client) {
            await client.close();
        }
        }
    })();
});


module.exports = adminRouter; 


