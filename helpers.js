function keyPressed() {
    // Set spacebar to toggle play/pause of drawing loop
    if (key === ' ') {
      if (isLooping()) {
        noLoop();
        console.log('STOPPED. Press SPACE to resume.')
      } else {
        loop();
        console.log('RESUMED. Press SPACE to stop.')
      }
    }
    if (key === 'r') {
      resetSketch();
    }
  }

function saveNumberedFrame(nSaved) {
  // let zfill = nFrames.toString().length
  let zfill = 2
  saveCanvas(`frame_${('0'.repeat(zfill) + nSaved).slice(-zfill)}`);
  return nSaved + 1;
}