const express= require('express');
const Joi=require('joi');
const winston =require('winston');
const error=require('./middleware/error');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const morgan=require('morgan');
const logger=require('./logger');
const config = require('config');
const movies= require('./routes/movies');
const welcome=require('./routes/entry');
const customer=require('./routes/customer');
const rental=require('./routes/rental');
const user=require('./routes/user');
const auth=require('./routes/auth');
const returns=require('./routes/returns');
const { addColors } = require('winston/lib/winston/config');
//set the DEBUG variable values to print the info in terminals
const startupdebug= require('debug')('app:startup');
const datadebug=require('debug')('app:data');


require('./prod')(app);



winston.add(new winston.transports.File({filename: 'Logfile.log',handleExceptions:true}), new winston.transports.Console(addColors));

if(!config.get('jwtPrivateKey'))
{
    console.error("FATAL ERROR : jwtPrivateKey not defined");
    process.exit(1);
}




process.on('uncaughtException', (ex)=>{
    winston.log('error',ex.message,ex);
});
// to get the enviornment in which we are working. By default it gives as development .  process.env.NODE_ENV is the enviornment state variable
startupdebug(`App State : ${process.env.NODE_ENV}`);
startupdebug(process.env.DEBUG);
//to display the congiuration settings
startupdebug("Application name :" + config.get('name'));
startupdebug("Mail Server name :" + config.get('mail.host'));
startupdebug("Application password :"+ config.get('mail.password'));

//middlewares ....
// TO enable the entry of data in the form of json objects use express json
app.use(express.json());
app.use(cors())
app.use(logger);
app.use(express.urlencoded({extended:true})); //data can be key=value pairs 
app.use(express.static('public'));//we can access the static files 
app.use('/api/movies',movies);
app.use('/',welcome);
app.use('/api/customers',customer);
app.use('/api/rentals',rental);
app.use('/api/users',user);
app.use('/api/auth',auth);
app.use(error);
app.use('/api/returns',returns);


if(app.get('env')==='development')
{
app.use(morgan('dev'));
startupdebug("Morgan enabled......")
}
const db= config.get('db');
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true})
    .then(()=>startupdebug(`Connected to the ${db} database`))
    .catch(err=>startupdebug(err.message))

const port = process.env.PORT || 3000;

const server=app.listen(port,()=>{winston.info(`Listening on ${port} ....`);});


module.exports = server;