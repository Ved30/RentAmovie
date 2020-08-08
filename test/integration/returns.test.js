const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../modules/rentalmodule');
const {Movie} = require('../../modules/moviesmodule');
const {User} = require('../../modules/usersmodule');
const mongoose = require('mongoose');
const { date } = require('joi');





describe('/api/returns', () => {
  let server; 
  let customerId; 
  let movieId;
  let rental;
  let movie; 
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };
  
  beforeEach(async () => { 
    server = require('../../index'); 

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie  = new Movie({
      _id : movieId,
      name : "raatakelihai",
      director : "raghuramsrivastav",
      tags : ["hello"],
      dailyRentalRate:40,
      Stockcount:30 
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345'
      },
      movie: {
        _id: movieId,
        name: '12345',
        tags : ["hello"],
        dailyRentalRate :40 
      },
     
     
    });
    await rental.save();
  });

  afterEach(async () => { 
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });  

  it('should return 401 if client is not logged in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if the customerid is not provided' , async()=>{
    customerId = "";
    const  res = await exec();

    expect(res.status).toBe(400);

  });

  it('should return a 404 error if the no entry for cutomer/movie', async()=>{
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);

  });
  
  it('should return a 400 status if the returned already processed', async()=>{
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);

  });

  it('should return a 200 status if the request is valid', async()=>{
    const res = await exec();
    expect(res.status).toBe(200);

  });

  
  it('should set return date if the return date is not set', async()=>{
    const  res = await exec();
    const resindb = await Rental.findById(rental._id);
    const diff = new Date() - resindb.dateReturned;
    expect(diff).toBeLessThan(10*100);

  });

  it('should return correct rentalFee value if the request is valid', async()=>{
    rental.dateOut = moment().add(-7,'days').toDate();
    await rental.save();

    
    const  res = await exec();
    
    const resindb = await Rental.findById(rental._id);
    expect(resindb.rentalFee).toBe(280);

  });
  it('should increase the movie count', async()=>{


    
    const  res = await exec();
    const movieindb = await Movie.findById(movie._id);
    expect(movieindb.Stockcount).toBe(movie.Stockcount + 1);

  });
  it('should return the rental in the body of res', async()=>{


    
    const  res = await exec();
    const resindb = await Rental.findOne(rental._id);



    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['rentalFee','dateReturned','customer','movie']))});
});