const FFT_SIZE = 2048;

class Hexatune {
  constructor() {
    // handles cross-browser API calls
    window.AudioContext = window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.msAudioContext;

    // handles cross-browser API calls
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
  }

  init() {
    // create Web Audio Context
    this.audioContext = new AudioContext();

    // setup analyser
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;
    this.analyser.smoothingTimeConstant = 0;

    // setup gain node
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 0;

    // create a buffer
    this.frequencyBuffer = new Float32Array(FFT_SIZE);
  }

  getUserMedia() {
    navigator.getUserMedia(
      { audio: true },
      (stream) => {
        this.sendingAudioData = true;
        this.stream = stream;
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.microphone.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.analyser.connect(this.audioContext.destination);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}