const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const toast= document.querySelector(".toast");
const totalTimeEle = document.querySelector("#totalTime");
const currentTimeEle = document.querySelector("#currentTime");
const slider = document.querySelector("#slider");


let video = "";
let duration;
let timerObj;
let currentPlayTime = 0;
let isPlaying = false;


const handleInput = () => {
    console.log("clicked");
    videoInput.click();
}

const acceptInputHandler = (obj) => {

    const selectedVideo = obj.target.files[0];
    const link = URL.createObjectURL(selectedVideo);
    const videoElement = document.createElement("video");
    videoElement.src = link;
    videoElement.setAttribute("class","video");
    videoElement.play();
    videoElement.controls = "true";

    videoPlayer.innerHTML ="";
    videoPlayer.appendChild(videoElement);

    // Update total time and slider range when metadata is loaded
    videoElement.addEventListener('loadedmetadata', () => {
        totalTimeEle.innerText = timeFormat(videoElement.duration);
        slider.max = videoElement.duration; // Set the slider's max to the video's duration
    });

    // Update current time and progress bar as the video plays
    videoElement.addEventListener('timeupdate', () => {
        currentTimeEle.innerText = timeFormat(videoElement.currentTime);
        slider.value = videoElement.currentTime; // Sync the slider with current video time
    });

    // Allow user to click on the slider to seek the video
    slider.addEventListener('input', (e) => {
        videoElement.currentTime = e.target.value; // Seek video to slider position
    });

}

// Attach the input handler for the video selection
videoInput.addEventListener("change", acceptInputHandler);

videoBtn.addEventListener("click",handleInput);
videoInput.addEventListener("change",acceptInputHandler);

const speedUpHandler = () => {
    console.log("speed up hoga");
    const videoElement = document.querySelector("video");

    if(videoElement == null){
        return;
    }

    if( videoElement.playbackRate > 3){
        return;
    }

    console.log("before increased speed", videoElement.playbackRate);
    const increasedSpeed = videoElement.playbackRate + 0.5;
    videoElement.playbackRate = increasedSpeed;
    console.log("after speed increased", increasedSpeed);
    showToast(increasedSpeed + "X")
}

const speedDownHandler = () => {
    console.log("speed down hoga");
    const videoElement = document.querySelector("video");

    if(videoElement == null){
        return;
    }

    if( videoElement.playbackRate > 0){
        console.log("initial speed", videoElement.playbackRate);
        const decreasedSpeed = videoElement.playbackRate - 0.5;
        videoElement.playbackRate = decreasedSpeed;
        console.log("decreased speed", decreasedSpeed);
        showToast(decreasedSpeed + "X");
    }
}

const volumeUpHandler = () => {
    console.log("volume up hoga");
    const videoElement = document.querySelector("video");

    if(videoElement == null){
        return;
    }

    if(videoElement.volume >= 0.99) return;
    console.log("initial volume", videoElement.volume);
    const increasedVolume = videoElement.volume + 0.1;
    videoElement.volume = increasedVolume;
    console.log("final volume",increasedVolume);

    const percentage = (increasedVolume*100) + "%";
    showToast(percentage);

}

const volumeDownHandler = () => {
    console.log("volume down hoga");
    const videoElement = document.querySelector("video");

    if(videoElement == null){
        return;
    }

    if(videoElement.volume <= 0.1){
        videoElement.volume = 0;
        return;
    } 

    console.log("initial volume", videoElement.volume);
    const decreasedVolume = videoElement.volume - 0.1;
    videoElement.volume = decreasedVolume;
    console.log("final volume",decreasedVolume);

    const percentage = (decreasedVolume*100) + "%";
    showToast(percentage);
}

function showToast(message){
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    },1000);
}

speedUp.addEventListener("click",speedUpHandler);
speedDown.addEventListener("click",speedDownHandler);
volumeUp.addEventListener("click",volumeUpHandler);
volumeDown.addEventListener("click",volumeDownHandler);

/*controls*/

const handleFullScreen = () => {
    videoPlayer.requestFullscreen();
}

const fullScreenElement = document.querySelector("#fullscreen");
fullScreenElement.addEventListener("click",handleFullScreen);

/* play- pause */

const handleVideoPlay = () => {
    const videoElement = document.querySelector("video");
    if(videoElement.paused){
       const playsign = videoElement.play();
        showToast("Play");
    }
    else {
        videoElement.pause();
        showToast("Pause");
    }
}


/**Stop */

const playVideoElement = document.querySelector("#play");
playVideoElement.addEventListener("click",handleVideoPlay);

const handleVideoPause = () => {
    const videoElement = document.querySelector("video");
    videoElement.pause();
    showToast("Stop");
}

const stopVideoElement = document.querySelector("#stop");
stopVideoElement.addEventListener("click",handleVideoPause);


 /*forward & backward */

const handleForward = () => {
    const videoElement = document.querySelector("video");
    currentPlayTime = Math.round(videoElement.currentTime) + 5;
    videoElement.currentTime = currentPlayTime;
    showToast("+5s");
}

const skipforward = document.querySelector("#forwardSkip");
skipforward.addEventListener("click",handleForward);

const handleBackward = () => {
    const videoElement = document.querySelector("video");
    currentPlayTime = videoElement.currentTime - 5;
    videoElement.currentTime = currentPlayTime;
    showToast("-5s");
}

const skipbackward = document.querySelector("#backwardSkip");
skipbackward.addEventListener("click",handleBackward);

/***function to format time  */

function timeFormat(timeCount) {
    let time = '';
    const sec = parseInt(timeCount, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);

    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}


/**Drag and Drop */

// Prevent default behavior for dragover and dragleave events
videoPlayer.addEventListener('dragenter', (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener('dragover', (e) => {
    e.preventDefault();
})

videoPlayer.addEventListener('dragleave', (e) => {
    e.preventDefault();
})


videoPlayer.addEventListener('drop', (e) => {
    e.preventDefault();

    // Access the file from the dropped files
    const droppedFiles = e.dataTransfer.files;

    // Make sure at least one file is dropped
    if (droppedFiles.length > 0) {
        // Mock the structure expected by acceptInputHandler
        const event = {
            target: {
                files: droppedFiles
            }
        };

    acceptInputHandler(event);
    }
})


/**keyboard controls */

const body = document.querySelector("body");

//keyboard inputs

body.addEventListener("keyup", function(e){
    //console.log(e.key);
    if(!video) return;
    if(e.code == "Space"){
        isPlaying = !isPlaying
        handleVideoPlay();
    }
    else if(e.key == "ArrowUp"){
        volumeUpHandler();
    }
    else if(e.key == "ArrowDown"){
        volumeDownHandler();
    }
    else if(e.key == "ArrowRight"){
        handleForward();
    }
    else if(e.key == "ArrowLeft"){
        handleBackward();
    }
    else if(e.key == "+"){
        speedUpHandler();
    }
    else if(e.key == "-"){
        speedDownHandler();
    }
   else if(e.key == "F"){
    handleFullScreen();
   }
})
