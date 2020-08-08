const { Mongoose } = require("mongoose");
const mongoose= require('mongoose');

module.exports = function(req,res,next) {

    if(!mongoose.validate(req.params.id))
    {
        return res.status(404).send('Invalid id');
    }

    next();
};