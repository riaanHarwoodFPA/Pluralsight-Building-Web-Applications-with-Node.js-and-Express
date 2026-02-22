const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectId } = require('mongodb');

const sessions = require('../data/sessions.json');
const sessionsRouter = express.Router();

sessionsRouter.use((req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect('/auth/signIn');
    }
}); 

sessionsRouter.route('/').get((req, res) => {

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DBNAME;

    (async function mongo() {
        let client;
        try {
            client = new MongoClient(url);
            await client.connect(); // important
            debug('Connected to the mongo DB');

            const db = client.db(dbName);
            const sessions = await db.collection('sessions').find().toArray();
            res.render('sessions', { sessions });
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

sessionsRouter.route('/:id').get((req, res) => {
    const id = req.params.id;

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DBNAME;

    (async function mongo() {
        let client;
        try {
            client = new MongoClient(url);
            await client.connect();

            const db = client.db(dbName);
            const session = await db
                .collection('sessions')
                .findOne({ _id: new ObjectId(id) });

            if (!session) {
                return res.status(404).send('Session not found');
            }

            res.render('session', { 
                session, 
            });

        } catch (error) {
            debug(error.stack);
            res.status(500).send('Database connection failed');

        } finally {
            if (client) {
                await client.close();
            }
        }
    })();
});


module.exports = sessionsRouter;
