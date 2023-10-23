const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.2ffg1hp.mongodb.net/mobileWork?retryWrites=true&w=majority`)
     .then(() => {
          console.log('Database connection successful: Database', process.env.DB_USER);
     })
     .catch((error) => {
          console.error('Database connection failed: ', error);
     });
