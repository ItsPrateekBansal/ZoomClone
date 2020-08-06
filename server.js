const express = require('express');
const app = express();
const server = require('http').Server(app);
const ejs = require('ejs');
app.set('view engine','ejs');
app.use(express.static('public'));
const { v4:uuidv4 } = require('uuid')

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.roomId})
});



server.listen(3000);