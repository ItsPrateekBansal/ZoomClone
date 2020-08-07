const socket = io()
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
// const myAudio = document.createElement('audio');
myVideo.muted = true;

let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo,stream);
})
socket.emit('join-room');
const addVideoStream = (video,stream)=>{
    video.srcObject = stream;
    // audio.srcObject = stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    });
    // console.log(audio);
    // audio.play();
    videoGrid.append(video);
}
