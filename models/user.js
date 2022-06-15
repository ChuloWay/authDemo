const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');


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

userSchema.statics.findAndValidate = async function (username,password){
    const foundUser = await this.findOne({ username });
    const isValid = bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false
}

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

module.exports = mongoose.model('User', userSchema);