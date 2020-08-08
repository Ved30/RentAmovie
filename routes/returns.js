const express= require('express');
const moment= require('moment');
const router = express.Router();
const auth = require('../middleware/auth');
const {Rental} =require('../modules/rentalmodule');
const { Movie } = require('../modules/moviesmodule');

router.post('/',auth,async(req,res)=>{
      if(!req.body.customerId) 
      {
            return res.status(400).send('Customer id not provided');
      }
      if(!req.body.movieId) 
      {
            return res.status(400).send('Customer id not provided');
      }
      const rental =await Rental.findOne({
            'customer._id':req.body.customerId,
            'movie._id':req.body.movieId
      });
      if(!rental) return res.status(404).send("No rental found");

      if(rental.dateReturned) return res.status(400).send("Returned already processed");
    
      rental.dateReturned = new Date();
      const rate =moment().diff(rental.dateOut, 'days');
      rental.rentalFee = rate*rental.movie.dailyRentalRate;
      await rental.save();
      await Movie.update({
            _id : rental.movie.id , $inc : { Stockcount :1 }
      });
    
      res.status(200).send(rental);  
      
});

module.exports=router;