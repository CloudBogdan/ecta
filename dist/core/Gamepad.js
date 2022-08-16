var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Gamepad_instances, _Gamepad_art, _Gamepad_buttonsPressed, _Gamepad_buttonsJustPressed, _Gamepad_keyboard_get, _Gamepad_putButton;
/**
 * @author bogdanov
 * @export
 * @class Gamepad
 * @typedef {Gamepad}
 */
export class Gamepad {
    constructor(monos) {
        _Gamepad_instances.add(this);
        _Gamepad_art.set(this, void 0);
        this.vanilla = null;
        this.axisClamp = .2;
        _Gamepad_buttonsPressed.set(this, {});
        _Gamepad_buttonsJustPressed.set(this, {});
        __classPrivateFieldSet(this, _Gamepad_art, monos, "f");
        addEventListener("gamepadconnected", e => {
            console.log("Monos: Gamepad connected!");
        });
        addEventListener("gamepaddisconnected", () => {
            console.log("Monos: Gamepad disconnected...");
            this.vanilla = null;
        });
    }
    update() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.vanilla = navigator.getGamepads()[0] || navigator.getGamepads()[1] || navigator.getGamepads()[2] || navigator.getGamepads()[3] || null;
        __classPrivateFieldGet(this, _Gamepad_instances, "m", _Gamepad_putButton).call(this, this.axes.x > 0 || ((_a = this.buttons[15]) === null || _a === void 0 ? void 0 : _a.pressed) || __classPrivateFieldGet(this, _Gamepad_instances, "a", _Gamepad_keyboard_get).anyKeyIsPressed(["d", "right"]), "right");
        __classPrivateFieldGet(this, _Gamepad_instances, "m", _Gamepad_putButton).call(this, this.axes.x < 0 || ((_b = this.buttons[14]) === null || _b === void 0 ? void 0 : _b.pressed) || __classPrivateFieldGet(this, _Gamepad_instances, "a", _Gamepad_keyboard_get).anyKeyIsPressed(["a", "left"]), "left");
        __classPrivateFieldGet(this, _Gamepad_instances, "m", _Gamepad_putButton).call(this, this.axes.y < 0 || ((_c = this.buttons[12]) === null || _c === void 0 ? void 0 : _c.pressed) || __classPrivateFieldGet(this, _Gamepad_instances, "a", _Gamepad_keyboard_get).anyKeyIsPressed(["w", "up"]), "up");
        __classPrivateFieldGet(this, _Gamepad_instances, "m", _Gamepad_putButton).call(this, this.axes.y > 0 || ((_d = this.buttons[13]) === null || _d === void 0 ? void 0 : _d.pressed) || __classPrivateFieldGet(this, _Gamepad_instances, "a", _Gamepad_keyboard_get).anyKeyIsPressed(["s", "down"]), "down");
        __classPrivateFieldGet(this, _Gamepad_instances, "m", _Gamepad_putButton).call(this, ((_e = this.buttons[0]) === null || _e === void 0 ? void 0 : _e.pressed) || ((_f = this.buttons[3]) === null || _f === void 0 ? void 0 : _f.pressed) || __classPrivateFieldGet(this, _Gamepad_instances, "a", _Gamepad_keyboard_get).anyKeyIsPressed(["x", "k"]) || __classPrivateFieldGet(this, _Gamepad_art, "f").mouse.buttonIsPressed(), "a");
        __classPrivateFieldGet(this, _Gamepad_instances, "m", _Gamepad_putButton).call(this, ((_g = this.buttons[2]) === null || _g === void 0 ? void 0 : _g.pressed) || ((_h = this.buttons[1]) === null || _h === void 0 ? void 0 : _h.pressed) || __classPrivateFieldGet(this, _Gamepad_instances, "a", _Gamepad_keyboard_get).anyKeyIsPressed(["z", "l"]) || __classPrivateFieldGet(this, _Gamepad_art, "f").mouse.buttonIsPressed(2), "b");
    }
    updateAfter() {
        __classPrivateFieldSet(this, _Gamepad_buttonsJustPressed, {}, "f");
    }
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    buttonIsPressed(button) {
        return !!__classPrivateFieldGet(this, _Gamepad_buttonsPressed, "f")[button.toLowerCase()];
    }
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    buttonJustPressed(button) {
        return !!__classPrivateFieldGet(this, _Gamepad_buttonsJustPressed, "f")[button.toLowerCase()] && !!__classPrivateFieldGet(this, _Gamepad_buttonsPressed, "f")[button.toLowerCase()];
    }
    //
    /**
     * @param {number} [duration]
     * @param {number} [strongMagnitude]
     * @param {number} [weakMagnitude]
     * @param {number} [startDelay]
     */
    vibration(duration = 60, strongMagnitude = .3, weakMagnitude = .1, startDelay = 0) {
        if (!this.vanilla)
            return;
        this.vanilla.vibrationActuator.playEffect("dual-rumble", {
            startDelay,
            duration,
            weakMagnitude,
            strongMagnitude
        });
    }
    /**
     * @readonly
     * @type {IPoint}
     */
    get axes() {
        if (this.vanilla) {
            let x = this.vanilla.axes[0];
            let y = this.vanilla.axes[1];
            return {
                x: (x < this.axisClamp && x > -this.axisClamp) ? 0 : x,
                y: (y < this.axisClamp && y > -this.axisClamp) ? 0 : y
            };
        }
        return { x: 0, y: 0 };
    }
    /**
     * @readonly
     * @type {(GamepadButton | undefined)[]}
     */
    get buttons() {
        if (this.vanilla) {
            return [...this.vanilla.buttons];
        }
        return [];
    }
    //
    /**
     * @param {(e: GamepadEvent)=> void} listener
     * @returns {()=> void}
     */
    onGamepadConnected(listener) {
        addEventListener("gamepadconnected", listener);
        return () => removeEventListener("gamepadconnected", listener);
    }
    /**
     * @param {(e: GamepadEvent)=> void} listener
     * @returns {()=> void}
     */
    onGamepadDisconnected(listener) {
        addEventListener("gamepaddisconnected", listener);
        return () => removeEventListener("gamepaddisconnected", listener);
    }
}
_Gamepad_art = new WeakMap(), _Gamepad_buttonsPressed = new WeakMap(), _Gamepad_buttonsJustPressed = new WeakMap(), _Gamepad_instances = new WeakSet(), _Gamepad_keyboard_get = function _Gamepad_keyboard_get() {
    return __classPrivateFieldGet(this, _Gamepad_art, "f").keyboard;
}, _Gamepad_putButton = function _Gamepad_putButton(allow, button) {
    if (allow) {
        if (!__classPrivateFieldGet(this, _Gamepad_buttonsPressed, "f")[button])
            __classPrivateFieldGet(this, _Gamepad_buttonsJustPressed, "f")[button] = true;
        __classPrivateFieldGet(this, _Gamepad_buttonsPressed, "f")[button] = true;
    }
    else
        delete __classPrivateFieldGet(this, _Gamepad_buttonsPressed, "f")[button];
};
//# sourceMappingURL=Gamepad.js.map