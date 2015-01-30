var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var audio = document.getElementsByTagName('audio')[0];
var started = false;
var interval;
var wonAlready = false;
var probability = 0.7 - (localStorage.completed * .01)

function randColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function randomBackground() {
  // http://www.paulirish.com/2009/random-hex-color-code-snippets/
  var rand = randColor();
  var canvas = document.getElementById('canvas');
  canvas.style.background = rand;
};

function getCanvasColor() {
  var canvas = document.getElementById('canvas');
  return canvas.style.background || "rgb(0, 0, 0)";
}

function won() {
  clearInterval(timer);
  audio.pause();
  Score();
  printWon();
}

function Score(){
  if (wonAlready == false) {
    wonAlready = true;
    localStorage.completed = Number(localStorage.completed) + 1;
    printScore();
  }
}

function printScore(){
  var score = document.getElementById('completed_number');
  score.innerHTML = "Score: " + localStorage.completed;
}

function printWon(){
  var won = document.getElementById('win')
  won.innerHTML = "I want to go to the other side again!"
}

function resetScore(){
  localStorage.completed = 0;
  printScore();
  location.reload();
}

function Box() {
  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
  this.box_width = 10;
  this.color = '#000000';

  this.x = 0
  this.y = canvas.height - this.box_width;


  this.context.fillRect(this.x, this.y, this.box_width, this.box_width);
}

Box.prototype.moveTo = function(x, y, color) {
  this.canvas.width = this.canvas.width;

  if(x < 0) {
    x = 0;
  }
  if(y < this.canvas.height - this.box_width) {
    y = this.canvas.height - this.box_width;
  }
  if(x > this.canvas.width - this.box_width) {
    x = this.canvas.width - this.box_width;
  }
  if(y > this.canvas.height - this.box_width) {
    y = this.canvas.height - this.box_width;
  }

  if (color !== undefined) {
    this.context.fillStyle = color;
    this.color = color;
  }

  this.context.fillRect(x, y, this.box_width, this.box_width);

  this.x = x;
  this.y = y;
};

Box.prototype.randomColor = function() {
  var rand = randColor();
  this.moveTo(this.x,this.y, rand);
}

Box.prototype.goBack = function() {
  this.moveTo(this.x-2, this.y-2);
  this.randomColor();
}

Box.prototype.goForward = function() {
  this.moveTo(this.x+2, this.y+2);
  this.randomColor();
}

Box.prototype.randMove = function() {
  if(secondsLabel.innerHTML == 0 && minutesLabel.innerHTML == 0 && started == false) {
    startEverything();
    started = true;
  }
  if(this.winner()) {
    return
  }
  randomBackground();
  var rand = Math.random() < probability ? true : false;
  if(rand) {
    this.goForward();
  }
  else {
    this.goBack();
  }
}

Box.prototype.winner = function() {
  if(this.x == this.canvas.width - this.box_width) {
    won();
    return true;
  }
  if(this.y == 0) {
    won();
    return true;
  }
  return false;
}

function randomKeyBinds(box) {
  var el = document;
  el.onkeyup = function(evt) {
    evt = evt || window.event;
    b.randMove();
  };
  el.ontouchend = function(evt) {
    evt = evt || window.event;
    b.randMove();
  };
}

function forceWin(box, x) {
  setInterval(function () {box.randMove()}, x);
}

function startEverything() {
  audio.play();
  timer = setInterval(setTime, 1000);
}

document.addEventListener("DOMContentLoaded", function(event) {
  if (localStorage.completed === undefined) {
    localStorage.completed = 0;
  }
  printScore();
  b = new Box();
  randomKeyBinds(b);
});

function setTime()
{
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds%60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
}

function pad(val)
{
  var valString = val + "";
  if(valString.length < 2)
  {
    return "0" + valString;
  }
  else
  {
    return valString;
  }
}
