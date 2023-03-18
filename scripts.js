
// Hittar canvasen
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");


// Skapar användare paddel
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}
// Skapar AI paddle
const com = {
    x : cvs.width - 10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "white",
    score : 0
}
//Skapar bollen
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "white"
}
// Skapar Net
const net = {
    x : cvs.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "white"
}
// StartBox
const rectText = {
    x: cvs.width/2 - 70,
    y: cvs.height/2 - 60,
    w: 115,
    h: 60
}


// Ritar rect funktion
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

// Ritar Net
function drawNet(){
    for(let i = 0; i <= cvs.height; i+=15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Ritar cirkel funktion
function drawCircle(x,y,r,color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

// Rita Text
function drawText(text, x,y,color){
    ctx.fillStyle = color;
    ctx.font = "60px fantasy";
    ctx.fillText(text,x,y);
}


function render(){
    // Gör rent canvas
    drawRect(0, 0, cvs.width, cvs.height, "black");

    // Ritar net
    drawNet();

    // Ritar Score
    drawText(user.score, cvs.width/4, cvs.height/5, "white");
    drawText(com.score, 3*cvs.width/4, cvs.height/5, "white");

    // Ritar användare och COM Paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Ritar bollen
    drawCircle(ball.x, ball.y, ball.radius, ball.color)
}

// Kontrollera användarens paddel
cvs. addEventListener("mousemove", movePaddle);
function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}


// Coalitions detektor
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// reset ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX
}

// update stats etc
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // En simpel AI som styr com paddlen
    let computerLevel = 0.07;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    if (collision(ball,player)){
        // Bestämmer vart bollen träffar paddlen
        let collidePoint = ball.y - (player.y + player.height/2)
        collidePoint = collidePoint/(player.height/2);

        // Kalkylerar vinkeln på radien
        let angleRad = collidePoint * Math.PI/4;

        // X hållets vinkel på bollen när träffad
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        // Ändrar vel x och y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Höja hastigheten vid varje stuts
        ball.speed += 0.33;
    }

    // Uppdatera score
    if(ball.x + ball.radius > cvs.width){
        // Användare vinst
        user.score++;
        resetBall();
    }
    else if(ball.x - ball.radius < 0){
        // Com vinst
        com.score++;
        resetBall();
    }
}


// Game init
function game(){
    update();
    render();
}

// Laddar start och canvas
window.addEventListener("load", function start_load() {
    drawRect(0, 0, cvs.width, cvs.height, "black");
    drawText("start", rectText.x, rectText.y + 60, "white");

})

// Checkar mouse pos
function getMousePos(e) {
    let r = cvs.getBoundingClientRect();
    return {
        x: e.clientX - r.left,
        y: e.clientY - r.top
    };
}

// Om mus är inom en pos(start text), starta spelet
cvs.addEventListener('click', checkStart, false);
function checkStart(e) {
    let p = getMousePos(e);

    if (p.x >= rectText.x && p.x <= rectText.x + rectText.w &&
        p.y >= rectText.y && p.y <= rectText.y + rectText.h) {

        let go = true;
        if (go === true) {
            const framePerSecond = 60;
            setInterval(game, 1000 / framePerSecond);
        }
    }
}
