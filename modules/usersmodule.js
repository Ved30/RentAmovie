const mongoose= require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');


userSchema =  new mongoose.Schema({
    name : 
    {
        type:String,
        required:true,
        minlength:3
    },
    email: 
    {
        type:String,
        unique:true,
        required:true
    },
    password :
    {
        type:String,
        minlength:4,
        maxlength:1024
    },
    isAdmin : 
    {
        type:Boolean
    }
})


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id : this._id, isAdmin : this.isAdmin }, config.get('jwtPrivateKey'));
    return(token);
}

const User =mongoose.model('User', userSchema);


function validate(user)
{   
    const schema = {
        name : Joi.string().min(3).max(8).required(),
        email :Joi.string().email().required(),
        password : Joi.string().min(3).max(1024).required(),
        isAdmin: Joi.boolean()
    }
    return Joi.validate(user,schema);
}


exports.User = User
exports.validate = validate