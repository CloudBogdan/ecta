import { CustomGamepadButton, IPoint } from "../utils/types.js";
import { Keyboard } from "./Keyboard.js";
import { Art } from "./Art.js";


/**
 * @author bogdanov
 * @export
 * @class Gamepad
 * @typedef {Gamepad}
 */
export class Gamepad {
    #art: Art
    
    vanilla: globalThis.Gamepad | null = null;

    axisClamp: number = .2;

    #buttonsPressed: {
        [key: string]: boolean
    } = {}
    #buttonsJustPressed: {
        [key: string]: boolean
    } = {}
    
    constructor(monos: Art) {
        this.#art = monos;

        addEventListener("gamepadconnected", e=> {
            console.log("Monos: Gamepad connected!");
        });
        addEventListener("gamepaddisconnected", ()=> {
            console.log("Monos: Gamepad disconnected...");
            this.vanilla = null;
        });
    }
    
    update() {
        this.vanilla = navigator.getGamepads()[0] || navigator.getGamepads()[1] || navigator.getGamepads()[2] || navigator.getGamepads()[3] || null;

        this.#putButton(
            this.axes.x > 0 || this.buttons[15]?.pressed || this.#keyboard.anyKeyIsPressed(["d", "right"]),
            "right"
        )
        this.#putButton(
            this.axes.x < 0 || this.buttons[14]?.pressed || this.#keyboard.anyKeyIsPressed(["a", "left"]),
            "left"
        )
        this.#putButton(
            this.axes.y < 0 || this.buttons[12]?.pressed || this.#keyboard.anyKeyIsPressed(["w", "up"]),
            "up"
        )
        this.#putButton(
            this.axes.y > 0 || this.buttons[13]?.pressed || this.#keyboard.anyKeyIsPressed(["s", "down"]),
            "down"
        )

        this.#putButton(
            this.buttons[0]?.pressed || this.buttons[3]?.pressed || this.#keyboard.anyKeyIsPressed(["x", "k"]) || this.#art.mouse.buttonIsPressed(),
            "a"
        )
        this.#putButton(
            this.buttons[2]?.pressed || this.buttons[1]?.pressed || this.#keyboard.anyKeyIsPressed(["z", "l"]) || this.#art.mouse.buttonIsPressed(2),
            "b"
        )
    }
    updateAfter() {
        this.#buttonsJustPressed = {};
    }

    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    buttonIsPressed(button: CustomGamepadButton): boolean {
        return !!this.#buttonsPressed[button.toLowerCase()];
    }
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    buttonJustPressed(button: CustomGamepadButton): boolean {
        return !!this.#buttonsJustPressed[button.toLowerCase()] && !!this.#buttonsPressed[button.toLowerCase()];
    }
    
    //
    /**
     * @param {number} [duration]
     * @param {number} [strongMagnitude] 
     * @param {number} [weakMagnitude] 
     * @param {number} [startDelay]
     */
    vibration(duration: number=60, strongMagnitude: number=.3, weakMagnitude: number=.1, startDelay: number=0) {
        if (!this.vanilla) return;
        
        (this.vanilla as any).vibrationActuator.playEffect("dual-rumble", {
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
    get axes(): IPoint {
        if (this.vanilla) {
            let x = this.vanilla.axes[0];
            let y = this.vanilla.axes[1];
        
            return {
                x: (x < this.axisClamp && x > -this.axisClamp) ? 0 : x,
                y: (y < this.axisClamp && y > -this.axisClamp) ? 0 : y
            }
        }

        return { x: 0, y: 0 };
    }
    /**
     * @readonly
     * @type {(GamepadButton | undefined)[]}
     */
    get buttons(): (GamepadButton | undefined)[] {
        if (this.vanilla) {
            return [...this.vanilla.buttons];
        }

        return [];
    }

    // Private
    get #keyboard(): Keyboard {
        return this.#art.keyboard;
    }
    #putButton(allow: boolean, button: string) {
        if (allow) {
            if (!this.#buttonsPressed[button])
                this.#buttonsJustPressed[button] = true;
            this.#buttonsPressed[button] = true;
        } else
            delete this.#buttonsPressed[button];
    }
    
    //
    /**
     * @param {(e: GamepadEvent)=> void} listener
     * @returns {()=> void}
     */
    onGamepadConnected(listener: (e: GamepadEvent)=> void): ()=> void {
        addEventListener("gamepadconnected", listener);
        return ()=> removeEventListener("gamepadconnected", listener);
    }
    /**
     * @param {(e: GamepadEvent)=> void} listener
     * @returns {()=> void}
     */
    onGamepadDisconnected(listener: (e: GamepadEvent)=> void): ()=> void {
        addEventListener("gamepaddisconnected", listener);
        return ()=> removeEventListener("gamepaddisconnected", listener);
    }
}