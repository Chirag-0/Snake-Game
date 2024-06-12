// let box = document.querySelector('.box');
// // console.log(box);
// // let e = 0;

// let m = 2;
// let m1 = 2;
// let m2 = 2;
// let m3 = 2;
// const boxMove = (e) => {
//     continousMove();
//     box.style.marginLeft = `${m++}px`;
// } 
// const boxMove2 = (e) => {
//     continousMove();
//     box.style.marginRight = `${m1++}px`;
// } 
// const boxMove3 = (e) => {
//     continousMove();
//     box.style.marginBottom = `${m2++}px`;
// } 
// const boxMove4 = (e) => {
//     continousMove();
//     box.style.marginTop = `${m3++}px`;
// } 

// const moveBox = (event) => {
//     if (event.key === 'ArrowUp') {
//         // Arrow Up key pressed
//         console.log('Arrow Up pressed');
//         boxMove3()
//     } else if (event.key === 'ArrowDown') {
//         // Arrow Down key pressed
//         console.log('Arrow Down pressed');
//         boxMove4()
//     } else if (event.key === 'ArrowLeft') {
//         // Arrow Left key pressed
//         console.log('Arrow Left pressed');
//     } else if (event.key === 'ArrowRight') {
//         // Arrow Right key pressed
//         console.log('Arrow Right pressed');
//         boxMove();


//     }
// }
// let margin = 0;
// let continousMove = () =>{
//     setInterval(()=>{
//         box.style.marginLeft = margin + "px";
//         margin++;
//     },50);
// }
// // continousMove();

// const detectCollisons = (o,j)=>{
//     console.log(o.width);
// }
// detectCollisons();
// document.addEventListener('keydown', moveBox);






const board = document.querySelector('#game-board');
const instruction = document.querySelector('#instruction-text');
const logo = document.querySelector('#logo');
const score = document.querySelector('#score');
const highScoreText = document.querySelector('#highScore');
const highText = document.querySelector('.hiT');
const soundOn = document.querySelector('.sound');
const soundOff = document.querySelector('.sound2');

//Create game variables
const gridSize = 20;
let snake = [{x:10,y:10}];
let food = generateFood();
let highScore = 0;
let direction = 'up';
let gameInterval;
let gameSpeed = 200;
let gameStarted = false;
let isMusicOn = true;

//Draw game map, snake,food
function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

//Draw snake 
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElem = createGameElem('div','snake');
        setPositon(snakeElem,segment);
        board.appendChild(snakeElem);
    });
}

//create a snake or food cube/div
function createGameElem(tag,className){
    const elem = document.createElement(tag);
    elem.className = className;
    return elem;
}

//Set the position of snake or food  
function setPositon(elem,positon){
    elem.style.gridColumn = positon.x;
    elem.style.gridRow = positon.y;
}


//Draw food function
function drawFood(){
    if(gameStarted){
        const foodElem = createGameElem('div','food');
        setPositon(foodElem,food);
        board.appendChild(foodElem);
    }
}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1; 
    const y = Math.floor(Math.random() * gridSize) + 1; 
    return {x,y};
}

//Move the snake
function moveSnake(){
    const head = { ...snake[0] };
    // console.log(head);
    switch (direction){
        case 'up':
            head.y--;
            break;
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'down':
            head.y++;
            break;
    }

    snake.unshift(head);
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        playEatSound();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
            moveSnake();
            checkCollision();
            draw();
        },gameSpeed);
    } else {
        snake.pop();
    }
        
}

//Start game function
function startGame(){
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        moveSnake();
        checkCollision();
        draw();

    },gameSpeed);
}

//Keypress event handle
// const currentDirection = 'up';
function handleKeyPress(event){
    let keyPressed = event.key;
    if((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')){
        startGame();
    }else{
        //For checking if our snake is moving in right and we click on arrow left so it does not trigger resetGame
        if ((keyPressed === 'ArrowUp' && direction !== 'down') ||
        (keyPressed === 'ArrowDown' && direction !== 'up') ||
        (keyPressed === 'ArrowLeft' && direction !== 'right') ||
        (keyPressed === 'ArrowRight' && direction !== 'left')){
        switch (event.key){
            case 'ArrowUp':
            direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
     }
    }
}

function increaseSpeed(){
    if(gameSpeed > 150){
        gameSpeed -= 5;
    }else if(gameSpeed > 100){
        gameSpeed -= 3;
    }
    else if(gameSpeed > 50){
        gameSpeed -= 2;
    }
    else if(gameSpeed > 25){
        gameSpeed -= 1;
    }
}

function checkCollision(){
    const head = snake[0];
    //Checking if snake is touching the boundary or not
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        playOutSound();
        resetGame();
    }

    // Checking if snake is touching itself or not

    for(let i = 1; i < snake.length; i++){
        console.log(head.x,snake[i]);
        if(head.x === snake[i].x && head.y === snake[i].y){
            playOutSound();
            resetGame();
        }
    }
}

function resetGame(){
    updateHightScore();
    snake = [{x:10,y:10}];
    stopGame();
    direction = 'right';
    food =  generateFood();
    gameSpeed = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instruction.style.display = 'block';
    logo.style.display = 'block';
}

function updateHightScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';
    highText.style.display = 'block';
}


function playEatSound(){
    if(isMusicOn === false){
        return;
    }
    let eatSound = new Audio('lowSnake.mp3');
    eatSound.play();
}

function playOutSound(){
    if(isMusicOn === false){
        return;
    }
    let outSound = new Audio('snakeDieSound.mp3');
    outSound.play();
}


function musicOff(){
    isMusicOn = false;
    changeIcon();
}

function musicOn(){
    isMusicOn = true;
    changeIcon();
}

function changeIcon(){
    if(!isMusicOn){
        soundOn.style.display = 'none';
        soundOff.style.display = 'block';
        soundOn.innerHTML = soundOff;
    } else{
        soundOn.style.display = 'block';
        soundOff.style.display = 'none';
        soundOff.innerHTML = soundOn;
    }
}

soundOn.addEventListener('click',musicOff);
soundOff.addEventListener('click',musicOn);
document.addEventListener('keydown',handleKeyPress);