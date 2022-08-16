import { IPoint, IRect, IShortRect } from "./types.js";

/**
 * @author bogdanov
 * @class Utils
 * @typedef {Utils}
 */
class Utils {
    /**
     * @param {[x: number, y: number, width: number, height: number]} a
     * @param {[x: number, y: number, width: number, height: number]} b
     * @returns {boolean}
     */
    overlap(a: IShortRect, b: IShortRect): boolean {
        const _a = this.#parseRect(a);
        const _b = this.#parseRect(b);
        
        return (
            _a.x + _a.width > _b.x &&
            _a.y + _a.height > _b.y &&
            _a.x < _b.x + _b.width &&
            _a.y < _b.y + _b.height
        );
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {IPoint}
     */
    normalize(x: number, y: number): IPoint {
        const a = Math.sqrt(x**2 + y**2);
        if (a != 0)
            return {
                x: x / a, y: y / a
            }
        else
            return { x: 0, y: 0 };
    }
    /**
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @returns {number}
     */
    distance(fromX: number, fromY: number, toX: number, toY: number): number {
        return Math.sqrt((fromX - toX) ** 2 + (fromY - toY) ** 2);
    }
    /**
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @returns {number}
     */
    distanceSquared(fromX: number, fromY: number, toX: number, toY: number): number {
        return (fromX - toX) ** 2 + (fromY - toY) ** 2;
    }
    /**
     * @param {number} from
     * @param {number} to
     * @param {number} speed
     * @returns {number}
     */
    lerp(from: number, to: number, speed: number): number {
        return from + (to - from) * speed;
    }
    /**
     * @param {number} [from=0]
     * @param {number} [to=1]
     * @returns {number}
     */
    random(from: number=0, to: number=1): number {
        return Math.random() * (to - from) + from;
    }
    /**
     * @param {number} [from=0]
     * @param {number} [to=1]
     * @returns {number}
     */
    randomInt(from: number=0, to: number=1): number {
        return Math.floor(this.random(from, to+1));
    }
    /**
     * @template T
     * @param {T[]} array
     * @returns {T}
     */
    randomItem<T>(array: T[]): T {
        return array[this.randomInt(0, array.length-1)];
    }
    /**
     * @param {number} change From 0 to 1 (0% - 100%)
     * @returns {boolean}
     */
    randomChange(change: number): boolean {
        return this.random() <= change;
    }
    /**
     * @param {number} x
     * @param {number} [frequency=1]
     * @param {number} [amplitude=1]
     * @returns {number}
     */
    sin(x: number, frequency: number=1, amplitude: number=1): number {
        return Math.sin(x * frequency) * amplitude
    }
    /**
     * @param {number} x
     * @param {number} [frequency=1]
     * @param {number} [amplitude=1]
     * @returns {number}
     */
    cos(x: number, frequency: number=1, amplitude: number=1): number {
        return Math.cos(x * frequency) * amplitude
    }

    /**
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    clamp(value: number, min: number, max: number): number {
        if (value < min)
            return min;
        else if (value > max)
            return max;
        else
            return value;
    }
    /**
     * Returns `safe` if `value` is `null` or `undefined`
     * 
     * @template T
     * @param {(T | undefined | null)} value
     * @param {T} safe
     * @returns {T}
     */
    safeValue<T>(value: T | undefined | null, safe: T): T {
        return (value === undefined || value === null) ? safe : value;
    }

    // Private
    #parseRect(shortRect: IShortRect): IRect {
        return { x: shortRect[0], y: shortRect[1], width: shortRect[2], height: shortRect[3] };
    }
}
export default new Utils();