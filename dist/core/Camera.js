var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Camera_x, _Camera_y, _Camera_shaking;
import Utils from "../utils/Utils.js";
/**
 * @author bogdanov
 * @class Camera
 * @typedef {Camera}
 */
class Camera {
    constructor() {
        _Camera_x.set(this, 0);
        _Camera_y.set(this, 0);
        _Camera_shaking.set(this, {
            active: false,
            frequency: 0,
            time: 0,
            offsetX: 0,
            offsetY: 0
        });
    }
    /**
     * Sets camera position
     * @param {number} x
     * @param {number} y
     */
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    /**
     * @param {number} [duration=.2] Duration in seconds
     * @param {number} [frequency=1]
     */
    shake(duration = .2, frequency = 1) {
        __classPrivateFieldGet(this, _Camera_shaking, "f").time = duration * 60;
        __classPrivateFieldGet(this, _Camera_shaking, "f").frequency = frequency;
    }
    update() {
        if (__classPrivateFieldGet(this, _Camera_shaking, "f").time > 0) {
            __classPrivateFieldGet(this, _Camera_shaking, "f").time--;
            __classPrivateFieldGet(this, _Camera_shaking, "f").active = true;
            __classPrivateFieldGet(this, _Camera_shaking, "f").offsetX = Math.ceil(Utils.random(-__classPrivateFieldGet(this, _Camera_shaking, "f").frequency, __classPrivateFieldGet(this, _Camera_shaking, "f").frequency));
            __classPrivateFieldGet(this, _Camera_shaking, "f").offsetY = Math.ceil(Utils.random(-__classPrivateFieldGet(this, _Camera_shaking, "f").frequency, __classPrivateFieldGet(this, _Camera_shaking, "f").frequency));
        }
        else {
            __classPrivateFieldGet(this, _Camera_shaking, "f").active = false;
            __classPrivateFieldGet(this, _Camera_shaking, "f").offsetX = 0;
            __classPrivateFieldGet(this, _Camera_shaking, "f").offsetY = 0;
        }
    }
    // Get
    set x(value) {
        __classPrivateFieldSet(this, _Camera_x, value, "f");
    }
    set y(value) {
        __classPrivateFieldSet(this, _Camera_y, value, "f");
    }
    get x() {
        return __classPrivateFieldGet(this, _Camera_x, "f") + __classPrivateFieldGet(this, _Camera_shaking, "f").offsetX;
    }
    get y() {
        return __classPrivateFieldGet(this, _Camera_y, "f") + __classPrivateFieldGet(this, _Camera_shaking, "f").offsetY;
    }
}
_Camera_x = new WeakMap(), _Camera_y = new WeakMap(), _Camera_shaking = new WeakMap();
export default Camera;
//# sourceMappingURL=Camera.js.map