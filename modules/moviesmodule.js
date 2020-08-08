const mongoose=require('mongoose');
const Joi=require('joi');

const Movie=mongoose.model('Movie', new mongoose.Schema({
    name:{type:String , required:true , minlength:3, maxlength:255, lowercase:true},
    director:{type:String , required:true},
    tags:{type:Array,
     validate:{
         isAsync:true,
        validator:function(v,callback){
            setTimeout(() => {
            const result =v && v.length>0;
            callback(result);
            }, 4000);
        },
        message:'A movie should have atleast one tag'
    }},
    date:{type:Date, default:Date.now},
    isReleased: Boolean,
    dailyRentalRate:{type:Number,required:true},
    Stockcount:{type:Number,required:true}
}));


function validate(movie)
{

    const structure = { 
        name: Joi.string().min(3).required()
        , 
        director: Joi.string().min(2).required(),
        tags: Joi.array().min(0),
        dailyRentalRate:Joi.number().min(20),
        Stockcount:Joi.number()
    };
    return Joi.validate(movie,structure);
}

exports.Movie=Movie;
exports.validate=validate;