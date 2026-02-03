const socket = io()
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3000'
});

const peers = {}

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo,stream);
    socket.on('user-connected',(userId)=>{
        connectToNewUser(userId,stream);
    })

    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
        peers[call.peer] = { video, call }
        call.on('close',()=>{
            video.remove()
            delete peers[call.peer]
        })
    })
}).catch(err => {
    console.error('Failed to get media:', err);
    alert('Camera/microphone access is required. Please allow permissions and refresh.');
})

peer.on('open',id=>{
    console.log(id);
    socket.emit('join-room',ROOMID,id);
});

socket.on('user-disconnected',(userId)=>{
    if(peers[userId]){
        peers[userId].video.remove()
        peers[userId].call.close()
        delete peers[userId]
    }
})

const connectToNewUser = (userId,stream)=>{
    const call = peer.call(userId,stream)
    const video = document.createElement('video');
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)
    })
    peers[userId] = { video, call }
    call.on('close',()=>{
        video.remove()
        delete peers[userId]
    })
}

const addVideoStream = (video,stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    videoGrid.append(video);
}
