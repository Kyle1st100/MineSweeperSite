
const $ = (selector) => document.querySelector(selector)
function setup() {
    const $canvasContainer = $('#canvasContainer')
    console.log($canvasContainer.clientWidth)
    const sketchWidth = $canvasContainer.clientWidth;
    const sketchHeight = $canvasContainer.clientHeight
    let renderer = createCanvas(sketchWidth, sketchHeight);
    renderer.parent("canvasContainer");
}
  
function draw() {
    background(340);
    ellipse(50,50,80,80);
}