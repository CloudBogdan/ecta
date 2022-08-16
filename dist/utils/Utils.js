var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Utils_instances, _Utils_parseRect;
/**
 * @author bogdanov
 * @class Utils
 * @typedef {Utils}
 */
class Utils {
    constructor() {
        _Utils_instances.add(this);
    }
    /**
     * @param {[x: number, y: number, width: number, height: number]} a
     * @param {[x: number, y: number, width: number, height: number]} b
     * @returns {boolean}
     */
    overlap(a, b) {
        const _a = __classPrivateFieldGet(this, _Utils_instances, "m", _Utils_parseRect).call(this, a);
        const _b = __classPrivateFieldGet(this, _Utils_instances, "m", _Utils_parseRect).call(this, b);
        return (_a.x + _a.width > _b.x &&
            _a.y + _a.height > _b.y &&
            _a.x < _b.x + _b.width &&
            _a.y < _b.y + _b.height);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {IPoint}
     */
    normalize(x, y) {
        const a = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if (a != 0)
            return {
                x: x / a, y: y / a
            };
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
    distance(fromX, fromY, toX, toY) {
        return Math.sqrt(Math.pow((fromX - toX), 2) + Math.pow((fromY - toY), 2));
    }
    /**
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @returns {number}
     */
    distanceSquared(fromX, fromY, toX, toY) {
        return Math.pow((fromX - toX), 2) + Math.pow((fromY - toY), 2);
    }
    /**
     * @param {number} from
     * @param {number} to
     * @param {number} speed
     * @returns {number}
     */
    lerp(from, to, speed) {
        return from + (to - from) * speed;
    }
    /**
     * @param {number} [from=0]
     * @param {number} [to=1]
     * @returns {number}
     */
    random(from = 0, to = 1) {
        return Math.random() * (to - from) + from;
    }
    /**
     * @param {number} [from=0]
     * @param {number} [to=1]
     * @returns {number}
     */
    randomInt(from = 0, to = 1) {
        return Math.floor(this.random(from, to + 1));
    }
    /**
     * @template T
     * @param {T[]} array
     * @returns {T}
     */
    randomItem(array) {
        return array[this.randomInt(0, array.length - 1)];
    }
    /**
     * @param {number} change From 0 to 1 (0% - 100%)
     * @returns {boolean}
     */
    randomChange(change) {
        return this.random() <= change;
    }
    /**
     * @param {number} x
     * @param {number} [frequency=1]
     * @param {number} [amplitude=1]
     * @returns {number}
     */
    sin(x, frequency = 1, amplitude = 1) {
        return Math.sin(x * frequency) * amplitude;
    }
    /**
     * @param {number} x
     * @param {number} [frequency=1]
     * @param {number} [amplitude=1]
     * @returns {number}
     */
    cos(x, frequency = 1, amplitude = 1) {
        return Math.cos(x * frequency) * amplitude;
    }
    /**
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    clamp(value, min, max) {
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
    safeValue(value, safe) {
        return (value === undefined || value === null) ? safe : value;
    }
}
_Utils_instances = new WeakSet(), _Utils_parseRect = function _Utils_parseRect(shortRect) {
    return { x: shortRect[0], y: shortRect[1], width: shortRect[2], height: shortRect[3] };
};
export default new Utils();
//# sourceMappingURL=Utils.js.map