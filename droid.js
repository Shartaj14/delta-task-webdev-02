const canvas=document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = Math.min(window.innerWidth, window.innerHeight)*0.95;

//take relative to the window size
canvas.width=size;
canvas.height=size;

let home_health=10;
let player_health=10;
let bots=[];
let bullets=[];
let player_direction=0;
let playerx=size*0.1;
let playery=size*0.9;
let clear=false;
let score=10;
let started=false;
let mousex=0;
let mousey=0;

function setbots(){
    if(!started){
    started=true;
    setInterval(function(){
        bots.push([Math.random()*0.92*size,size*0.05]);
    },2000);
}

}

function move_player(event){
    setbots();
    if(event.key==="ArrowLeft"){
        player_direction=-1;
    }
    else if(event.key==="ArrowRight"){
        player_direction=1;
    }
    playerx+=player_direction*size*0.01;
    clear=true;
}


function shoot(event){
    setbots();
    //clientX and clientY are positions of mouse absolutely
    //to find it relative to the canvas subtract canvas positions from it
    let delx=event.clientX-rect.left-playerx;
    let dely=event.clientY-rect.top-playery;
    let pyth=Math.sqrt(delx*delx+dely*dely);
    const bullet={
        x: playerx,
        y: playery,
        dx: delx/pyth*8,
        dy: dely/pyth*8,
        kills:0
    };
    bullets.push(bullet);
}

function drawline(event){
    setbots();
    mousex=event.clientX-rect.left;
    mousey=event.clientY-rect.top;
    ctx.strokeStyle="white";
    ctx.beginPath();
    ctx.moveTo(playerx,playery);
    ctx.lineTo(mousex,mousey);
    ctx.stroke();
    ctx.closePath();

}

function draw_everything(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    gradient.addColorStop(0, "rgb(112,58,110)"); // Start color at the center
    gradient.addColorStop(1, "rgb(85,51,90)"); // End color at the outer circle
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const player_rem = new Path2D();
    player_rem.rect(size * 0.01, size * 0.01, size * 0.4, size * 0.025);
    ctx.fillStyle = "rgb(229,70,69)";
    ctx.fill(player_rem);
    player_rem.closePath();


    const player_bar = new Path2D();
    player_bar.rect(size * 0.01 + player_health * size * 0.4 / 10, size * 0.01, size * 0.4 - player_health*size*0.4/10, size * 0.025);
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.fill(player_bar);
    player_bar.closePath();

    ctx.fillStyle = "black ";
    ctx.font = `${size * 0.02}px Arial`;
    ctx.fillText(`SCORE: ${score}`, size * 0.45, size * 0.03);

    ctx.fillStyle = "black";
    ctx.font = `${size * 0.02}px Arial`;
    ctx.fillText("PLAYER HEALTH", size * 0.02, size * 0.03);

    const home_rem = new Path2D();
    home_rem.rect(size * 0.59, size * 0.01, size * 0.4, size * 0.025);
    ctx.fillStyle = "rgb(229,70,69)";
    ctx.fill(home_rem);
    home_rem.closePath();

    const home_bar = new Path2D();
    home_bar.rect(size * 0.59 + home_health * size * 0.4 / 10, size * 0.01, size * 0.4 - home_health*size*0.4/10, size * 0.025);
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.fill(home_bar);
    home_bar.closePath();

    ctx.fillStyle = "black";
    ctx.font = `${size * 0.02}px full block`;
    ctx.fillText("HOME HEALTH", size * 0.6, size * 0.03);

    ctx.rect(size * 0.3, size * 0.7, size * 0.4, size * 0.1);
    ctx.fillStyle = "orange";
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = `bold ${size * 0.03}px buka bird`;
    ctx.fillText("HOME", size * 0.5 - size * 0.1 + size * 0.06, size * 0.7 + size * 0.06);

    ctx.fillStyle = "rgb(229,70,69)";
    for(let i=0;i<bots.length;i++){
        ctx.fillRect(bots[i][0], bots[i][1], size * 0.03, size * 0.03);
        bots[i][1] += size * 0.003;
    }

    ctx.fillStyle = "rgb(208,78,208)";
    for(let i=0;i<bullets.length;i++){
        ctx.fillRect(bullets[i].x, bullets[i].y, size * 0.02, size * 0.02);
        bullets[i].x+=bullets[i].dx;
        bullets[i].y+=bullets[i].dy;
        if(!(bullets[i].y>0&&bullets[i].y<size&&bullets[i].x>0&&bullets[i].x<size)){
            if(bullets[i].kills===0){
                //fruitless bullets will decrease score
                if(score>0) score--;
            }
            bullets.splice(i,1);
        }
    }

    if (playerx < size * 1.05 && playerx > -size * 0.05) {
        let player_body = new Path2D();
        player_body.arc(playerx, playery, size * 0.05, 0, Math.PI * 2, true);
        ctx.fillStyle = "rgb(183,19,115)";
        ctx.fill(player_body);
        player_body.closePath();
    }

    else {
        if (playerx >= size * 1.05) {
            playerx = -size * 0.05;
        }
        else if (playerx <= -size * 0.05) {
            playerx = size * 1.05;
        }
    }

    for(let i=0;i<bots.length;i++){
        for(let j=0;j<bullets.length;j++){
            //check if bullet hit the bot
            try{
                if (
                    bullets[j].x < bots[i][0] + size * 0.03 &&//bot height, width=size*0.03
                    bullets[j].x + size * 0.02 > bots[i][0] &&//bullet height, width=size*0.02
                    bullets[j].y < bots[i][1] + size * 0.03&&
                    bullets[j].y + size * 0.02 > bots[i][1]
                ) {
                    bots.splice(i, 1);
                    bullets[j].kills++;
                    score+=4;
                }
            }
            catch(error){}      
        }
        try{

            //check if it hits the home base and decrease home health
            if (
                size*0.7 < bots[i][1] + size * 0.03 &&
                size*0.8 > bots[i][1] &&
                size*0.3 < bots[i][0] + size * 0.03 &&
                size*0.7 > bots[i][0]
                )
            {
                home_health--;
                bots.splice(i,1);
            }

            //check if it hits the player and decrease playerhealth
            if (
                playery-size*0.05 < bots[i][1] + size * 0.03 &&
                playery+size*0.05 > bots[i][1] &&
                playerx-size*0.05 < bots[i][0] + size * 0.03 &&
                playerx+size*0.05 > bots[i][0]
                )
            {
                player_health--;
                bots.splice(i,1);
            }

            
                //if bots survive till bottom decrease score
                if(bots[i][1]>size){
                    bots.splice(i,1);
                    if(score>0) score--;
                }
        }
        catch(error){}
    }

    if(player_health<=0||home_health<=0){
        return reloadPage();
    }
}

game_interval=setInterval(draw_everything,15);

function reloadPage() {
    clearInterval(game_interval);
    alert("Game over! Your score: " + score);
    location.reload(true);
}

document.addEventListener("keydown",move_player);
document.addEventListener("mousedown",shoot);

const rect = canvas.getBoundingClientRect();
//rect gets the position of canvas top left point

document.addEventListener("mousemove",drawline);
