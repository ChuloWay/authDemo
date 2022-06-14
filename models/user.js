const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'Cannot Be Empty!']
    },
    password: {
        type:  String,
        required: [true, 'Cannot Be Empty!']
    }
})

module.exports = mongoose.model('User', userSchema);