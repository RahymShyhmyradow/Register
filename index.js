const express=require('express');
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser')
const PORT=process.env.PORT || 8000;
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())
const router=require('./routes/router.js');
app.use('/api', router);
app.listen(PORT, console.log('run server '+ PORT))
console.log(123);