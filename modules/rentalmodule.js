const Joi = require('joi');
//defining fuction for validation of the object id
 Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer:{
  type : new mongoose.Schema({ 
    name:{ type:String, required:true,minlength:3}
  })
  },
  movie: {
    type: new mongoose.Schema({
      name:{type:String , required:true , minlength:3, maxlength:255, lowercase:true},
      date:{type:Date, default:Date.now},
      isReleased: {type:Boolean, default:true},
      dailyRentalRate:{type:Number}   
    })
  },
  dateOut: { 
    type: Date
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type:Number, 
    min:0
  }
}));

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental; 
exports.validate = validateRental;