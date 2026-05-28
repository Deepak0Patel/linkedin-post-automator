const mongoose = require('mongoose')

async function connectDB(){
  try {
        const conn = await mongoose.connect(process.env.MONODB_URI,{
        serverSelectionTimeoutMS:5000,
    })

    console.log(`MonogoDB connected:${conn.connection.host}`);
    } catch (error) {
       console.error(`MongoDB connection error${error.message}`) 
    }
}

module.exports=connectDB;