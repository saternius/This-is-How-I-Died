// ----------------------------------------
// Actual game code goes here.

// Global vars
fps = null; 
canvas = null;
ctx = null;

// ----------------------------------------

// Our 'game' variables
var posX = 0;
var posY = 0;
var velX = 100;
var velY = 100;
var sizeX = 80;
var sizeY = 40;
var time=0;

var mouseX=0;
var mouseY=0;
var rotation=0;

var messages="nothing";
function GameTick(elapsed)
{

    fps.update(elapsed);

    // --- Logic

    // Movement physics
    posX += velX*elapsed;
    posY += velY*elapsed;
    // Collision detection and response
    if ( (posX <= 0 && velX < 0) || (posX >= canvas.width-sizeX && velX > 0) )
        velX = -velX;
    if ( (posY <= 0 && velY < 0) || (posY >= canvas.height-sizeY && velY > 0) )
        velY = -velY;

    // --- Rendering

    // Clear the screen
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Render objects
    ctx.strokeRect(posX, posY, sizeX, sizeY);
    ctx.fillStyle = "red";
    fillCircle(ctx);
    
  
  
canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        mouseX = mousePos.x;
        mouseY= mousePos.y;
      }, false);
      


  
    
		
    ctx.fillText(messages, posX+10, posY+25);
    
  
  var distX=35;
  var distY=0;
  time+=.04;
  distX=Math.sin(time)*-30;
  distY=Math.cos(time)*30;
  
  var pupX=35;
  var pupY=0;
  pupX=Math.sin(rotation/57)*-30;
  pupY=Math.cos(rotation/57)*-30;
  
 
 /*
  rotation++;
  if(rotation>360){
  rotation=0;
  }
  messages=String(rotation);
*/

var fex = (450-mouseX);
var fi = 250-mouseY;
var t_angle = Math.atan(fi/fex)/(Math.PI/180);

if(fex<0){
  t_angle-=180;
}
if(fex>=0 && fi<0){
  t_angle+=360;
}
rotation=(t_angle*-1)+90;



/* AS3 code to HTML5
var fex:Number=(eye[i].x-mouseX)*-1;
var fi:Number=eye[i].y-mouseY;
var t_angle:Number = Math.atan(fi/fex)/(Math.PI/180);

	if (fex<0) {
 	 t_angle-=180;
	}
	if (fex>=0 && fi<0) {
 	 t_angle+=360;
	}
	eye[i].rotation=(t_angle*-1);


*/


  ctx.beginPath();
  ctx.fillStyle="#FFFFFF"
  ctx.arc(250+distX, 250+distY, 25, 0, 2 * Math.PI);
  ctx.arc(450+pupX, 250+pupY, 25, 0, 2 * Math.PI);
  ctx.fill();
    
    
    
}

window.onload = function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
    fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));
    var imageObj = new Image();

      imageObj.onload = function() {
        context.drawImage(imageObj, 69, 50);
      };
      imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
    
    GameLoopManager.run(GameTick);
};


function fillCircle(ctx)
{
  ctx.beginPath();
  ctx.fillStyle="#FF4422"
  ctx.arc(250, 250, 70, 0, 2 * Math.PI);
  ctx.arc(450, 250, 70, 0, 2 * Math.PI);
  ctx.fill();
  
  
}


  function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }