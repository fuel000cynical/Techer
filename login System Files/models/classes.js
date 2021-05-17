const mongo = require('mongoose');

const classSchema = new mongo.Schema({
    c_Id : {
        type: String,
        required: true
    },
    Title : {
        type: String,
        required: true
    },
    Teachers : {
        type: Array,
        required: true
    },
    Students: {
        type: Array,
        required: true
    },
    createdBy : {
        type: String,
        required: true
    },
    createdOn : {
        type: Date,
        required: true
    }
});
var classes = mongo.model('classes', classSchema);
module.exports = classes;