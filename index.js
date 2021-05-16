const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoute = require('./routes/posts');

//import routes
const authRoute = require('./routes/auth');

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }).then(() => {
      console.log("Veritabanına bağlandı!!")
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


//Route middlewares
//bu endpoint geldiğinde authRoute çalışsın
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => {
    console.log("Up and running!!");
});