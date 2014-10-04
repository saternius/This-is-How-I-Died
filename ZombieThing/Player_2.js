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
var stage_width = 648;
var stage_height = 496;
var mouseX=0;
var mouseY=0;

var x = 10;
var y = 10;

var width = 8;
var height = 8;

var speed = 1;

var gridX=Math.floor(stage_width/width)+1;
var gridY=Math.floor(stage_height/height)+1;

var plane = new Array(gridX); //<- sets width
var p;
for (p = 0; p < plane.length; p++) {
    plane[p] = new Array(gridY); //<- sets height
}

var grid = false;
var right = 0;
var up = 0;

var fps_timer = 4;
var fps_slam = 4;
var status = "Alive";
var aliveTimer = 150;
var alive = true;

//ServerSide Script
//var Server_Players = new Firebase('https://tihid.firebaseio.com/GameData/Active'); //lists active players
var Server_Zombies = new Firebase('https://tihid.firebaseio.com/GameData/Zombies'); //lists Zombies
var myData = new Firebase('https://tihid.firebaseio.com/PlayerData/Player2'); //lists my x,y coords and colour
//var playerData = new Array(3);
//var activePlayers = new Array(3);
var colour = "YELLOW";
/*
for(var t=0; t<activePlayers.length;t++){
    activePlayers[t]=false;
}
*/
/*
Server_Players.on("value", function(data) {
    //TODO make elegant with arrays and such with like 64 players
    var p2 = data.val() ? data.val().p2 : "";
    var p3 = data.val() ? data.val().p3 : "";

    console.log("p2: "+p2+", p3: "+p3);

    if(p2 == "ACTIVE"){
        activePlayers[1] = true;
        console.log("Activated p2");
        playerData[1] = new Firebase('https://tihid.firebaseio.com/PlayerData/Player2');
    }
    if(p3 == "ACTIVE"){
        activePlayers[2] = true;
        playerData[2] = new Firebase('https://tihid.firebaseio.com/PlayerData/Player3');
    }

    initPlayerData();
});
*/


var players_x = new Array(3);
var players_y = new Array(3);
var players_color = new Array(3);

var z_plane = new Array(gridX); //<- sets width
for (p = 0; p < z_plane.length; p++) {
    z_plane[p] = new Array(gridY); //<- sets height
}





/*
function initPlayerData(){

    for(var b=1; b<playerData.length;b++){
        if(activePlayers[b]){
            //TODO make elegant with arrays and such with like 64 players
            console.log("listing on :"+b);
            var passed_var = new Number(b);

            playerData[b].on("value", function(data) {
                console.log("recording on :"+passed_var);
                players_x[passed_var] = data.val() ? data.val().x : "";
                players_y[passed_var] = data.val() ? data.val().y : "";
                players_color[passed_var] = data.val() ? data.val().color : "";
                console.log("player_"+passed_var+" x:"+players_x[passed_var]+" y:"+players_y[passed_var]);
            });
        }
    }
}
*/


//ONLY HOST MATTERS
var hostData = new Firebase('https://tihid.firebaseio.com/PlayerData/HostData'); //lists my x,y coords and colour
var host_x = 0;
var host_y = 0;
var host_color = 0;

hostData.on("value", function(data) {
    host_x = data.val() ? data.val().x : "";
    host_y = data.val() ? data.val().y : "";
    host_color = data.val() ? data.val().color : "";
   // console.log("player_"+passed_var+" x:"+players_x[passed_var]+" y:"+players_y[passed_var]);
});

Server_Zombies.on("value", function(data) {
    var z_cords = data.val() ? data.val().zombies : "";
   // console.log(z_cords);
    for(var y=0;y<gridX;y++){
        for(var z=0;z<gridY;z++){
            if(z_cords.substring(0,1) == "1"){
                z_plane[y][z] = true;
            }else{
                z_plane[y][z] = false;
            }
            z_cords = z_cords.substring(1,z_cords.length);
        }
    }
});

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
        drawGrid();
    }


    //server initialization
    for(var i=0; i<gridX; i++){
        for(var j=0;j<gridY;j++){
            server_plane[gridX][gridY] = false;
        }
    }

};

