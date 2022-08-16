import { Art } from "../core/Art.js";
import { IDrawableObject, IPoint } from "../utils/types.js"

/**
 * Why not? :D
 * 
 * @author bogdanov
 * @class Particle
 * @typedef {Particle}
 * @implements {IDrawableObject}
 */
class Particle implements IDrawableObject {
    x: number=0
    y: number=0
    vel: IPoint = { x: 0, y: 0 }
    size: number
    color: string
    velMultiplier: IPoint = { x: .9, y: .9 };
    maxLifeTime: number
    lifeTime: number = 0;
    
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
    constructor(x: number, y: number, maxLifeTime: number=60, velX: number=0, velY: number=0, size: number=8, color: string="#fff") {
        this.x = x;
        this.y = y;
        this.vel.x = velX;
        this.vel.y = velY;
        this.size = size;
        this.color = color;
        this.maxLifeTime = maxLifeTime;
    }

    update(particles: Particle[], index: number) {
        this.lifeTime ++;
        
        this.vel.x *= this.velMultiplier.x;
        this.vel.y *= this.velMultiplier.y;
        
        this.x += this.vel.x;
        this.y += this.vel.y;

        if (this.lifeTime >= this.maxLifeTime)
            particles.splice(index, 1);
    }
    draw(art: Art) {
        art.ellipse(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor((this.size * (1 - this.lifeTime / this.maxLifeTime))/2),
            Math.floor((this.size * (1 - this.lifeTime / this.maxLifeTime))/2),
            this.color
        );
    }
}
export default Particle;