var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const msgSchema = new Schema({
    Sender: {
        type : String,
        default: ''
    },
    data_type:{
        type: String,
        default: 'text'
    },
    data_text:{
        type: String,
        required: true
    } 
},{
    timestamps: true
});

module.exports = mongoose.model('message',msgSchema);