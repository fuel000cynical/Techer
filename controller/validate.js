const schema = require('./../model/schema');

function valId(idType, id){
    if(idType === 'teacher'){
        schema.teacher.findOne({t_Id : id}, 't_Id Name Email', function(err, teacher){
            if(err) return handleError(err);
            if(teacher !== null){
                return true;
            }else{
                return false
            }
        });
    }else if(idType === 'student'){
        schema.student.findOne({s_Id : id}, 's_Id Name Email', function(err, student){
            if(err) return handleError(err);
            if(student !== null){
                return true;
            }else{
                return false
            }
        });
    }
}

module.exports = {valId};