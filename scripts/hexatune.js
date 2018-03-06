const FFT_SIZE = 2048;
const NUM_INPUTS = 1;
const NUM_OUTPUTS = 1;

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

    this.subscribers = [];
  };

  subscribe(subscriber) {
    this.subscribers.push(subscriber);
  };

  init() {
    // create Web Audio Context
    this.audioContext = new AudioContext();

    // setup analyser
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = FFT_SIZE;
    this.analyser.smoothingTimeConstant = 0;

    // setup gain node
    this.gainNode = this.audioContext.createGain();

    // setup hexatune node
    this.process = this.process.bind(this);
    this.processor = this.audioContext.createScriptProcessor(FFT_SIZE, NUM_INPUTS, NUM_OUTPUTS);
    this.processor.onaudioprocess = this.process;
  };

  getUserMedia() {
    navigator.getUserMedia(
      { audio: true },
      (stream) => {
        this.sendingAudioData = true;
        this.stream = stream;
        this.microphone = this.audioContext.createMediaStreamSource(stream);
        this.microphone.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  process(event) {
    // do processing here
    const input = event.inputBuffer.getChannelData(0);
    this.subscribers.map(subscriber => {
      subscriber.dispatchEvent(new CustomEvent('hexatune', { detail: { output: input }}));
    });
  };
}