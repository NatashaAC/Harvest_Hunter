const canvas = document.getElementById('gameArea');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}

const gravity = 0.1;

const keys = {
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
}

const bg = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/image/background.png'
})

const floorCollisonBlocks = []
// console.log(floorCollisions);
// Parsing the floor collisons data
const floorCollisions2d = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2d.push(floorCollisions.slice(i, i + 36));
}
// console.log(floorCollisions2d);

floorCollisions2d.forEach((row, yIndex) => {
    row.forEach((symbol, xIndex) => {
        if (symbol === 202) {
            // console.log('create a block')
            floorCollisonBlocks.push(
                new CollisionBlock({
                    position: {
                        x: xIndex * 16,
                        y: yIndex * 16,
                    }
                })
            )
        }
    })
})
// console.log(floorCollisonBlocks)

const platformCollisionBlocks = []; 
// console.log(platformCollisions);
const platformCollisions2d = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2d.push(platformCollisions.slice(i, i + 36));
}
// console.log(platformCollisions2d);
platformCollisions2d.forEach((row, yIndex) => {
    row.forEach((symbol, xIndex) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: xIndex * 16,
                        y: yIndex * 16,
                    },
                    height: 4
                })
            )
        }
    })
})

const player = new Player({
    position: { 
        x: 100,
        y: 300,
    },
    floorCollisonBlocks: floorCollisonBlocks,
    platformCollisonBlocks: platformCollisionBlocks,
    imageSrc: './assets/image/hunter/Idle.png',
    frameRate: 8,
    animations: {
        idle: {
            imageSrc: './assets/image/hunter/Idle.png',
            frameRate: 8,
            frameBuffer: 12,
        },
        idleLeft: {
            imageSrc: './assets/image/hunter/Idle_Left.png',
            frameRate: 8,
            frameBuffer: 12,
        },
        run: {
            imageSrc: './assets/image/hunter/Run.png',
            frameRate: 8,
            frameBuffer: 10,
        },
        runLeft: {
            imageSrc: './assets/image/hunter/Run_left.png',
            frameRate: 8,
            frameBuffer: 10,
        },
        jump: {
            imageSrc: './assets/image/hunter/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        jumpLeft: {
            imageSrc: './assets/image/hunter/Jump_left.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        fall: {
            imageSrc: './assets/image/hunter/Fall.png',
            frameRate: 2,
            frameBuffer: 5,
        },
        fallLeft: {
            imageSrc: './assets/image/hunter/Fall_left.png',
            frameRate: 2,
            frameBuffer: 5,
        }
    }
});

const bgImgHeight = 432;

const camera = {
    position: {
        x: 0,
        y: -bgImgHeight + scaledCanvas.height,
    },
}

function playSound() {
    const jumpAudio = new Audio('./assets/audio/jump.mp3');

    jumpAudio.pause();
    jumpAudio.currentTime = 0;
    jumpAudio.play();
}

function animate() {
    window.requestAnimationFrame(animate);
    // console.log('working');

    ctx.fillStyle = '#B2B2B4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // scaling up background 
    ctx.scale(4, 4);
    ctx.translate(camera.position.x, camera.position.y);
    bg.update();

    // Renders the collison blocks for debugging
    // floorCollisonBlocks.forEach((floorBlock) => {
    //     floorBlock.update();
    // });
    // platformCollisionBlocks.forEach((platBlock) => {
    //     platBlock.update();
    // });

    player.update();
    // Moving player left and right with arrow keys, changing speed/velocity to 5px per frame
    player.velocity.x = 0;
    if (keys.ArrowRight.pressed) {
        player.swapSprite('run');
        player.velocity.x = 2;
        player.lastDirection = 'right';
        player.panCameraToLeft({canvas, camera});

    } else if (keys.ArrowLeft.pressed) {
        player.swapSprite('runLeft');
        player.velocity.x = -2;
        player.lastDirection = 'left';
        player.panCameraToRight({camera});

    } else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') {
            player.swapSprite('idle');
        } else {
            player.swapSprite('idleLeft');
        }
    }
    
    if (player.velocity.y < 0) {
        player.panCameraDown({camera});
        
        if (player.lastDirection === 'right') {
            player.swapSprite('jump');
        } else {
            player.swapSprite('jumpLeft');
        }

    } else if (player.velocity.y > 0) {
        player.panCameraUp({canvas, camera});
        if (player.lastDirection === 'right') {
            player.swapSprite('fall');
        } else {
            player.swapSprite('fallLeft');
        }
    }
    ctx.restore();
}

animate(); 

// Listening for when keys are pressed
window.addEventListener('keydown', (e) => {
    // console.log(e);

    switch (e.key) {
        case 'ArrowRight': 
            keys.ArrowRight.pressed = true
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            break;
        case 'ArrowUp':
            player.velocity.y = -4;
            playSound();
            break;
    }
});

// Listening when keys are released
window.addEventListener('keyup', (e) => {
    // console.log(e);

    switch (e.key) {
        case 'ArrowRight': 
            keys.ArrowRight.pressed = false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
    }
})