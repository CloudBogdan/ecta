/**
 * @author bogdanov
 * @export
 * @class Mouse
 * @typedef {Mouse}
 */
export class Mouse {
    constructor(art) {
        this.x = 0;
        this.y = 0;
        this.start = { x: 0, y: 0 };
        this.last = { x: 0, y: 0 };
        this.movement = { x: 0, y: 0 };
        this.isPressed = false;
        this.justPressed = false;
        this.buttonPressed = 0;
        this.isInCanvas = false;
        addEventListener("pointerdown", e => {
            e.preventDefault();
            const pos = getCanvasPos(e.clientX, e.clientY);
            this.start.x = pos.x;
            this.start.y = pos.y;
            this.isPressed = true;
            this.justPressed = true;
            this.buttonPressed = e.button;
        });
        addEventListener("pointerup", e => {
            e.preventDefault();
            this.isPressed = false;
        });
        addEventListener("pointermove", e => {
            e.preventDefault();
            const pos = getCanvasPos(e.clientX, e.clientY);
            this.x = pos.x;
            this.y = pos.y;
            this.movement.x = this.x - this.last.x;
            this.movement.y = this.y - this.last.y;
            this.isInCanvas = this.x >= 0 && this.x < art.width && this.y >= 0 && this.y < art.height;
        });
        addEventListener("contextmenu", e => {
            e.preventDefault();
        });
        function getCanvasPos(clientX, clientY) {
            const bounds = art.canvas.getBoundingClientRect();
            return {
                x: Math.floor((clientX - bounds.left + .5) / (bounds.width / art.width)),
                y: Math.floor((clientY - bounds.top + .5) / (bounds.height / art.height))
            };
        }
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    buttonIsPressed(button = 0) {
        return this.isPressed && this.buttonPressed == button;
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    buttonJustPressed(button = 0) {
        return this.justPressed && this.buttonPressed == button;
    }
    /**
     * @param {(e: MouseEvent)=>void} listener
     * @returns {()=> void} Remove listener
     */
    onMove(listener) {
        addEventListener("pointermove", listener);
        return () => removeEventListener("pointermove", listener);
    }
    /**
     * @param {(e: MouseEvent)=>void} listener
     * @returns {()=> void} Remove listener
     */
    onPress(listener) {
        addEventListener("pointerdown", listener);
        return () => removeEventListener("pointerdown", listener);
    }
}
//# sourceMappingURL=Mouse.js.map