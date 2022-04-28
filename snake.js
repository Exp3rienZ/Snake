let gameframe = document.getElementById('gameframe');
let scoreCounter = document.getElementById('score');
let speedInput = document.getElementById('speed');
let sizeInput = document.getElementById('size');
let speedLabel = document.getElementById('speedLabel');
let sizeLabel = document.getElementById('sizeLabel');
let highscores = document.getElementById('highscores');
let highscoreSettings = document.getElementById('highscoreSettings');

let runtime;
let highscoreDataSets = [];
let highscoresLoaded = false;

let fieldnumber = 15;
let game_speed = 280;
let walkableWalls = true;
let selectedColor = 'green';

class highscoreSet {
    constructor(speed, size, walkableWalls) {
        this.speed = speed;
        this.size = size;
        this.walkableWalls = walkableWalls;
        this.data = [0];
        for(let n = 0; n < 10; n++) {
            this.data.push(0);
        }
    }

    getScore(n) {
        return this.data[n];
    }
}

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

for(let i = 1; i <= 10; i++) {
    highscores.innerHTML += '<div class="highscoreElement"></div>';
}

let fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', () => {
    let file = fileInput.files[0];
    let reader = new FileReader();
    let json_string = '';    
    reader.readAsText(file, 'utf8');
    reader.onload = function() {
        json_string = reader.result;
        highscoreDataSets = JSON.parse(reader.result);
        highscoresLoaded = true;
        alert('Highscoredaten geladen');
        let blob = new Blob([json_string], {type: 'text/plain'});
        let downloadLink = document.getElementById('downloadlink');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.style.display = 'block';
        loadHighscores();
    }
});

changeHighScoreSettings('5', '15' , 'true');

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
    changeHighScoreSettings((game_speed-530)/-50, input, walkableWalls);
    if(highscoresLoaded) {
        loadHighscores();
    }
}

function changeSpeed(input) {
    speedLabel.innerHTML = 'Speed: ' + input;
    game_speed = 530 - (input * 50);
    changeHighScoreSettings(input, fieldnumber, walkableWalls);
    if(highscoresLoaded) {
        loadHighscores();
    }
}

function color_field(x, y, color) {
    getField(x,y).style.backgroundColor = color;
}

function changeWalls() {
    walkableWalls = !walkableWalls;
    changeHighScoreSettings((game_speed-530)/-50, fieldnumber, walkableWalls);
    if(highscoresLoaded) {
        loadHighscores();
    }
}

function changeHighScoreSettings(speed, size, walkableWalls) {
    highscoreSettings = document.getElementById('highscoreSettings');
    highscoreSettings.innerHTML = '<div class="settHigh">Speed: ' + speed + ', Size: ' + size + ', WalkableWalls: ' + walkableWalls + '</div>';
    if(highscoresLoaded == true) {
        getCurrentHighscores();
    }
}

function changeHighscoreFile(input) {
    let file = input.file;
    console.log(file);
}

function getCurrentHighscores() {
    if(walkableWalls == true) {
        return highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2 + 1].data;
    } else {
        return highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2].data;
    }
}

function addRunToHighscores(score) {
    if(walkableWalls == true) {
        highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2 + 1].data.push(score);
        highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2 + 1].data.sort(function(a,b) {
            return b-a;
        });
        highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2 + 1].data.pop();
    } else {
        highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2].data.push(score);
        highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2].data.sort(function(a,b) {
            return b-a;
        });
        highscoreDataSets[((game_speed-530)/-50)*42 + (fieldnumber-10) * 2].data.pop();
    }
    loadHighscores();
    updateScoreDownload();
}

function updateScoreDownload() {
    let json_string = JSON.stringify(highscoreDataSets);
    let blob = new Blob([json_string], {type: 'text/plain'});
    let downloadLink = document.getElementById('downloadlink');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.style.display = 'block';
}

function loadHighscores() {
    let currentHighscores = getCurrentHighscores();
    let highscoreElements = document.querySelectorAll('.highscoreElement');
    for(let n = 0; n < 10; n++) {
        highscoreElements[n].innerHTML = n+1 + ': &nbsp;' + currentHighscores[n];
    }
}

function changeColor(input) {
    selectedColor = input;
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
            if(highscoresLoaded) {
                addRunToHighscores(parseInt(scoreCounter.innerHTML));
            }
            return;
        }
    }
    if(next_x < 1) {
        if(walkableWalls == true) {
            next_x = fieldnumber - 1;
        } else {
            clearInterval(runtime);
            alert('Game Over');
            if(highscoresLoaded) {
                addRunToHighscores(parseInt(scoreCounter.innerHTML));
            }
            return;
        }
    }
    if(next_y > fieldnumber - 1) {
        if(walkableWalls == true) {
            next_y = 1;
        } else {
            clearInterval(runtime);
            alert('Game Over');
            if(highscoresLoaded) {
                addRunToHighscores(parseInt(scoreCounter.innerHTML));
            }
            return;
        }
    }
    if(next_y < 1) {
        if(walkableWalls == true) {
            next_y = fieldnumber - 1;
        } else {
            clearInterval(runtime);
            if(highscoresLoaded) {
                addRunToHighscores(parseInt(scoreCounter.innerHTML));
            }
            alert('Game Over');
            return;
        }
    }

    //Game-Over-Detection:
    for(let k = 0; k < snake.length; k++) {
        if(snake[k][0] == next_y && snake[k][1] == next_x) {
            clearInterval(runtime);
            if(highscoresLoaded) {
                addRunToHighscores(parseInt(scoreCounter.innerHTML));
            }
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
        color_field(snake[z][0], snake[z][1], selectedColor);
    }
    let headOfSnake = getField(snake[0][1], snake[0][0]);
    headOfSnake.style.filter = 'brightness(80%)';
    let fieldAfterHead = getField(snake[1][1], snake[1][0]);
    fieldAfterHead.style.filter = 'brightness(100%)';
}

function start_game() {
    clearInterval(runtime);
    scoreCounter.innerHTML = '0';
    for(let i = 0; i < (fieldnumber-1)*(fieldnumber-1); i++) {
        gameframe.childNodes[i].style.backgroundColor = '';
    }
    apple = [1,1];
    snake = [ [1,4], [1,3], [1,2], [1,1] ];
    direction = 'right';

    snake.forEach(function(item, index, snake) {
        color_field(item[0], item[1], selectedColor);
    }) 
    let headOfSnake = getField(snake[0][1], snake[0][0]);
    headOfSnake.style.filter = 'brightness(120%)';
    
    newApple();

    runtime = setInterval(renderFrame, game_speed);
}