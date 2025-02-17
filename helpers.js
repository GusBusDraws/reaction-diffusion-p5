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

function saveNumberedFrame(nFrames) {
  if (frameCount - 1 < nFrames) {
    let zfill = nFrames.toString().length
    saveCanvas(`frame_${('0'.repeat(zfill) + frameCount).slice(-zfill)}`);
  }
}