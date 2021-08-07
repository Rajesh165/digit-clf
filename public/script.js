var canvas, ctx, saveButton, clearButton;
var pos = { x: 0, y: 0 };
var rawImage;
var model;
//------------------  test --------------

function touchstart(e) {
  setPosition(e.touches[0]);
}
function touchmove(e) {
  draw_mobile(e.touches[0]);
  e.preventDefault();
}
function touchend(e) {
  setPosition(e.changedTouches[0]);
}

//--------------------test----------------------

function setPosition(e) {
  let rect = canvas.getBoundingClientRect();
  pos.x = e.clientX - rect.left;
  pos.y = e.clientY - rect.top;
}
function draw_mobile(e) {
  if (e.force != 1) {
    return;
  }
  ctx.beginPath();
  ctx.lineWidth = 24;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  rawImage.src = canvas.toDataURL("image/png");
}

function draw_desktop(e) {
  if (e.buttons != 1) {
    return;
  }
  ctx.beginPath();
  ctx.lineWidth = 24;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  rawImage.src = canvas.toDataURL("image/png");
}

function erase() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 280, 280);
  document.getElementById("output").innerText = "Draw another digit to predict";
}

function save() {
  var raw = tf.browser.fromPixels(rawImage, 1);
  // console.log("raw--->", raw);
  var resized = tf.image.resizeBilinear(raw, [28, 28]);
  // console.log("resied---->", resized);
  var tensor = resized.expandDims(0);
  // console.log("tensor----->", tensor);
  var prediction = model.predict(tensor);
  var pIndex = tf.argMax(prediction, 1).dataSync();

  document.getElementById("output").innerText = `your digit is ${pIndex}`;
}

function init() {
  canvas = document.getElementById("canvas");
  rawImage = document.getElementById("canvasimg");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 280, 280);
  canvas.addEventListener("mousemove", draw_desktop);
  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mouseenter", setPosition);

  canvas.addEventListener("touchstart", touchstart);
  canvas.addEventListener("touchmove", touchmove);
  canvas.addEventListener("touchend", touchend);

  saveButton = document.getElementById("sb");
  saveButton.addEventListener("click", save);
  clearButton = document.getElementById("cb");
  clearButton.addEventListener("click", erase);
}

async function run() {
  const lb = document.getElementById("output");
  lb.innerText = "wait for model loading";
  const MODEL_URL = "./model/model.json";
  model = await tf.loadLayersModel(MODEL_URL);
  // console.log(model.summary());
  // console.log("model loaded sucessfully, you are ready to predict");
  lb.innerText = "Draw image to predict";
  init();
}

document.addEventListener("DOMContentLoaded", run);
