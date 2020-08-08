const express= require('express');
const asyncMiddleware= require('../middleware/asyncMiddleware');
const auth= require('../middleware/auth');
const admin =require('../middleware/admin');
const router = express.Router();
const {Customer,validate} = require('../modules/customermodule');
const {Movie} =require("../modules/moviesmodule");
const validateObjectId= require("../middleware/validateObjectId");
router.get('/',asyncMiddleware(async(req,res,next)=>{
        const Customers=await Customer.find().sort({name:1});
        res.send(Customers);
}));

router.get('/:id',validateObjectId,asyncMiddleware(async(req,res)=>{
    const customer=await Customer.findById(req.params.id);

    if(!customer)
    {
        res.status(404).send("No customer with this id exists")
        return;
    }

    res.send(customer);

}));

router.post('/',asyncMiddleware(async(req,res)=>{
     const {error}= validate(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    const customer= new Customer({
        name:req.body.name,
        choice:req.body.choice,
    });
    const result = await customer.save();
    res.send(result);

}));

router.put('/:id',validateObjectId,asyncMiddleware(async(req,res)=>{
;
    const {error} = validate(req.body)
    if(error)
    {
        res.status(400).send(error.details[0].message);
    }

   
    const customer = await Customer.findByIdAndUpdate(req.params.id,{name:req.body.name,choice:req.body.choice},{new:true});

    if(!customer)
    {
        res.status(404).send("No such customer exists");
        return;
    }
    res.send(customer);

}));
router.delete('/:id',[auth,admin],asyncMiddleware(async(req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer)
    {
        res.status(404).send("No such customer exists");
        return;
    }
    res.send(customer);
}));



module.exports=router;