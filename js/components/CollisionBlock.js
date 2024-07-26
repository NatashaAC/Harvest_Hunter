class CollisionBlock {
    constructor({position, height = 16}) {
        this.position = position
        this.width = 16
        this.height = height
    }

    draw() {
        ctx.fillStyle = 'rgba(185, 255, 183, 0.5)'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
    }
}