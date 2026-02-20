const express = require('express');
const debug = require('debug')('app:sessionRouter');
const { MongoClient, ObjectId } = require('mongodb');


const authRouter = express.Router();

authRouter.route('/signUp').post((req, res) => {
    //TODO create user
    req.login(req.body, () =>{
        res.redirect('/auth/profile'); 
    });
});

authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
}); 

module.exports = authRouter; 


