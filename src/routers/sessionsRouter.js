const express = require('express'); 
const debug = require('debug')('app:sessionRouter'); 
const { MongoClient } = require('mongodb'); 
const sessions = require('../data/sessions.json');

const sessionsRouter = express.Router(); 

sessionsRouter.route('/').get((req, res) => {

    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DBNAME;
    (async function mongo(){
        let client; 
        try{
            client = new MongoClient(url);
            await client.connect(); // important
            debug('Connected to the mongo DB'); 

            const db = client.db(dbName); 
            const sessions = await db.collection('sessions').find().toArray();
            res.render('sessions', { sessions });
        } catch (error){
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
    res.render('session', { 
        session: sessions[id], 
    }); 
});

module.exports = sessionsRouter; 