const schema = require('./../model/schema');

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
module.exports = {validateAndFind};