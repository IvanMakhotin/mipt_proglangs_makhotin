'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const model = require('./model');

var app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: 'task',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    const {session} = req;
    if (!session.player) {
        session.player = model.getPlayer();

        next();
    } else if (model.hasPlayer(session.player)) {
        next();
    } else {
        res.status(400).send('Вы не являетесь участником текущей игры.');
    }
});

app.use(express.static(path.join(__dirname, 'static')));

require('./routes')(app);

const port = 5000;

http.createServer(app).listen(port, () => {
    console.log('Express server listening on port ' + port);
});