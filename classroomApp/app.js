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
const classRoomPeople = require('./server/services/getClassroomPeople');
const compression = require('compression');

app.use(compression({level: 9, threshold: 0}));
app.set('view engine', 'ejs')
app.use(parser.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, './public')));
connection();
app.use(router);

io.on('connection', (socket) => {
    socket.on('searchQuery', (query) => {
        searcher.searchFunction(String(query.querySearched)).then(data => {
            socket.emit('searchResult', {result: data})
        }).catch(err => {
            console.log(err);
        });
    })
    socket.on('getAllData', (data) => {
        classRoomPeople.allDataGiver(data).then(t => {
            socket.emit('sendAllData', {
                stat: t.adminStat,
                teachers: t.teacherDataInClass,
                students: t.studentDataInClass
            });
        }).catch(err => {
            console.log(err);
        });
    });
    socket.on('removeStudent', (data) => {
        console.log(JSON.stringify(data));
    });
    socket.on('removeTeacher', (data) => {
        console.log(JSON.stringify(data));
    })
})

server.listen(8000);