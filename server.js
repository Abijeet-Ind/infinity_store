const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' })

// console.log(process.env.NODE_ENV) // npm run env NODE_ENV=production use this if development and production wont shift
//  BETTER TO USE TERMINAL TO SWITCH BETWEEN PRODUCTION AND DEVELOPMENT 

const mongodbConnect = process.env.MONGODB_ID.replace('<MOGODB_PASSWORD>', process.env.MOGODB_PASSWORD);
mongoose.connect(mongodbConnect)
    .then(() => console.log('CONNECTION SUCCESSFULL'))
    .catch(err => console.log(err.message))

const port = 3000 || process.env.PORT;
const Server = app.listen(port, () => {
    console.log(`SERVER IS LISTENING AT ${port}`)
})