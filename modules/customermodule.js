const mongoose=require('mongoose');
const Joi=require('joi');

const Customer = mongoose.model('Customer',new mongoose.Schema({
    name:{ type:String, required:true,minlength:3},
    choice:{type:Array,
        isAsync:true,
        validator:{ function(v,callback) {
        setTimeout(() => {
            const result= v && v.length>=0;
            callback(result);
        },2000);
    },
    message:"a customer should have atleast on choice"
    },},
    date:{type:Date,default:Date.now}
}));

function validate(customer)
{
    const schema= {
        name:Joi.string().min(3),
        choice:Joi.array().min(0)
    };

    return Joi.validate(customer,schema);
}


exports.Customer=Customer;
exports.validate=validate;