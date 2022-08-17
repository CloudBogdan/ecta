
/**
 * @author bogdanov
 * @export
 * @class Keyboard
 * @typedef {Keyboard}
 */
export class Keyboard {
    #keysPressed: {
        [key: string]: boolean
    } = {}
    #keysJustPressed: {
        [key: string]: boolean
    } = {}
    #keysJustUp: {
        [key: string]: boolean
    } = {}

    isAnyIsPressed: boolean = false;
    isAnyJustPressed: boolean = false;
    
    constructor() {

        addEventListener("keydown", e=> {
            if (!this.#keysJustPressed[formatKey(e.code)] && !this.#keysPressed[formatKey(e.code)])
                this.isAnyJustPressed = true;
            
            if (!this.#keysPressed[formatKey(e.code)])
                this.#keysJustPressed[formatKey(e.code)] = true;

            this.#keysPressed[formatKey(e.code)] = true;
        });
        addEventListener("keyup", e=> {
            delete this.#keysPressed[formatKey(e.code)];

            this.#keysJustUp[formatKey(e.code)] = true;
        });
    }

    update() {
        this.isAnyIsPressed = Object.keys(this.#keysPressed).length != 0;
    }
    updateAfter() {    
        this.isAnyJustPressed = false;

        this.#keysJustPressed = {};
        this.#keysJustUp = {};
    }

    /**
     * @param {string} code Can be used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    keyIsPressed(code: string): boolean {
        return this.#keysPressed[formatKey(code)];
    }
    /**
     * @param {string[]} [codes]
     * @returns {boolean}
     */
    anyKeyIsPressed(codes?: string[]): boolean {
        if (codes) {
            return codes.filter(code=> this.#keysPressed[formatKey(code)]).length > 0
        } else
            return this.isAnyIsPressed;
    }
    
    /**
     * @param {string} code Can used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    keyJustPressed(code: string): boolean {
        return this.#keysJustPressed[formatKey(code)] && this.#keysPressed[formatKey(code)];
    }
    /**
     * @param {string[]} [codes] 
     * @returns {boolean}
     */
    anyKeyJustPressed(codes?: string[]): boolean {
        if (codes) {
            return codes.filter(code=> this.#keysJustPressed[formatKey(code)]).length > 0 && codes.filter(code=> this.#keysPressed[formatKey(code)]).length > 0
        } else
            return this.isAnyJustPressed;
    }

    /**
     * @param {string} code Can used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    keyJustUp(code: string): boolean {
        return this.#keysJustUp[formatKey(code)];
    }
    /**
     * @param {string[]} [codes] 
     * @returns {boolean}
     */
    anyKeyJustUp(codes?: string[]): boolean {
        if (codes) {
            return codes.filter(code=> this.#keysJustUp[formatKey(code)]).length > 0;
        } else
            return this.isAnyJustPressed;
    }

    /**
     * @param {(e: KeyboardEvent)=> void} listener
     * @returns {()=> void} Remove listener function
     */
    onKeyPressed(listener: (e: KeyboardEvent)=> void): ()=> void {
        addEventListener("keydown", listener);
        return ()=> removeEventListener("keydown", listener);
    }
    /**
     * @param {(e: KeyboardEvent)=> void} listener
     * @returns {()=> void} Remove listener function
     */
    onKeyReleased(listener: (e: KeyboardEvent)=> void): ()=> void {
        addEventListener("keyup", listener);
        return ()=> removeEventListener("keyup", listener);
    }
}

function formatKey(key: string): string {
    return key.toLowerCase().replace(/key|digit|arrow/g, "")
}