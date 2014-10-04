// ----------------------------------------
// Actual game code goes here.

// 
//Global 
//vars


fps = null;
canvas = null;
ctx = null;


// ----------------------------------------
//var Walk = Object.freeze({"LEFT":1, "RIGHT":2, "DOWN":3,"UP":4, "STAND":5, "UP-LEFT":6,"UP-RIGHT":7, "DOWN-LEFT":8, "DOWN-RIGHT":9});
//Object.freeze(Walk);

// Our 'game' variables
var stage_width = 650;
var stage_height = 500;
var mouseX=0;
var mouseY=0;

var x = 10;
var y = 10;

var width = 8;
var height = 8;

var speed = 1;

var fps_slam = 3;
var fps_timer = 3;

var plane = new Array(Math.floor(stage_width/width)); //<- sets width
for (var i = 0; i < plane.length; i++) {
    plane[i] = new Array(Math.floor(stage_height/height)); //<- sets height
}

var grid = false;
var dir = 1;
var tail = 20;
var xClaim = [];
var yClaim = [];
//var person = prompt("What be your username?","Jayson");
//var myDataRef = new Firebase('https://this-is-how-i-die.firebaseio.com/'+person);

/*
myDataRef_p2.on("value", function(data) {
   var snake_x = data.val() ? data.val().player2_x : "";
   var snake_y = data.val() ? data.val().player2_y : "";
   registerSnake(snake_x,snake_y);
});
*/



window.onload = function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
    fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));


    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        mouseX = mousePos.x;
        mouseY= mousePos.y;
    }, false);

    window.addEventListener( "keydown", doKeyDown, false );
    window.addEventListener( "keyup", doKeyUp, false );
    GameLoopManager.run(GameTick);
    ctx.font = 'bold 15pt Calibri';
    if(grid){
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,stage_width,stage_height);
        //draw grid system
        for(var i=0; i<plane.length;i++){
            ctx.beginPath();
            ctx.moveTo(i*width, 0);
            ctx.lineTo(i*width, stage_height);
            ctx.stroke();
        }
        for(var i=0; i<plane[0].length; i++){
            ctx.beginPath();
            ctx.moveTo(0, i*height);
            ctx.lineTo(stage_width, i*height);
            ctx.stroke();
        }
    }


};

function doKeyDown(e){
    if(e.keyCode==39 && dir !=2){
        dir = 1;
    }
    if(e.keyCode==37 && dir!=1){
        //Left
        dir = 2;
    }
    if(e.keyCode==38 && dir!=4){
        //Up
        dir = 3;
    }
    if(e.keyCode==40 && dir!=3){
        //Down
        dir =4;
    }
}

function doKeyUp(e){

}

/*
function registerSnake(snakeX,snakeY){
    //alert("here");
    opponentX = snakeX.split(",");
    opponentY = snakeY.split(",");
    //alert("this far");
}
*/

function isCollide(obj1x,obj1y,obj2x,obj2y,obj1w,obj1h,obj2w,obj2h) {
    return !(
        ((obj1y + obj1h) < (obj2y)) ||
            (obj1y > (obj2y + obj2h)) ||
            ((obj1x + obj1w) < obj2x) ||
            (obj1x > (obj2x + obj2w))
        );
}


function GameTick(elapsed){
    fps_timer--;
    if(fps_timer==0){
        fps_timer = fps_slam;
        fps.update(elapsed);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,stage_width,stage_height);
        ctx.fillStyle = "#FF0000";
        //ctx.fillRect(x*width,y*height,width,height)

        ctx.fillText("Dir = "+dir,100,100);
        //walk
        if(dir == 1){
            x+=speed;
        }else if(dir == 2){
            x-=speed;
        }
        if(dir == 3){
            y-=speed;
        }else if(dir == 4){
            y+=speed;
        }

        if(x>(stage_width/width)-2){
            x=2;
        }
        if(x<2){
            x= (stage_width/width)-2;
        }

        if(y>(stage_height/height)-2){
            y=2;
        }
        if(y<2){
            y= (stage_height/height)-2;
        }

        xClaim.push(Math.floor(x));
        yClaim.push(Math.floor(y));

        var x_cords = "";
        var y_cords = "";
        for(var i=0; i<xClaim.length;i++){
            var temp_x = xClaim.shift();
            var temp_y = yClaim.shift();
            x_cords += temp_x+",";
            y_cords += temp_y+",";
            ctx.fillRect(temp_x*width,temp_y*height,width,height);
            if(i<tail){
                xClaim.push(temp_x);
                yClaim.push(temp_y);
                var temp_x2 = xClaim.shift();
                var temp_y2 = yClaim.shift();
                xClaim.push(temp_x);
                yClaim.push(temp_y);
            }
        }

        ctx.fillStyle = "#00FF00";

        for(var i=0; i<opponentX.length;i++){
            var temp_x = opponentX[i];
            var temp_y = opponentY[i];
            ctx.fillRect(temp_x*width,temp_y*height,width,height);
        }

        //log coords
     //   myDataRef.set({player1_x:x_cords,player1_y:y_cords});
        // myDataRef.set('x: ' + x_cords + ' y: ' + y_cords);
    }

}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top

    };
}