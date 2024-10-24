require('dotenv').config();
const cors = require('cors');
require('./models');
const express = require('express');
const router = require('./routes');
const app = express();
const url = '3333';
const cookieParser = require('cookie-parser');

//recursos do servidor
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(express.static("public"));

//porta do servidor
app.listen(url, ()=>{
    console.log(`Runnig at port ${url}`)
});