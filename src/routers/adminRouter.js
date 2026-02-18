const { greenBright } = require('chalk');
const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient } = require('mongodb');
const sessions = require('../data/sessions.json');

const adminRouter = express.Router();


adminRouter.route('/').get((req, res) => {
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DBNAME;
    (async function mongo() {
        let client;
        try {
            client = new MongoClient(url);
            await client.connect(); // important
            debug('Connected to the mongo DB');

            const db = client.db(dbName);
            const response = await db.collection('sessions').insertMany(sessions);
            res.json(response);
        } catch (error) {
            debug(error.stack);
        }
        finally {
            if (client) {
                await client.close();
            }
        }
    })();
});

module.exports = adminRouter;
