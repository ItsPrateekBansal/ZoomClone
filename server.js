const express = require('express');
const app = express();
const server = require('http').Server(app);
const ejs = require('ejs');
app.set('view engine','ejs');
app.use(express.static('public'));
const { v4:uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true
});
const io = require('socket.io')(server)
app.use('/peerjs',peerServer);
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
});

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.roomId})
});


io.on('connection',socket =>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId)
    })
})
server.listen(3000);