function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animate({ timing, draw, duration }) {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    let progress = timing(timeFraction);
    draw(progress);
    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}
function timing(timeFraction) {
  return Math.pow(timeFraction, 2);
}
function makeEaseOut(timing) {
  return function (timeFraction) {
    return 1 - timing(1 - timeFraction);
  };
}
function makeEaseIn(timing) {
  return function (timeFraction) {
    return timing(timeFraction);
  };
}