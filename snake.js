let gameframe = document.getElementById('gameframe');
let scoreCounter = document.getElementById('score');
let speedInput = document.getElementById('speed');
let sizeInput = document.getElementById('size');
let speedLabel = document.getElementById('speedLabel');
let sizeLabel = document.getElementById('sizeLabel');

let runtime;


let fieldnumber = 15;
let game_speed = 280;
let walkableWalls = true;


let snake = [ [1,4], [1,3], [1,2], [1,1] ];
let apple = [1,1];
let direction = 'right';

window.addEventListener("keydown", function(event) {
    if(event.defaultPrevented) {
        return;
    }
    if(event.code == 'ArrowLeft') {
        switch(direction) {
            case 'up':
                direction = 'left';
                break;
            case 'left':
                direction = 'down';
                break;
            case 'down':
                direction = 'right';
                break;
            case 'right':
                    direction = 'up';
                    break;
            default:
                break;
        }
    }
    if(event.code == 'ArrowRight') {
        switch(direction) {
            case 'up':
                direction = 'right';
                break;
            case 'right':
                direction = 'down';
                break;
            case 'down':
                direction = 'left';
                break;
            case 'left':
                    direction = 'up';
                    break;
            default:
                break;
        }
    }
});

for(let i = 1; i < fieldnumber; i++) {
    for(let k = 1; k < fieldnumber; k++) {
        gameframe.innerHTML += '<div class="field" style="grid-column-start: ' + i +  '; grid-row-start: ' + k + ';"></div>'; 
    }
}

function getField(x, y) {
    return gameframe.childNodes[x-1 + (fieldnumber-1) * (y-1)];
}

function changeSize(input) {
    sizeLabel.innerHTML = 'Size: ' + input;
    fieldnumber = input;
    gameframe.innerHTML = '';
    for(let i = 1; i < fieldnumber; i++) {
        for(let k = 1; k < fieldnumber; k++) {
            gameframe.innerHTML += '<div class="field" style="grid-column-start: ' + i +  '; grid-row-start: ' + k + ';"></div>'; 
        }
    }
}

function changeSpeed(input) {
    speedLabel.innerHTML = 'Speed: ' + input;
    game_speed = 530 - (input * 50);
}

function color_field(x, y, color) {
    getField(x,y).style.backgroundColor = color;
}

function changeWalls() {
    walkableWalls = !walkableWalls;
}

function newApple() {
    let done = false;
    let randX = 0;
    let randY = 0;
    while(done == false) {
        done = true;
        randX = Math.floor(Math.random() * (fieldnumber-1) + 1);
        randY = Math.floor(Math.random() * (fieldnumber-1) + 1);
        console.log(randX + ', ' + randY);
        for(let k = 0; k < snake.length; k++) {
            if(snake[k][0] == randY && snake[k][1] == randX) {
                done = false;
            }
        }
    }
    apple = [randY, randX];
    color_field(randY, randX, 'darkred');
}

function renderFrame() {
    //Snakemove:
    let next_x = 0;
    let next_y = 0;
    switch(direction) {
        case 'up':
            next_x = snake[0][1];
            next_y = snake[0][0] - 1;
            break;
        case 'right':
            next_x = snake[0][1] + 1;
            next_y = snake[0][0];
            break;
        case 'down':
            next_x = snake[0][1];
            next_y = snake[0][0] + 1;
            break;
        case 'left':
            next_x = snake[0][1] - 1;
            next_y = snake[0][0];
            break;
        default:
            break;
    }    
    //Wrap-Around:
    if(next_x > fieldnumber - 1) {
        if(walkableWalls == true) {
            next_x = 1;
        } else {
            clearInterval(runtime);
            alert('Game Over');
            return;
        }
    }
    if(next_x < 1) {
        if(walkableWalls == true) {
            next_x = fieldnumber - 1;
        } else {
            clearInterval(runtime);
            alert('Game Over');
            return;
        }
    }
    if(next_y > fieldnumber - 1) {
        if(walkableWalls == true) {
            next_y = 1;
        } else {
            clearInterval(runtime);
            alert('Game Over');
            return;
        }
    }
    if(next_y < 1) {
        if(walkableWalls == true) {
            next_y = fieldnumber - 1;
        } else {
            clearInterval(runtime);
            alert('Game Over');
            return;
        }
    }

    //Game-Over-Detection:
    for(let k = 0; k < snake.length; k++) {
        if(snake[k][0] == next_y && snake[k][1] == next_x) {
            clearInterval(runtime);
            alert('Game Over');
            return;
        }
    }

    //Apple-Detection:
    if(!(next_x == apple[1] && next_y == apple[0])) {
        let to_eraze = snake.pop();
        color_field(to_eraze[0], to_eraze[1], '');
    }
    else {
        newApple();
        let scoreCount = parseInt(scoreCounter.innerHTML);
        scoreCount++;
        scoreCounter.innerHTML = scoreCount;
    }
    
    snake.unshift([next_y, next_x]);

    for(let z = 0; z < snake.length; z++) {
        color_field(snake[z][0], snake[z][1], 'green');
    }
    color_field(snake[0][0], snake[0][1], 'darkgreen');
}

function start_game() {
    for(let i = 0; i < (fieldnumber-1)*(fieldnumber-1); i++) {
        gameframe.childNodes[i].style.backgroundColor = '';
    }
    apple = [1,1];
    snake = [ [1,4], [1,3], [1,2], [1,1] ];
    direction = 'right';

    snake.forEach(function(item, index, snake) {
        color_field(item[0], item[1], 'green');
    }) 
    color_field(snake[0][0], snake[0][1], 'darkgreen');
    
    newApple();

    runtime = setInterval(renderFrame, game_speed);
}