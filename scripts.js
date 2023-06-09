
// Hittar canvasen
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");


// Skapar användare paddel
const user = {
    x: 0,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score: 0,
    upkey: false,
    downKey: false,
    speed: 3,
    velocityY: 0,
    friction: 0.8
}
// Skapar AI paddle
const com = {
    x: canvas.width - 10,
    y: canvas.height/2 - 100/2,
    width: 10,
    height: 100,
    color: "white",
    score: 0,
    upkey: false,
    downKey: false,
    speed: 3,
    velocityY: 0,
    friction: 0.8
}
//Skapar bollen
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "white"
}
// Skapar Net
const net = {
    x: canvas.width/2 - 1,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}
// StartBox
const rectTextSingle = {
    x: canvas.width/2 - 155,
    y: canvas.height/2 - 100,
    w: 310,
    h: 60
}
const rectTextMulti = {
    x: canvas.width/2 - 143,
    y: canvas.height/2 + 10,
    w: 287,
    h: 50
}


// Ritar rect funktion
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

// Ritar Net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15) {
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

// Renderar alla komponenter
function render(){
    // Gör rent canvas
    drawRect(0, 0, canvas.width, canvas.height, "black");

    // Ritar net
    drawNet();

    // Ritar Score
    drawText(user.score, canvas.width/4, canvas.height/5, "white");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "white");

    // Ritar användare och COM Paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Ritar bollen
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
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
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// reset ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}


// En simpel AI som styr com paddlen
function aiBot() {
    let computerLevel = 0.05;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel;
}


// Checkar om tangentbords nertryckning. Om ja, lämna true
window.addEventListener("keydown", function (evt) {
    if (evt.key === "w") {
        user.upkey = true;
    }
    else if (evt.key === "s") {
        user.downKey = true;
    }

    if (evt.key === "ArrowUp") {
        com.upkey = true;
    }
    else if (evt.key === "ArrowDown") {
        com.downKey = true;
    }
})
// Checkar om tangentbords uptryckning. Om ja, lämna false
window.addEventListener("keyup", function (evt) {
    if (evt.key === "w") {
        user.upkey = false;
    }
    else if (evt.key === "s") {
        user.downKey = false;
    }

    if (evt.key === "ArrowUp") {
        com.upkey = false;
    }
    else if (evt.key === "ArrowDown") {
        com.downKey = false;
    }
})

// Kod för spelarens movement
function playerMovement() {
    // checkar samt ökar/sänker speeden
    if (user.upkey) {
        if (user.velocityY > -user.speed) {
            user.velocityY--;
        }
    }
    else if (user.downKey) {
        if (user.velocityY < user.speed) {
            user.velocityY++;
        }
    }

    // Kant kolition
    if (user.y < -0) { user.y = 0; }
    else if (user.y + user.height > canvas.height) { user.y = canvas.height - user.height; }

    // Friktion
    user.velocityY *= user.friction;
    user.y += user.velocityY;
}

// Kod för com movement
function comMovement() {
    // checkar samt ökar/sänker speeden
    if (com.upkey) {
        if (com.velocityY > -com.speed) {
            com.velocityY--;
        }
    }
    else if (com.downKey) {
        if (com.velocityY < com.speed) {
            com.velocityY++;
        }
    }

    // Kant kolition
    if (com.y < -0) { com.y = 0; }
    else if (com.y + com.height > canvas.height) { com.y = canvas.height - com.height; }

    // Friktion
    com.velocityY *= com.friction;
    com.y += com.velocityY;
}


// Uppdatera statistik och logik etc
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width/2) ? user : com;
    if (collision(ball,player)) {
        // Bestämmer vart bollen träffar paddlen
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint = collidePoint/(player.height/2);

        // Kalkylerar vinkeln på radien
        let angleRad = collidePoint * Math.PI/4;

        // X hållets vinkel på bollen när träffad
        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        // Ändrar vel x och y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Höja hastigheten vid varje stuts
        ball.speed += 0.33;
    }

    // Uppdatera score
    if(ball.x + ball.radius > canvas.width){
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

// Game singleplayer init
function gameSp() {
    update();
    render();
    aiBot();
    playerMovement();
}

 // Game multiplayer init
function gameMp() {
    update();
    render();
    playerMovement();
    comMovement();
}


// Laddar start och canvas
window.addEventListener("load", function start_load() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawText("singleplayer", rectTextSingle.x, rectTextSingle.y + 60, "white");
    drawText("multiplayer", rectTextMulti.x, rectTextMulti.y + 50, "white");
})

// Checkar mouse pos
canvas.addEventListener("mousemove", getMousePos);
let r = canvas.getBoundingClientRect();
function getMousePos(e) {
    return {
        x: e.clientX - r.left,
        y: e.clientY - r.top
    };
}

// Om mus är inom en pos(start text), starta spelet
canvas.addEventListener('click', checkStart, false);
function checkStart(e) {
    const framePerSecond = 60;
    let p = getMousePos(e);
    let go = true;

    if (p.x >= rectTextSingle.x && p.x <= rectTextSingle.x + rectTextSingle.w &&
        p.y >= rectTextSingle.y && p.y <= rectTextSingle.y + rectTextSingle.h) {

        if (go === true) {
            setInterval(gameSp, 1000 / framePerSecond);
        }
    }
    else if (p.x >= rectTextMulti.x && p.x <= rectTextMulti.x + rectTextMulti.w &&
        p.y >= rectTextMulti.y && p.y <= rectTextMulti.y + rectTextMulti.h)  {

        if (go === true) {
            setInterval(gameMp, 1000 / framePerSecond);
        }
    }
}
