// ----------------------------------------
// Actual game code goes here.

// 
//Global 
//vars


fps = null;
 
canvas = null;

ctx = null;


// ----------------------------------------

// Our 'game' variables

var posX = 0;

var posY = 320;

var velX = 75;

var velY = 75;

var sizeX = 80;

var sizeY = 40;

var time=0;


var mouseX=0;

var mouseY=0;

var rotation=0;


var messages="NOTHING";


var imageObj = new Image();

imageObj.src = 'images/background.png';

var SpecialEyes = new Image();

SpecialEyes.src = 'images/Eye.png';


var frame = 2;
var frameRate = 0;
var head = new Image();
head.src='images/head.png'
var walk = 0;
var vert = 0;


var shakeX=0;
var shakeY=0;





var frame_1 = new Image();
var frame_2 = new Image();
var frame_3 = new Image();
var frame_4 = new Image();
var frame_5 = new Image();
var frame_6 = new Image();
var frame_7 = new Image();
var NailPic = new Image();
var background = new Image();

NailPic.src='images/meteor.png';
frame_1.src='images/WalkingMan_1.png';
frame_2.src='images/WalkingMan_2.png';
frame_3.src='images/WalkingMan_3.png';
frame_4.src='images/WalkingMan_4.png';
frame_5.src='images/WalkingMan_5.png';
frame_6.src='images/WalkingMan_6.png';
frame_7.src='images/WalkingMan_7.png';
background.src='images/Background.png';


frame_1.width=10;
frame_2.width=10;
frame_3.width=10;
frame_4.width=10;
frame_5.width=10;
frame_6.width=10;
frame_7.width=10;

NailPic.width=20;

var arrayz = new Array(frame_1,frame_2,frame_3,frame_4,frame_5,frame_6,frame_7);

var somex=0;
var testmess=""
var testint=0;
var nailTimer=0;
var nailClock=50;
var bullets = new Array();
var shards = new Array();

var bgcol="green";
var stunTimer=0;
var health=500;





window.onload = function () {
    
	canvas = document.getElementById("screen");
    
	ctx = canvas.getContext("2d");
   
	 fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));
	

canvas.addEventListener('mousemove', function(evt) {
  
	      var mousePos = getMousePos(canvas, evt);
       
	      var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
 
              mouseX = mousePos.x;
  
              mouseY= mousePos.y;
   
	      checkBoom(mouseX,mouseY);
	   }, false);



    
	window.addEventListener( "keydown", doKeyDown, false ); 
   
	window.addEventListener( "keyup", doKeyUp, false ); 
     


  

GameLoopManager.run(GameTick);


};

function doKeyDown(e){
	if(e.keyCode==39){
		walk=1;
	}
	if(e.keyCode==37){
		walk=2;	
		//alert("Nver");
	}
	if(e.keyCode==38){
		vert=1;
	}
	if(e.keyCode==40){
		vert=2;
	}
	//alert(e.keyCode);
}

function doKeyUp(e){
	walk=0;
	vert=0;
}


function rainNails(){
	nailTimer++;
	if(nailTimer>nailClock){
		nailTimer=0;
		testint++;
		//testmess=String(testint);
		var bullet = new Array(Math.random()*550,-60,Math.random()*4-2,2);
		bullets.push(bullet);
		
		
	}


var length = bullets.length;

	for (var i = 0; i < length; i++) {

	  var el = bullets[i];
//testmess=String(element[0]);
	ctx.drawImage(NailPic, el[0]+shakeX, el[1]+shakeY,50,50);
  	  //ctx.fillText("Trolol", el[0], el[1]);
	el[0]+=el[2];
	el[3]+=.25;
	el[1]+=el[3];
	

	if(isCollide(posX,posY,el[0],el[1],75,75,50,50)){
	health-=50;
	bgcol = "red";
  
        stunTimer=0;
	bullets.splice(i,1);

	}

	if(el[1]>340){
		var n=3;
		for(var t=0; t<n; t++){
		explode(el[0],el[1]);
		}
		bullets.splice(i,1);

		
	}




 
    }




	var lengthy = shards.length;

	for (var i = 0; i < lengthy; i++) {
	  var shd = shards[i];

	

	ctx.drawImage(NailPic, shd[0]+shakeX, shd[1]+shakeY,20,20);
	shd[0]+=shd[2];
	shd[3]+=.25;
	shd[1]+=shd[3];
	

	if(isCollide(posX,posY,shd[0],shd[1],75,75,20,20)){
	health-=15;
	bgcol = "red";
  
        stunTimer=0;
	shards.splice(i,1);

	}


	if(shd[1]>340){
		shards.splice(i,1);

		
	}





	  
	}



	
}


