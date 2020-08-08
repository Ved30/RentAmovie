const express= require('express');
const asyncMiddleware= require('../middleware/asyncMiddleware');
const router=express.Router();
const {Movie,validate}= require('../modules/moviesmodule');
const auth = require('../middleware/auth');
const admin =require('../middleware/admin');
router.get('/',asyncMiddleware(async(req,res)=>{
    const movies=await Movie.find().sort({name:1});
    res.send(movies);
}));
// for showing the movies present

router.get('/:id',asyncMiddleware(async(req,res)=>{
    
    const movie= await Movie.findById(req.params.id);
    //const movie=movies.find(c => c.id ===parseInt(req.params.id));
    if(!movie)
    { res.status(404).send("No such movie found...");
      return;
    }
    res.send(movie);

}));
// To make entry of new movie

router.post('/',auth,asyncMiddleware(async(req,res)=>
{

    const {error} = validate(req.body) ;
    
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    };
    const movie= new Movie({
        name:req.body.name,
        director:req.body.director,
        tags:req.body.tags,
        dailyRentalRate:req.body.dailyRentalRate,
        Stockcount:req.body.Stockcount
    });
    const result=await movie.save();
    
    res.send(result);

}));

//To update a movie name or genre of the movie
router.put('/:id',auth,asyncMiddleware(async(req,res)=>
{   
    const {error} = validate(req.body);
    if(error)
    {
    res.status(400).send(error.details[0].message);
    return;
    }
    const movie=await Movie.findByIdAndUpdate(req.params.id, { name : req.body.name, director : req.body.director,tags:req.body.tags }, 
    { new: true
    });

    //const movie= movies.find(c=>c.id===parseInt(req.params.id));
    if(!movie)
    {
        res.status(404).send('No such movie found');
        return;
    }
    res.send(movie);
}))

router.delete('/:id',[auth,admin],asyncMiddleware(async(req,res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id);
   // const movie = movies.find(c=>c.id===parseInt(req.params.id));
    if(!movie)
    {
        res.status(404).send('No such movie found');
        return;
    }
    res.send(movie);
}));

module.exports =router;