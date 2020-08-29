/**
 * Heavy credit to https://github.com/apm1467/html5-mic-visualizer
 * Couldn't have done this without him.
 */
function Mic(){
    this.DB = 0;
    this.audioContent;
    this.started = false;
    this.hasPermission = false;
    this.fftSize = 1024;
    this.updateTime = 50;
    this._soundAllowed = (stream) =>     {
        this.hasPermission = true;
        let audioStream = this.audioContent.createMediaStreamSource( stream );
        let analyser = this.audioContent.createAnalyser();

        analyser.fftSize = this.fftSize;
        audioStream.connect(analyser);

        let bufferLength = analyser.frequencyBinCount;
        let frequencyArray = new Uint8Array(bufferLength);

        let showVolume = () => {
            setTimeout(showVolume, this.updateTime);
            if (this.started) {
                analyser.getByteFrequencyData(frequencyArray);
                if(typeof this.onFrequency === "function") this.onFrequency(frequencyArray);
                let total = 0
                for(let i = 0; i < 255; i++) {
                    let x = frequencyArray[i];
                    total += x * x;
                }
                let rms = Math.sqrt(total / bufferLength);
                let db = 20 * ( Math.log(rms) / Math.log(10) );
                db = Math.max(db, 0); // sanity check
                if(db !== this.DB){
                    this.DB = db;
                    if(typeof this.onDBChange === "function") this.onDBChange(this.DB);
                }
            }
        }
        showVolume();
    }

    this._soundNotAllowed = (error) => {
        console.error('You must allow your microphone.');
        console.log(error);
    }
}
Mic.prototype.start = function(){
    if (this.started) {
        this.started = false;
    }
    else {
        if (!this.hasPermission) {
            this.audioContent = new AudioContext();
            navigator.mediaDevices.getUserMedia({audio:true})
                .then(this._soundAllowed)
                .catch(this._soundNotAllowed);
        }
        this.started = true;
    }
}
Mic.prototype.onDBChange = function(){}
Mic.prototype.onFrequency = function(){}
