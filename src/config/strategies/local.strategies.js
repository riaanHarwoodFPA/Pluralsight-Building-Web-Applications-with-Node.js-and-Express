const passport = require('passport'); 
const { Strategy } = require('passport-local'); 
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password' 
      },
      (username, password, done) => {
          const url = process.env.MONGODB_URI;
          const dbName = process.env.MONGODB_DBNAME;
          (async function validateUser() { 
            let client;
            try {
                client = new MongoClient(url);
                await client.connect(); // important
                debug('Connected to the mongo DB');
              
                const db = client.db(dbName);
                const user = await db.collection('users').findOne({ username }); 
                if (user && user.password === password) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            }
            catch (error) {
                done(error, false);
            }
            finally {
                if (client) {
                    await client.close();
                }
            }
          }()); 
      }
    )
  );
};