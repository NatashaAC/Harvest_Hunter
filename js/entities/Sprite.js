class Sprite {
    constructor({position, scale = 1, imageSrc, frameRate = 1, frameBuffer = 3}) {
        this.position = position
        this.scale = scale
        this.loaded = false
        this.image = new Image()
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale
            this.height = this.image.height * this.scale
            this.loaded = true
        }
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapsedFrames = 0
    }

    // Draws out the sprite
    draw() {
        if (!this.image) return;

        // Creates crop box
        const cropBox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }
        ctx.drawImage(
            this.image, 
            cropBox.position.x, 
            cropBox.position.y, 
            cropBox.width, 
            cropBox.height, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        )
    }

    // Updating sprite
    update() {
        this.draw();
        this.updateFrames();
    }

    // Updating frames for sprite
    updateFrames() {
        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }
}