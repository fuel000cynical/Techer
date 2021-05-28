const express = require('express');
const app = express();
const router = require('./server/routes/router');
const connection = require('./server/database/connection');
const parser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = new socketIo.Server(server);
const path = require('path');
const searcher = require('./server/services/search');

app.set('view engine', 'ejs')
app.use(parser.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, './public')));

connection();

app.use(router);

io.on('connection', (socket) => {
    socket.on('searchQuery', (query) => {
        searcher.searchFunction(String(query.querySearched)).then(data => {
            socket.emit('searchResult', {result: data})
        })
    })
})

server.listen(8000);