const schema = require('../model/schema');

exports.getAllAssignmentView =(req, res) => {
    if(req.validated){
        let instruct = req.params.idType === 'teach';
        let idType = req.params.idType;
        let classId = req.params.classId;
        if(idType === 'teach'){
            res.render('classroomWork', {idType, userId : req.params.id, instruct, adminNav : req.adminStatus, classId});
        }else if(idType === 'learn'){
            res.render('classroomWork', {idType, userId : req.params.id, instruct, adminNav : false, classId});
        }else{
            res.redirect(`/error?msg=${encodeURIComponent('The id type specified in url does not exist')}`);
        }
    }
};

exports.addAssignmentView = (req, res) => {
    if(req.validated){
        let idType = req.params.idType;
        let instruct = req.params.idType === 'teach';
        let userId = req.params.id;
        let classId = req.params.classId;
        if(idType === 'teach'){
            res.render('assignment', {idType, userId, instruct, adminNav : req.adminStatus, classId});
        }else if(idType === 'learn'){
            res.render('assignment', {idType, userId, instruct, adminNav : false, classId});
        }else{
            res.redirect(`/error?msg=${encodeURIComponent('The id type specified in url does not exist')}`);
        }
    }
};

exports.addAssignmentPost = (req, res) => {
    req.body.fileData = req.fileName;
    req.body.class = req.params.classId;
    const data = new schema.assignmentModel(req.body);
    data.save();
    res.redirect(`/classroom/${req.params.idType}/${req.params.id}/${req.params.classId}/work`);
}