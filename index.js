const express = require('express');
const app = express();
require('dotenv').config();
const {oilRouter, userRouter} = require('./app/routers');


app.use(express.urlencoded({extended:true}));
// app.use(express.json());


const PORT = process.env.PORT ?? 3000;

app.set('view engine', 'ejs');
app.set('views', './app/views')


app.use(userRouter);
app.use(oilRouter);

app.listen (PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})