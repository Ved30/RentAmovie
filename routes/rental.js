const { Rental, validate } = require('../modules/rentalmodule'); 
const { Movie } = require('../modules/moviesmodule'); 
const { Customer } = require('../modules/customermodule'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn= require('fawn');

// fawn is an  npm package which is based on 2 phase commit in mongodb
// 2 phase commit are generally transaction which are a series of task that are conducted in order if there is an error while transcting the the database is rolled back to before

Fawn.init(mongoose)

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.Stockcount === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name:customer.name,
    },
    movie: {
      _id: movie._id,
      name:movie.name,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try{
    await rental.save()
    new Fawn.Task()
      .update('movies',{_id:movie._id},{
        $inc : {Stockcount : -1}
      });


    res.send(rental);
  }
  catch(err)
  {

    res.status(500).send("Internal Server error")
  }

});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 