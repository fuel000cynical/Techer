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

app.use(compression({level: 9, threshold: 0}));
app.set('view engine', 'ejs');
app.use(parser.json({
    type : ['json', 'application/csp-report']
}));
app.use(parser({
    uploadDir: path.resolve(__dirname, './upload')
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
app.use('/classroom/:idType/:id/:classId/uploads', express.static(path.resolve(__dirname, './server/routes/upload')));

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
                        const sesionData = schema.sessionModel({
                            userType : 'teach',
                            userName : data[0].Username,
                            userId : data[0].t_Id
                        });
                        sesionData.save().then(session => {
                            socket.emit('loginResult', {error : false, status : true, id : data[0].t_Id, idType : 'teach', sentID : session._id});
                        }).catch(err => {
                            console.log(err);
                            socket.emit('loginResult', {error : 'There was an error creating your session', status : false});
                        });
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
                        const sesionData = schema.sessionModel({
                            userType : 'learn',
                            userName : data[0].Username,
                            userId : data[0].s_Id
                        });
                        sesionData.save().then(session => {
                            socket.emit('loginResult', {error : false, status : true, id : data[0].s_Id, idType : 'learn', sentID : session._id});
                        }).catch(err => {
                            console.log(err);
                            socket.emit('loginResult', {error : 'There was an error creating your session', status : false});
                        });
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
    socket.on('checkSesion', (data) => {
        schema.sessionModel.findById(data.sessionId).then(sessionData => {
            if(!!sessionData && sessionData !== null){
                socket.emit('checkSesionResult', {error : false, status : true, idType : sessionData.userType, userId : sessionData.userId});
            }else{
                socket.emit('checkSesionResult', {error : false, status : false});
            }
        }).catch(err => {
            console.log(err);
            socket.emit('checkSesionResult', {error : 'There was an error retrieving your session data, please login again'});
        })
    });
    socket.on('signOut', (data) => {
        schema.sessionModel.findByIdAndDelete(data.sesionId).catch(err => {
            console.log(err);
        });
    })
    socket.on('getAdminStatus', (data) => {
        schema.teacher.findOne({t_Id : data.userId}).then(data => {
            socket.emit('resultAdminStatus', {adminStat : data.Admin});
        })
    })
    socket.on('getAssignments', (data) => {
        schema.assignmentModel.find({class : data.classId}).then(assignments => {
            socket.emit('getAssignmentsAnswer', assignments);
        }).catch(err => {
            console.log(err);
        })
    })

})

server.listen(9999);
