class Player extends Sprite {
    constructor({position, scale = 0.5, floorCollisonBlocks, platformCollisonBlocks, imageSrc, frameRate, animations}) {
        super({imageSrc, frameRate, scale})
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1
        }
        this.floorCollisonBlocks = floorCollisonBlocks
        this.platformCollisonBlocks = platformCollisonBlocks
        this.hitBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }
        this.animations = animations
        this.lastDirection = 'right'

        for (let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;

        }

        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 200,
            height: 80,
        }
    }

    swapSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;

        this.currentFrame = 0;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameRate = this.animations[key].frameRate;
        // console.log(this.image);
    }

    update() {
        this.checkForHorizontalCanvasCollisions();
        this.updateFrames();
        this.updateHitBox();
        this.updateCameraBox();

        // Draw out camerabox
        // ctx.fillStyle = 'rgba(200, 155, 255, 0.3)';
        // ctx.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);

        // Draw out image
        // ctx.fillStyle = 'rgba(165, 155, 255, 0.5)';
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Draw out hitbox
        // ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        // ctx.fillRect(this.hitBox.position.x, this.hitBox.position.y, this.hitBox.width, this.hitBox.height);

        this.draw();
        this.position.x += this.velocity.x; // Changes player's horizontal position when right arrow key pressed
        this.updateHitBox();
        this.checkForHorizontalCollisions();
        this.addGravity();
        this.updateHitBox();
        this.checkForVerticalCollisions();
    }

    updateHitBox() {
        this.hitBox = {
            position: {
                x: this.position.x + 32,
                y: this.position.y + 28
            },
            width: 11,
            height: 21
        }
    }

    updateCameraBox() {
        this.cameraBox = {
            position: {
                x: this.position.x - 60,
                y: this.position.y
            },
            width: 200,
            height: 80,
        }
    }

    checkForHorizontalCanvasCollisions() {
        if (this.hitBox.position.x + this.hitBox.width + this.velocity.x >= canvas.height || this.hitBox.position.x + this.velocity.x <= 0 ) {
            this.velocity.x = 0;
        }
    }

    panCameraToLeft({canvas, camera}) {
        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;
        const scaledDownCanvasWidth = canvas.width / 4;

        if (cameraBoxRight >= 576) return;

        if (cameraBoxRight >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            // console.log('move left');
            camera.position.x -= this.velocity.x;
        }
    }

    panCameraToRight({camera}) {
        const cameraBoxleft = this.cameraBox.position.x;

        if (cameraBoxleft <= 0) return;

        if (cameraBoxleft <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
        }
    }

    panCameraDown({camera}) {
        if (this.cameraBox.position.y + this.velocity.y <= 0) return;

        if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y;
        }
    }

    panCameraUp({canvas, camera}) {
        const scaledDownCanvasHeight = canvas.height / 4;

        if (this.cameraBox.position.y + this.cameraBox.height + this.velocity.y >= 432) return;

        if (this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaledDownCanvasHeight) {
            camera.position.y -= this.velocity.y;
        }
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.floorCollisonBlocks.length; i++) {
            const floorCollisionBlock = this.floorCollisonBlocks[i];

            if (floorCollision({ obj1: this.hitBox, obj2: floorCollisionBlock,})) {
                // console.log('colide')
                if (this.velocity.x > 0) {
                    this.velocity.x = 0; 

                    const offset = this.hitBox.position.x - this.position.x + this.hitBox.width;

                    this.position.x = floorCollisionBlock.position.x - offset - 0.01;
                    break;
                }

                if (this.velocity.x < 0) {
                    this.velocity.x = 0; 

                    const offset = this.hitBox.position.x - this.position.x;

                    this.position.x = floorCollisionBlock.position.x + floorCollisionBlock.width - offset + 0.01;
                    break;
                }
            }
        }
    }

    addGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }

    checkForVerticalCollisions() {
        // Floor collision blocks
        for (let i = 0; i < this.floorCollisonBlocks.length; i++) {
            const floorCollisionBlock = this.floorCollisonBlocks[i];

            if (floorCollision({ obj1: this.hitBox, obj2: floorCollisionBlock,})) {
                // console.log('colide')
                if (this.velocity.y > 0) {
                    this.velocity.y = 0; 

                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;

                    this.position.y = floorCollisionBlock.position.y - offset - 0.01;
                    break;
                }

                if (this.velocity.y < 0) {
                    this.velocity.y = 0; 

                    const offset = this.hitBox.position.y - this.position.y;
                    
                    this.position.y = floorCollisionBlock.position.y + floorCollisionBlock.height - offset + 0.01;
                    break;
                }
            }
        }

        // Platform collision blocks
        for (let i = 0; i < this.platformCollisonBlocks.length; i++) {
            const platformCollisonBlock = this.platformCollisonBlocks[i];

            if (platformCollision({ obj1: this.hitBox, obj2: platformCollisonBlock,})) {
                // console.log('colide')
                if (this.velocity.y > 0) {
                    this.velocity.y = 0; 

                    const offset = this.hitBox.position.y - this.position.y + this.hitBox.height;

                    this.position.y = platformCollisonBlock.position.y - offset - 0.01;
                    break;
                }
            }
        }
    }
}