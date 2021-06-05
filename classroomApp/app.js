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
const schema = require('./server/model/schema');
const uid = require('uniqid');
const searcher = require('./server/services/search');
const sessions = require('./server/services/sessionServices');

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
    socket.on('login', async (dataFromClient) => {
        let idType = String(dataFromClient.loginType);
        if ("teach" === idType) {
            await schema.teacher.find({
                Username: dataFromClient.Username,
                Password: dataFromClient.Password
            }).then(data => {
                if (!(!data) && data[0] !== undefined && data !== []) {
                    if (data[0].Username === dataFromClient.Username) {
                        const sessionId = uid()
                        socket.emit('loginResult', {error : false, status : true, id : data[0].t_Id, idType : 'teach', sentID : sessionId});
                    } else {
                        socket.emit('loginResult', {error : false, status : false});
                    }
                } else {
                    socket.emit('loginResult', {error : false, status : false});
                }
            }).catch(err => {
                console.log(err);
                socket.emit('loginResult', {error : 'There was an error logging you in, please don not retry', status : false});
            });
        } else if (idType === 'learn') {
            await schema.student.find({
                Username: dataFromClient.Username,
                Password: dataFromClient.Password
            }).then(data => {
                if (!(!data) && data[0] !== undefined && data !== []) {
                    if (data[0].Username === dataFromClient.Username) {
                        const sessionId = uid();
                        socket.emit('loginResult', {error : false, status : true, id : data[0].s_Id, idType : 'learn', sentID : sessionId});
                    } else {
                        socket.emit('loginResult', {error : false, status : false});
                    }
                } else {
                    socket.emit('loginResult', {error : false, status : false});
                }
            }).catch(err => {
                console.log(err);
                socket.emit('loginResult', {error : 'There was an error logging in, please don not try again', status : false})
            });
        } else {
            socket.emit('loginResult', {error : 'id type used in url not found.', status : false});
        }
    })
    socket.on('sessionData', (data) => {
        console.log(data);
    });
})

server.listen(8000);
