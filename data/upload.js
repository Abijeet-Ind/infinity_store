const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' })
const product = require('../model/productModel'); 

const mongodbConnect = process.env.MONGODB_ID.replace('<MOGODB_PASSWORD>', process.env.MOGODB_PASSWORD);
mongoose.connect(mongodbConnect)
    .then(() => console.log('CONNECTION SUCCESSFULL'))
    .catch(err => console.log(err.message))

const mainData = JSON.parse(fs.readFileSync('./data/test/Test_Data.json', 'utf-8'));
// console.log(mainData);

const importData = async () => {
    try{
        await product.create(mainData, { validateBeforeSave: false })
    } catch (err) {
        console.log(err.message)
    }
}

// const deleteData = async () => {
//     try{
//         await product.deleteMany()
//     } catch (err) {
//         console.log(err.message)
//     }
// }

if(process.argv[2] === '--import'){
    importData();
    console.log('DATA UPLOADED SUCCESSFULLY');
}
//  else if(process.argv[2] === '--delete'){
//     deleteData();
//     console.log('DATA UPLOADED SUCCESSFULLY');
// }