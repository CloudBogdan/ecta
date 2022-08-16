/**
 * Why not? :D
 *
 * @author bogdanov
 * @class Particle
 * @typedef {Particle}
 * @implements {IDrawableObject}
 */
class Particle {
    /**
     * @constructor
     * @param {number} x
     * @param {number} y
     * @param {number} [maxLifeTime=60]
     * @param {number} [velX=0]
     * @param {number} [velY=0]
     * @param {number} [size=8]
     * @param {string} [color="#fff"]
     */
    constructor(x, y, maxLifeTime = 60, velX = 0, velY = 0, size = 8, color = "#fff") {
        this.x = 0;
        this.y = 0;
        this.vel = { x: 0, y: 0 };
        this.velMultiplier = { x: .9, y: .9 };
        this.lifeTime = 0;
        this.x = x;
        this.y = y;
        this.vel.x = velX;
        this.vel.y = velY;
        this.size = size;
        this.color = color;
        this.maxLifeTime = maxLifeTime;
    }
    update(particles, index) {
        this.lifeTime++;
        this.vel.x *= this.velMultiplier.x;
        this.vel.y *= this.velMultiplier.y;
        this.x += this.vel.x;
        this.y += this.vel.y;
        if (this.lifeTime >= this.maxLifeTime)
            particles.splice(index, 1);
    }
    draw(art) {
        art.ellipse(Math.floor(this.x), Math.floor(this.y), Math.floor((this.size * (1 - this.lifeTime / this.maxLifeTime)) / 2), Math.floor((this.size * (1 - this.lifeTime / this.maxLifeTime)) / 2), this.color);
    }
}
export default Particle;
//# sourceMappingURL=Particle.js.map