const express = require('express');
const app = express();
const morgan=require('morgan');
const cors = require('cors');
const monk = require('monk');
// require('dotenv').config();
const db = monk("mongodb+srv://yes_sir:TFJ7EEgDaDmgj3IW@twitter.nyomr5g.mongodb.net/?retryWrites=true&w=majority" || 'localhost/twitt');
const twitts = db.get('twitts');
const Filter = require('bad-words');
const filter = new Filter();
const express_rate_limit = require('express-rate-limit');



app.use(morgan('tiny'));

app.use(express.json());


app.use(cors({
    origin:'*'
}));


app.get('/',(req,res)=>{
    res.json({
        message:"home"
    });

});



app.get('/twitt',(req,res)=>{
    twitts
        .find()
        .then(result => {
            res.json(result);
        });
});

app.use(express_rate_limit({
    windowMs:10*1000,
    max:1
}));

function isValid(body){
    return body.name && body.name.toString().trim()!=='' &&
    body.message && body.message.toString().trim()!==''
}

app.post('/twitt',(req,res)=>{

    if(isValid(req.body)){
        const twitt = {
            name:filter.clean(req.body.name.toString().trim()),
            message:filter.clean(req.body.message.toString().trim()),
            created : new Date()
        }

        twitts.insert(twitt)
        .then(inserted => {
            res.json(inserted);
        });

    }else{
        res.json({
            maessage:"name or message not valid"
        });
    }
});

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("listening on http://localhost:"+port);
});