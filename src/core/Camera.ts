import Utils from "../utils/Utils.js"


/**
 * @author bogdanov
 * @class Camera
 * @typedef {Camera}
 */
class Camera {
    #x: number = 0
    #y: number = 0

    #shaking: {
        active: boolean
        frequency: number
        time: number
        offsetX: number
        offsetY: number
    } = {
        active: false,
        frequency: 0,
        time: 0,
        offsetX: 0,
        offsetY: 0
    }
    
    constructor() {

    }
    
    /**
     * Sets camera position
     * @param {number} x 
     * @param {number} y 
     */
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    /**
     * @param {number} x 
     * @param {number} y 
     */
    move(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    
    /**
     * @param {number} [duration=.2] Duration in seconds
     * @param {number} [frequency=1]
     */
    shake(duration: number=.2, frequency: number=1,) {
        this.#shaking.time = duration*60;
        this.#shaking.frequency = frequency;
    }
    update() {
        if (this.#shaking.time > 0) {
            this.#shaking.time --;
            this.#shaking.active = true;

            this.#shaking.offsetX = Math.ceil(Utils.random(-this.#shaking.frequency, this.#shaking.frequency));
            this.#shaking.offsetY = Math.ceil(Utils.random(-this.#shaking.frequency, this.#shaking.frequency));
        } else {
            this.#shaking.active = false;
            this.#shaking.offsetX = 0;
            this.#shaking.offsetY = 0;
        }
        
    }

    // Get
    set x(value: number) {
        this.#x = value;
    }
    set y(value: number) {
        this.#y = value;
    }
    get x(): number {
        return this.#x + this.#shaking.offsetX;
    }
    get y(): number {
        return this.#y + this.#shaking.offsetY;
    }
}
export default Camera;