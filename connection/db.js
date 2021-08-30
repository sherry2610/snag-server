const mongoose = require('mongoose');

// const URI = 'mongodb+srv://snagIt:snagitdb@cluster0.0ty7k.mongodb.net/<dbname>?retryWrites=true&w=majority';
const URI = 'mongodb+srv://ahmed:ahmed123@cluster0.55mjw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const connectDB = async () => {
  await mongoose.connect(URI,{useUnifiedTopology:false,useNewUrlParser:true, useFindAndModify: false})
  console.log("connected to MONGO atlas!!!!")
}

module.exports = connectDB;