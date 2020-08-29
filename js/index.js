let mic = new Mic();
var h = document.getElementsByTagName("h1")[0];
var hSub = document.getElementsByTagName("h1")[1];
let seconds = 0;
mic.onDBChange = function(DB){
    h.innerHTML = Math.round(DB) + " dB";
    if (DB >= 30) {
        seconds += 1/mic.updateTime;
        if (seconds >= 5) {
            hSub.innerHTML = "You’ve been in loud environment for<span> " + Math.floor(seconds) + " </span>seconds." ;
        }
    }
    else {
        seconds = 0;
        hSub.innerHTML = "";
    }
};
mic.onFrequency = function(frequencyArray){
    let adjustedLength;
    for(let i = 0; i < 255; i++){
        adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
        paths[i].setAttribute("d", "M " + (i) + ",255 l 0,-" + adjustedLength);
    }
};
var paths = document.getElementsByTagName("path");
var visualizer = document.getElementById("visualizer");
var mask = visualizer.getElementById("mask");
document.getElementById("button").onclick = function(){
    mic.start();
    if(!mic.started){

        this.innerHTML = "<span class='fa fa-play'></span>Start Listen";
        this.className = "green-button";
    }
    else{
        h.innerHTML = "Listening";
        visualizer.setAttribute("viewBox", "0 0 255 255");
        let path;
        for(var i = 0; i < 255; i++){
            path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("stroke-dasharray", "4,1");
            mask.appendChild(path);
        }
        this.innerHTML = "<span class='fa fa-stop'></span>Stop Listen";
        this.className = "red-button";
    }
};
