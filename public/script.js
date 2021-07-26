var canvas, ctx, saveButton, clearButton;
var pos = { x: 0, y: 0 };
var rawImage;
var model;

function setPosition(e) {
  pos.x = e.clientX - 100;
  pos.y = e.clientY - 100;
}

function draw(e) {
  if (e.buttons != 1) return;
  ctx.beginPath();
  ctx.lineWidth = 24;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  rawImage.src = canvas.toDataURL("image/png");
  // console.log("rawimage is ", rawImage);
}

function erase() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 280, 280);
  document.getElementById("output").innerText = "Draw another digit to predict";
}

function save() {
  var raw = tf.browser.fromPixels(rawImage, 1);
  console.log("raw--->", raw);
  var resized = tf.image.resizeBilinear(raw, [28, 28]);
  console.log("resied---->", resized);
  var tensor = resized.expandDims(0);
  console.log("tensor----->", tensor);
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
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mouseenter", setPosition);
  saveButton = document.getElementById("sb");
  saveButton.addEventListener("click", save);
  clearButton = document.getElementById("cb");
  clearButton.addEventListener("click", erase);
}

async function run() {
  const lb = document.getElementById("output");
  lb.innerText = "wait for model loading";
  const MODEL_URL = "http://127.0.0.1:5500/public/model/model.json";
  model = await tf.loadLayersModel(MODEL_URL);
  console.log(model.summary());
  console.log("model loaded sucessfully, you are ready to predict");
  lb.innerText = "Draw image to predict";
  init();
}

document.addEventListener("DOMContentLoaded", run);
