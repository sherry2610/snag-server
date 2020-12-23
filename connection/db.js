const mongoose = require('mongoose');

const URI = 'mongodb+srv://snagIt:snagitdb@cluster0.0ty7k.mongodb.net/<dbname>?retryWrites=true&w=majority';

const connectDB = async () => {
  await mongoose.connect(URI,{useUnifiedTopology:true,useNewUrlParser:true})
  console.log("connected to atlas!!!!")
}

module.exports = connectDB;