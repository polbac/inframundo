var supportsES6 = function() {
    try {
      new Function("(a = 0) => a");
      return true;
    }
    catch (err) {
      return false;
    }
  }();
  var track = {
    volume: 0.05, // 0 - 1
    fadeIn: 2.5, // time in seconds
    fadeOut: 1.3, // time in seconds
  }
  
  // Web Audio API - White noise, generate, play (volume, fadeIn, fadeOut, loop), stop, fade - v1.0 MJF @ websemantics.uk
  //*
  export default (function () {
  
    "use strict";
    if (!supportsES6) {return;}
  
    const audioContext = new(window.AudioContext || window.webkitAudioContext);
    
    let fadeOutTimer;
    
    // https://noisehack.com/generate-noise-web-audio-api/
    function createNoise() {
  
      const bufferSize = 2 * audioContext.sampleRate;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
  
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 0.2 - 1;
      }
      
      track.audioSource.buffer = noiseBuffer;
    }
  
    function stopNoise() {
      if (track.audioSource) {
        clearTimeout(fadeOutTimer);
        track.audioSource.stop();
      }
    }
    
    function fadeNoise() {
      
      if (track.fadeOut) {
        track.fadeOut = (track.fadeOut >= 0) ? track.fadeOut : 0.5;
      } else {
        track.fadeOut = 0.5;
      }
  
      if (track.canFade) {
        
        track.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + track.fadeOut);
  
        track.canFade = false;
  
        fadeOutTimer = setTimeout(() => {
          stopNoise(track);
        }, track.fadeOut * 1000);
  
      } else {
        stopNoise(track);
      }
  
    }
  
    function buildTrack() {
      track.audioSource = audioContext.createBufferSource();
      track.gainNode = audioContext.createGain();
      track.audioSource.connect(track.gainNode);
      track.gainNode.connect(audioContext.destination);
      track.canFade = true; // used to prevent fadeOut firing twice
    }

    function mouseIn() {
        track.volume = 0.5
        gain()
    }

    function mouseOut() {
        track.volume = 0.05
        gain()
    }

    function gain() {
        track.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  
      track.gainNode.gain.linearRampToValueAtTime(track.volume / 4, audioContext.currentTime + track.fadeIn / 2);
  
      track.gainNode.gain.linearRampToValueAtTime(track.volume, audioContext.currentTime + track.fadeIn);
    }
    
    function setGain() {
  
      track.volume = (track.volume >= 0) ? track.volume : 0.5;
      
      if (track.fadeIn) {
        track.fadeIn = (track.fadeIn >= 0) ? track.fadeIn : 0.5;
      } else {
        track.fadeIn = 0.5;
      }
  
      track.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  
      track.gainNode.gain.linearRampToValueAtTime(track.volume / 4, audioContext.currentTime + track.fadeIn / 2);
  
      track.gainNode.gain.linearRampToValueAtTime(track.volume, audioContext.currentTime + track.fadeIn);
  
    }
  
    function playNoise() {
  
      stopNoise();
      buildTrack();
      createNoise();
      setGain();
      track.audioSource.loop = true;
      track.audioSource.start();
    }
  
    // Expose functions:
    return {
      play : playNoise,
      stop : stopNoise,
      fade : fadeNoise,
      mouseIn,
      mouseOut,
    }
  
  }());
