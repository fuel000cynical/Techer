const hash = require('./hashing');
const uid = require('uniqid');
const schema = require('./../model/schema');

exports.addSession = async (req, res) => {
    const generatedId = uid()
    let data = new schema.sessionModel({
        sessionId: generatedId,
        userType: req.params.userType,
        userId: req.params.userId,
        userName: req.params.userName
    });
    await data.save().catch(err => {
        console.log(err);
        res.redirect(`/error?msg=${encodeURIComponent('There was an error while setting up your session')}`)
    });
    res.render('addSession', {
        sessionId: generatedId,
        userType: hash.returnHash(req.params.userType),
        userId: hash.returnHash(req.params.userId),
        userName: hash.returnHash(req.params.userName),
        unhashedIdType: req.params.userType,
        unhashedId: req.params.userId
    })
};

exports.checkSession = async (req, res) => {
    res.render('retrieveSession', {redirectUrl: req.query.redirectUrl});
};

exports.checkSessionPost = (req, res) => {
    res.redirect(req.query.redirectUrl);
};

exports.removeSession = (req, res) => {

};



