const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectId } = require('mongodb');
const passport = require('passport');


const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {

    const { username, password } = req.body;
    const url = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DBNAME;

    (async function addUser(){
        let client; 
        try{
            client = await MongoClient.connect(url);
            const db = client.db(dbName); 

            const user = { username, password };  
            
            const results = await db.collection('users').insertOne(user); 
            debug(results); 

            req.login(user, () => {
                res.redirect('/auth/profile'); 
            });

        } catch (error){
            debug(error);
            res.status(500).send("Error creating user");
        } finally {
            if (client) {
                await client.close();
            }
        }
    })();  
});

authRouter.route('/signIn').get((req, res) => { 
    res.render('signin');
})
.post(
    passport.authenticate('local', 
        { successRedirect: '/auth/profile', 
          failureRedirect: '/' 
    }) 
);


authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
}); 

module.exports = authRouter; 



