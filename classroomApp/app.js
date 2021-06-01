const express = require('express');
const app = express();
const classRoomPeople = require('./server/services/getClassroomPeople');
const compression = require('compression');
const helmet = require('helmet');
const router = require('./server/routes/router');
const connection = require('./server/database/connection');
const parser = require('body-parser');
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = new socketIo.Server(server);
const path = require('path');
const searcher = require('./server/services/search');

app.use(compression({level: 9, threshold: 0}));
app.set('view engine', 'ejs')
app.use(parser.json({
    type : ['json', 'application/csp-report']
}));
app.use(parser.urlencoded({extended: false}));
app.use(helmet.noSniff());
app.use(helmet.dnsPrefetchControl({allow : false}));
app.use(helmet.hidePoweredBy({
    setTo : 'PHP'
}));
app.use(helmet.ieNoOpen());
app.use(helmet.referrerPolicy({policy : 'same-origin'}));
app.use(helmet.xssFilter());
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
        classRoomPeople.removeFromClass("student", data);
    });
    socket.on('removeTeacher', (data) => {
        classRoomPeople.removeFromClass("teacher", data);
    })
    socket.on('searchAddPeople', (data) => {
      classRoomPeople.addPeopleToClassSearch(data).then(dataFound => {
          socket.emit('searchAddPeopleResult', {searchedResult : dataFound});
      })
    })
    socket.on('addPeopleToClass', async data => {
        await classRoomPeople.addPeopleToClass(data);
        socket.emit('addComplete', {});
    })
})

server.listen(8000);
