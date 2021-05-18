const schema = require('./../model/schema');

function valId(idType, giveId) {
    let check = false;
    if (idType === "teach") {
        schema.teacher.findOne({t_Id: giveId}, 't_Id Name Email', function (err, teacher) {
            if (err) return handleError(err);
            if (String(teacher.t_Id) === giveId) {
                check = true;
            }
        });
    } else if (idType === 'learn') {
        schema.student.findOne({s_Id: giveId}, 's_Id Name Email', function (err, student) {
            if (err) return handleError(err);
            if (student.s_Id === giveId) {
                check = true;
            }
        });
    }
    console.log(check);
    return check
}

function valTeacherAdmin(id){
    schema.teacher.findOne({t_Id : id}, 'admin' ,function(err, result){
        if(err) return handleError(err);
        return result.admin;
    })
}

function validateAndFind(what, id){
    if(what === 'class'){
        schema.techerClass.findOne({c_Id : id}, 'c_Id Title', function(err, data){
            if(err) return handleError(err);
            if(data !== null){
                return data
            }else{
                return 'error'
            }
        })
    }else if(what === 'student'){
        schema.techerClass.findOne({s_Id : id}, 's_Id Name Email Username Password', function(err, data){
            if(err) return handleError(err);
            if(data !== null){
                return data
            }else{
                return 'error'
            }
        })
    }else if(what === 'teacher'){
        schema.techerClass.findOne({t_Id : id}, 't_Id Name Email Username Password Admin', function(err, data){
            if(err) return handleError(err);
            if(data !== null){
                return data
            }else{
                return 'error'
            }
        })
    }
}
module.exports = {valId, valTeacherAdmin, validateAndFind};