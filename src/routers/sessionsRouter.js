const express = require('express'); 
const debug = require('debug')('app:sessionRouter'); 
const { MongoClient } = require('mongodb'); 
const sessions = require('../data/sessions.json');

const sessionsRouter = express.Router(); 

sessionsRouter.route('/').get((req, res) => {

   res.render('sessions'), {
    sessions,
   }
});

sessionsRouter.route('/:id').get((req, res) => {
    const id = req.params.id;
    res.render('session', { 
        session: sessions[id], 
    }); 
});

module.exports = sessionsRouter; 


/**
 *  const url = 'mongodb+srv://dbUser:vw6SzyYD19iGxWkr@globomantics.4uermfy.mongodb.net?retryWrites=true&w=majority';
    const dbName = 'globomantics';

    (async function mongo(){
        let client; 
        try{
            client = new MongoClient(url);
            await client.connect(); // important
            debug('Connected to the mongo DB'); 

            const db = client.db(dbName); 
            const sessions = await db.collection('sessions').find().toArray();
            res.render('sessions', {sessions});
        } catch (error){
            debug(error.stack);
        }
        finally {
            if (client) {
                await client.close();
            }
        }
    })();

 */