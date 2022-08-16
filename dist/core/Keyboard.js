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
var _Keyboard_keysPressed, _Keyboard_keysJustPressed;
/**
 * @author bogdanov
 * @export
 * @class Keyboard
 * @typedef {Keyboard}
 */
export class Keyboard {
    constructor() {
        _Keyboard_keysPressed.set(this, {});
        _Keyboard_keysJustPressed.set(this, {});
        this.isAnyIsPressed = false;
        this.isAnyJustPressed = false;
        addEventListener("keydown", e => {
            if (!__classPrivateFieldGet(this, _Keyboard_keysJustPressed, "f")[formatKey(e.code)] && !__classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(e.code)])
                this.isAnyJustPressed = true;
            if (!__classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(e.code)])
                __classPrivateFieldGet(this, _Keyboard_keysJustPressed, "f")[formatKey(e.code)] = true;
            __classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(e.code)] = true;
        });
        addEventListener("keyup", e => {
            delete __classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(e.code)];
        });
    }
    update() {
        this.isAnyIsPressed = Object.keys(__classPrivateFieldGet(this, _Keyboard_keysPressed, "f")).length != 0;
    }
    updateAfter() {
        this.isAnyJustPressed = false;
        __classPrivateFieldSet(this, _Keyboard_keysJustPressed, {}, "f");
    }
    /**
     * @param {string} code Can be used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    keyIsPressed(code) {
        return __classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(code)];
    }
    /**
     * @param {string[]} [codes]
     * @returns {boolean}
     */
    anyKeyIsPressed(codes) {
        if (codes) {
            return codes.filter(code => __classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(code)]).length > 0;
        }
        else
            return this.isAnyIsPressed;
    }
    /**
     * @param {string} code Can used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    keyJustPressed(code) {
        return __classPrivateFieldGet(this, _Keyboard_keysJustPressed, "f")[formatKey(code)] && __classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(code)];
    }
    /**
     * @param {string[]} [codes]
     * @returns {boolean}
     */
    anyKeyJustPressed(codes) {
        if (codes) {
            return codes.filter(code => __classPrivateFieldGet(this, _Keyboard_keysJustPressed, "f")[formatKey(code)]).length > 0 && codes.filter(code => __classPrivateFieldGet(this, _Keyboard_keysPressed, "f")[formatKey(code)]).length > 0;
        }
        else
            return this.isAnyJustPressed;
    }
}
_Keyboard_keysPressed = new WeakMap(), _Keyboard_keysJustPressed = new WeakMap();
function formatKey(key) {
    return key.toLowerCase().replace(/key|digit|arrow/g, "");
}
//# sourceMappingURL=Keyboard.js.map