function drawGrid(){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,stage_width,stage_height);
    //draw grid system
    var i;
    for(i=0; i<plane.length;i++){
        ctx.beginPath();
        ctx.moveTo(i*width, 0);
        ctx.lineTo(i*width, stage_height);
        ctx.stroke();
    }
    for(i=0; i<plane[0].length; i++){
        ctx.beginPath();
        ctx.moveTo(0, i*height);
        ctx.lineTo(stage_width, i*height);
        ctx.stroke();
    }
}

function doKeyDown(e){
    if(e.keyCode==39 && e.keyCode!=37){
        //Right
        right = 1
    }
    if(e.keyCode==37 && e.keyCode!=39){
        //Left
        right = 2;
    }
    if(e.keyCode==38 && e.keyCode!=40){
        //Up
        up = 1;
    }
    if(e.keyCode==40 && e.keyCode!=38){
        //Down
        up = 2;
    }
}

function doKeyUp(e){
    if(e.keyCode==39 || e.keyCode==37){
        //Right or Left
        right = 0
    }
    if(e.keyCode==38 || e.keyCode==40){
        //Up or Down
        up = 0;
    }
}


function GameTick(elapsed){
    fps_timer--;
    if(fps_timer<0 && alive){
        fps_timer = fps_slam;
        fps.update(elapsed);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,stage_width,stage_height);
        if(grid){
            drawGrid();
        }
        if(status == "Alive"){
            ctx.fillStyle = "#FF0000";
            colour = "YELLOW";
        }else if(status == "Bitten" && aliveTimer>50){
            ctx.fillStyle = "#ff9933";
            colour = "ORANGE";
        }else if(status == "Bitten" && aliveTimer<=50 && aliveTimer>0){
            if(aliveTimer%2==0){
                ctx.fillStyle = "#ff9933";
                colour = "ORANGE";
            }else{
                ctx.fillStyle = "#008a24";
                colour = "GREEN";
            }
        }else if(status == "Bitten" && aliveTimer<0){
            ctx.fillStyle = "#008a24";
            colour = "GREEN";
            alive = false;
            status = "Zombie";
        }
        if(status == "Bitten"){
            aliveTimer--;
        }

        ctx.fillRect(x*width,y*height,width,height);
        ctx.fillStyle = "#000000";
        ctx.fillText("Status = "+status,50,50);
        //walk
        if(right == 1 && x<gridX-2){
            x+=speed;
        }else if(right == 2 && x>0){
            x-=speed;
        }
        if(up == 1 && y>0){
            y-=speed;
        }else if(up == 2 && y<gridY-2){
            y+=speed;
        }


        //serverOperations
        drawZombies();
        drawPlayers();
        sendCurData();
    }
    if(!alive){
        ctx.fillStyle = "#000000";
        ctx.fillText("GAME OVER",250,250);
    }


}



function drawPlayers(){
    /*
    for(var b=1; b<playerData.length;b++){
        if(activePlayers[b]){

            if(players_color[b] == "YELLOW"){
                ctx.fillStyle = "#FFFF00";
            }else if(players_color[b] == "ORANGE"){
                ctx.fillStyle = "#FFF021";
            }else if(players_color[b] == "GREEN"){
                ctx.fillStyle = "#008a24";
            }
            //console.log("Player "+b+":{x:"+players_x[b]+", y:"+players_y[b]);
            ctx.fillRect(players_x[b]*width,players_y[b]*height,width,height);
        }
    }*/
    //ONLY HOST MATTERS FOR NOW
    if(host_color == "YELLOW"){
        ctx.fillStyle = "#FFFF00";
    }else if(host_color == "ORANGE"){
        ctx.fillStyle = "#FFF021";
    }else if(host_color == "GREEN"){
        ctx.fillStyle = "#008a24";
    }
    ctx.fillRect(host_x*width,host_y*height,width,height);
}



function getNearestPlayer(){
    return 0;
}
function checkBitten(i,j){
    if(x==i && j==y){
        status = "Bitten";
    }
}

function drawZombies(){
    //zombies = 0;
    for(var y=0;y<gridX;y++){
        for(var z=0;z<gridY;z++){
            if(z_plane[y][z]){
                ctx.fillStyle = "#008a24";
                ctx.fillRect(y*width,z*height,width,height);
            }

        }
    }

}

function sendCurData(){
    // console.log("Zombie Cords: "+zomb_cords);
    myData.set({x:x,y:y,color:colour});
}
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top

    };
}