function checkBoom(x,y){


	var length = bullets.length;
	for (var i = 0; i < length; i++) {
	  var b = bullets[i];
	  if(mouseX>b[0] && mouseX<b[0]+50 && mouseY>b[1] && mouseY<b[1]+50){
	  	var n=3;
		for(var t=0; t<n; t++){
		explode(b[0],b[1]);
		}
		bullets.splice(i,1);
	  }

 
        }

	var lengthy = bullets.length;
	for(var i=0; i<lengthy; i++){
		
	var b = shards[i];
	  if(mouseX>b[0] && mouseX<b[0]+20 && mouseY>b[1] && mouseY<b[1]+20){
	
		shards.splice(i,1);
	  }

	}




}

function isCollide(obj1x,obj1y,obj2x,obj2y,obj1w,obj1h,obj2w,obj2h) {
      return !(
        ((obj1y + obj1h) < (obj2y)) ||
        (obj1y > (obj2y + obj2h)) ||
        ((obj1x + obj1w) < obj2x) ||
        (obj1x > (obj2x + obj2w))
    );
}


function explode(x,y){
	var shard = new Array(x,y,Math.random()*10-5,-7);
	shards.push(shard);
}









function GameTick(elapsed)
{

    
	fps.update(elapsed);

   
      
       // posY += velY*elapsed;
    
   if ( (posX <= 0 && velX < 0) || (posX >= canvas.width-sizeX && velX > 0) ){

        velX = -velX;
  
   }
  if ( (posY <= 0 && velY < 0) || (posY >= canvas.height-82-sizeY && velY > 0) )
{       
	 velY = -velY;

 
  }  
	ctx.fillStyle = bgcol;
  
        ctx.drawImage(background, 0,0, canvas.width, canvas.height);
 

ctx.fillStyle = "grey";
ctx.fillRect(0+shakeX, 380+shakeY, 550, 50);
        ctx.fillStyle = "red";

	ctx.font = 'bold 15pt Calibri';
	ctx.fillText(testmess, 100, 100);
	ctx.drawImage(arrayz[frame], posX+shakeX, posY-5+shakeY,75,75);
	//ctx.drawImage(arrayz[0],somex,20,75,75);

	ctx.fillRect(25+shakeX, 385+shakeY, health, 10);
 

somex++;
rainNails();

stunTimer++;
if(stunTimer>10){
	bgcol='green';
	shakeX=0;
	shakeY=0;
}else{
	shakeX+=Math.random()*20-10;
	shakeY+=Math.random()*20-10;
}

posX += velX*elapsed;
 
velX=velX*.95;
	if(walk>0){


		if(walk==1){
			velX=150;
			frameRate++;
			if(frameRate>2){
				frameRate=0;
				frame++;
			}
			if(frame>6){
				frame=0;
			}  
		} 

		if(walk==2){
			velX=-150;
			frameRate++;
			if(frameRate>2){
				frameRate=0;
				frame--;
			}
			if(frame<0){
				frame=6;
			}
		}
	 } 

	if(vert>0){
		if(vert==1){
			velX=200;
		}
		if(vert==2){
			velX=200;
		}
	}  

	
        //fillCircle(ctx);

    
        var distX=35;

        var distY=0;
 
        time+=.04;
  
        distX=Math.sin(time)*-20;
  
        distY=Math.cos(time)*20;
  
  
        var pupX=15;
  
        var pupY=0;
  
       

	if(health<=0){
		
	ctx.fillStyle = "black";
  
        ctx.fillRect(0, 0, canvas.width, canvas.height);
 
	ctx.fillStyle = "white";
 
	ctx.fillText("GAME OVER", canvas.width/2-60, canvas.height/2);
	}

}






function fillCircle(ctx)
{
  
	ctx.beginPath();

        ctx.fillStyle="#FF4422"
; 
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