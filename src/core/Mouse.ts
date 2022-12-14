import { IPoint } from "../utils/types";
import { Art } from "./Art"

/**
 * @author bogdanov
 * @export
 * @class Mouse
 * @typedef {Mouse}
 */
export class Mouse {
    x: number = 0
    y: number = 0
    start: IPoint = { x: 0, y: 0 }
    last: IPoint = { x: 0, y: 0 }
    movement: IPoint = { x: 0, y: 0 }
    
    isPressed: boolean = false;
    justPressed: boolean = false;
    justReleased: boolean = false;
    buttonPressed: number = 0;

    isInCanvas: boolean = false;
    
    constructor(art: Art) {
        addEventListener("pointerdown", e=> {
            e.preventDefault();
            
            const pos = getCanvasPos(e.clientX, e.clientY);
            this.start.x = pos.x;
            this.start.y = pos.y;

            this.isPressed = true;
            this.justPressed = true;
            this.buttonPressed = e.button;
        })
        addEventListener("pointerup", e=> {
            e.preventDefault();
            
            this.isPressed = false;
            this.justReleased = true;
        })

        addEventListener("pointermove", e=> {
            e.preventDefault();
            
            const pos = getCanvasPos(e.clientX, e.clientY);
            this.x = pos.x;
            this.y = pos.y;

            this.movement.x = this.x - this.last.x;
            this.movement.y = this.y - this.last.y;

            this.isInCanvas = this.x >= 0 && this.x < art.width && this.y >= 0 && this.y < art.height;
        })
        art.canvas.addEventListener("contextmenu", e=> {
            e.preventDefault();
        })
        
        function getCanvasPos(clientX: number, clientY: number): IPoint {
            const bounds = art.canvas.getBoundingClientRect();
            
            return {
                x: ((clientX - bounds.left + .5) / (bounds.width / art.width)),
                y: ((clientY - bounds.top + .5) / (bounds.height / art.height))
            }
        }
    }

    updateAfter() {
        this.justPressed = false;
        this.justReleased = false;
        this.last.x = this.x;
        this.last.y = this.y;
    }

    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    buttonIsPressed(button: number=0): boolean {
        return this.isPressed && this.buttonPressed == button;
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    buttonJustPressed(button: number=0): boolean {
        return this.justPressed && this.buttonPressed == button;
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    buttonJustReleased(button: number=0): boolean {
        return this.justReleased && this.buttonPressed == button;
    }

    /**
     * @param {(e: MouseEvent)=>void} listener
     * @returns {()=> void} Remove listener function
     */
    onMove(listener: (e: MouseEvent)=> void): ()=> void {
        addEventListener("pointermove", listener);
        return ()=> removeEventListener("pointermove", listener);
    }
    /**
     * @param {(e: MouseEvent)=>void} listener
     * @returns {()=> void} Remove listener function
     */
    onPress(listener: (mouse: MouseEvent)=> void): ()=> void {
        addEventListener("pointerdown", listener);
        return ()=> removeEventListener("pointerdown", listener);
    }
    /**
     * @param {(e: MouseEvent)=>void} listener
     * @returns {()=> void} Remove listener function
     */
    onReleased(listener: (mouse: MouseEvent)=> void): ()=> void {
        addEventListener("pointerup", listener);
        return ()=> removeEventListener("pointerup", listener);
    }
}