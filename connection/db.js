const mongoose = require('mongoose');

const URI = 'mongodb+srv://snagIt:snagitdb@cluster0.0ty7k.mongodb.net/forheroku?retryWrites=true&w=majority';

const connectDB = async () => {
  await mongoose.connect(URI,{useUnifiedTopology:false,useNewUrlParser:true, useFindAndModify: false})
  console.log("connected to atlas!!!!")
}

module.exports = connectDB;