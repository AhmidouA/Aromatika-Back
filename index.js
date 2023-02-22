const express = require('express');
const app = express();
require('dotenv').config();
const {oilRouter, userRouter} = require('./server/routers');

// formatage de données envoyées à un serveur 
app.use(express.urlencoded({extended:true}));
// app.use(express.json());

// Le port du serveur
const PORT = process.env.PORT ?? 3000;

// utilisation des views pour le client (TEST)
app.set('view engine', 'ejs');
app.set('views', './server/views')

// middleware Session
const session = require('express-session');
app.use(
    session({
        saveUninitialized: true,
        resave: true,
        secret: process.env.SECRET,
    })
);


// utilisation de nos routes
app.use(userRouter);
app.use(oilRouter);


// l'écoute du serveur
app.listen (PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})