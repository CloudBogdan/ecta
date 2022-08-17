import Particle from "../components/Particle.js";
import Algorithms from "../utils/Algorithms.js";
import config from "../utils/config.js";
import { CustomGamepadButton, IDrawableObject, IPoint, ITilemap, RGBA } from "../utils/types.js";
import Utils from "../utils/Utils.js";
import Camera from "./Camera.js";
import { Gamepad } from "./Gamepad.js";
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";

export interface IEctaPalette {
    [key: string]: string
}
export interface IEctaSpritePattern {
    [key: string]: number
}
export interface IEctaFontPattern {
    [key: string]: {
        width: number
        offsetX?: number
        offsetY?: number
        margin?: number
    }
}
export interface IEctaClock {
    time: number
    fps: number
    delta: number
}
export interface IEctaSpriteSheet {
    image: HTMLImageElement
    width: number
    height: number
    loaded: boolean
}
export interface IEctaFontSheet {
    image: HTMLImageElement
    loaded: boolean
}

/**
 * @author bogdanov
 * @export
 * @class Art
 * @typedef {Art}
 */
export class Art {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D

    started: boolean = false
    clock: IEctaClock
    
    palette: IEctaPalette

    spritePattern: IEctaSpritePattern
    #spriteSheet: IEctaSpriteSheet
    
    fontMapping: string
    fontPattern: IEctaFontPattern
    #font: IEctaFontSheet

    mouse: Mouse
    keyboard: Keyboard
    gamepad: Gamepad
    camera: Camera

    particles: IDrawableObject[]

    settings: {
        width: number
        height: number
    }
    drawing: {
        pixelPerfect: boolean
        cameraFactor: IPoint
        monospace: boolean
    }

    prestart: ()=> void = ()=> {}
    start: ()=> void = ()=> {}
    update: ()=> void = ()=> {}
    draw: ()=> void = ()=> {}
    
    constructor(settings?: Partial<Art["settings"]>) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;

        this.canvas.classList.add("monos-canvas");
        this.canvas.style.imageRendering = "pixelated";
        this.context.imageSmoothingEnabled = false;
        this.context.imageSmoothingQuality = "low";

        this.clock = {
            time: 0,
            fps: 0,
            delta: 0
        }
        
        this.palette = config.DEFAULT_PALETTE;
        
        this.spritePattern = config.DEFAULT_SPRITE_SHEET_PATTERN;
        this.#spriteSheet = {
            image: new Image(),
            width: 0,
            height: 0,
            loaded: false
        };

        this.fontMapping = config.DEFAULT_FONT_MAPPING;
        this.fontPattern = config.DEFAULT_FONT_PATTERN;
        this.#font = {
            image: new Image(),
            loaded: false
        }

        this.mouse = new Mouse(this);
        this.keyboard = new Keyboard();
        this.gamepad = new Gamepad(this);
        this.camera = new Camera();

        this.particles = [];
        
        this.settings = {
            width: config.CANVAS_SIZE,
            height: config.CANVAS_SIZE,
            ...settings,
        }
        this.drawing = {
            pixelPerfect: false,
            cameraFactor: { x: 1, y: 1 },
            monospace: false
        }
    }

    // Draw
    /**
     * @param {number} x
     * @param {number} y
     * @param {(number | string)} index
     * @param {boolean} [flipX=false]
     * @param {boolean} [flipY=false]
     */
    sprite(x: number, y: number, index: number | string, flipX: boolean=false, flipY: boolean=false) {
        const sheetPos = this.getSheetPos(index);
        const pos = this.#cameraFactorPoint(x, y);
        const size = config.SPRITE_SIZE;

        if (this.#spriteSheet.loaded) {
            this.save();

            this.translate(pos.x+size/2, pos.y+size/2);
            this.flip(flipX, flipY);
            
            this.context.drawImage(
                this.#spriteSheet.image,
                sheetPos.x, sheetPos.y,
                size, size,
                -size/2, -size/2,
                size, size
            );

            this.restore();
        } else
            this.strokeRect(pos.x, pos.y, size, size, 1, "#fff");

    }
    /**
     * **This is very laggy!**
     * Don't use it in large quantities!
     * 
     * @param {number} x
     * @param {number} y
     * @param {(number | string)} index
     * @param {?string} [color]
     * @param {boolean} [flipX=false]
     * @param {boolean} [flipY=false]
     */
    tintedSprite(x: number, y: number, index: number | string, color?: string, flipX: boolean=false, flipY: boolean=false) {
        const sheetPos = this.getSheetPos(index);
        const pos = this.#cameraFactorPoint(x, y);
        const size = config.SPRITE_SIZE;

        color && this.color(color);

        if (this.#spriteSheet.loaded) {
            // Tint sprite
            const buffer = document.createElement("canvas");
            const bx = buffer.getContext("2d")!;
            buffer.width = size;
            buffer.height = size;

            bx.drawImage(this.#spriteSheet.image, -sheetPos.x, -sheetPos.y);
            
            bx.globalCompositeOperation = "multiply";
            bx.fillStyle = this.context.fillStyle;
            bx.fillRect(0, 0, buffer.width, buffer.height);

            bx.globalCompositeOperation = "destination-atop";
            bx.drawImage(this.#spriteSheet.image, -sheetPos.x, -sheetPos.y,);
            
            // Draw sprite
            this.save();

            this.translate(pos.x+size/2, pos.y+size/2);
            this.flip(flipX, flipY);
            
            this.context.drawImage(buffer, -size/2, -size/2);

            this.restore();
        } else
            this.strokeRect(pos.x, pos.y, size, size, 1, "#fff");

    }
    /**
     * @param {string} color
     */
    color(color: string) {
        this.context.fillStyle = this.getColor(color);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {?string} [color]
     */
    pixel(x: number, y: number, color?: string) {
        this.rect(x, y, 1, 1, color);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {?string} [color]
     */
    rect(x: number, y: number, width: number, height: number, color?: string) {
        const pos = this.#cameraFactorPoint(x, y);
        const size = this.point(width, height);
        
        color && this.color(color);
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {number} [thickness=1]
     * @param {?string} [color]
     */
    strokeRect(x: number, y: number, width: number, height: number, thickness: number=1, color?: string) {
        const rx = x;
        const ry = y;
        const rw = width-1;
        const rh = height-1;
        
        this.line(rx, ry, rx+rw, ry, thickness, color); // top
        this.line(rx+rw, ry+1, rx+rw, ry+rh-1, thickness, color); // right
        this.line(rx+rw, ry+rh, rx, ry+rh, thickness, color); // bottom
        this.line(rx, ry+1, rx, ry+rh-1, thickness, color); // left
    }
    /**
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @param {number} [thickness=1]
     * @param {?string} [color]
     */
    line(fromX: number, fromY: number, toX: number, toY: number, thickness: number=1, color?: string) {
        Algorithms.line(fromX, fromY, toX, toY, (x, y)=> this.rect(x, y, thickness, thickness, color));
    }
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} [radiusX=4]
     * @param {number} [radiusY=4]
     * @param {?string} [color]
     */
    ellipse(cx: number, cy: number, radiusX: number=4, radiusY: number=4, color?: string) {
        Algorithms.ellipse(cx, cy, radiusX, radiusY, (x, y)=> this.pixel(x, y, color));
    }
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} [radiusX=4]
     * @param {number} [radiusY=4]
     * @param {?string} [color]
     */
    strokeEllipse(cx: number, cy: number, radiusX: number=4, radiusY: number=4, color?: string) {
        Algorithms.strokeEllipse(cx, cy, radiusX, radiusY, (x, y)=> this.pixel(x, y, color));
    }
    star(x: number, y: number, size: number, color?: string) {
        const halfSize = Math.round(Math.floor(size/1)*1/2);
        
        this.line(x - halfSize, y, x + halfSize, y, 1, color);
        this.line(x, y - halfSize, x, y + halfSize, 1, color);
    }
    /**
     * @param {number[][]} tilemap
     */
    drawTilemap(tilemap: ITilemap) {
        for (let y = 0; y < tilemap.length; y ++)
            for (let x = 0; x < tilemap[y].length; x ++) {
                if (tilemap[y][x] >= 0)
                    this.sprite(x*8, y*8, tilemap[y][x]);
            }
    }
    drawParticles() {
        for (let i = 0; i < this.particles.length; i ++) {
            const part = this.particles[i];
            part.draw(this);
        }
    }
    
    save() {
        this.context.save();
    }
    restore() {
        this.context.restore();
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    translate(x: number, y: number) {
        const pos = this.point(x, y);
        this.context.translate(pos.x, pos.y);
    }
    /**
     * @param {boolean} [x=false]
     * @param {boolean} [y=false]
     */
    flip(x: boolean=false, y: boolean=false) {
        this.context.scale(x ? -1 : 1, y ? -1 : 1);
    }
    /**
     * @param {number} [alpha=1]
     */
    alpha(alpha: number=1) {
        this.context.globalAlpha = alpha;
    }
    /**
     * @param {CanvasRenderingContext2D["globalCompositeOperation"]} [mode="source-over"] 
     */
    blend(mode: CanvasRenderingContext2D["globalCompositeOperation"]="source-over") {
        this.context.globalCompositeOperation = mode;
    }
    /**
     * @param {string} [color="#000"]
     */
    background(color: string="#000") {
        this.rect(0, 0, this.width, this.height, color);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} [width=1]
     * @param {number} [height=1]
     */
    clear(x: number, y: number, width: number=1, height: number=1) {
        this.context.clearRect(x, y, width, height);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {"transparent" | ({} & string)} [color]
     * @param {number} offsetX X offset of the cells
     * @param {number} offsetY Y offset of the cells
     * @param {number} size Size of a cell
     */
    dithering(x: number, y: number, width: number, height: number, color?: "transparent" | ({} & string), offsetX: number=0, offsetY: number=0, size: number=1) {
        Algorithms.dithering(x, y, width, height, (x, y)=> {
            if (color?.toLowerCase() == "transparent")
                this.clear(x, y);
            else
                this.pixel(x, y, color);
        }, offsetX, offsetY, size);
    }
    pixelPerfect() {
        this.drawing.pixelPerfect = true;
    }
    noPixelPerfect() {
        this.drawing.pixelPerfect = false;
    }
    monospace() {
        this.drawing.monospace = true;
    }
    noMonospace() {
        this.drawing.monospace = false;
    }
    /**
     * @param {number} [factorX=1]
     * @param {number} [factorY]
     */
    cameraFactor(factorX: number=1, factorY?: number) {
        this.drawing.cameraFactor.x = factorX;
        this.drawing.cameraFactor.y = Utils.safeValue(factorY, factorX);
    }
    /**
     * @param {(string | number)} text
     * @param {number} x
     * @param {number} y
     */
    text(text: string | number, x: number, y: number, color?: string) {
        const lines = text.toString().split("\n");
        color && this.color(color);

        // Tint text
        let buffer;
        if (this.#font.loaded) {
            buffer = document.createElement("canvas");
            const bx = buffer.getContext("2d")!;
            buffer.width = config.FONT_SHEET_WIDTH;
            buffer.height = config.FONT_SHEET_HEIGHT;

            bx.drawImage(this.#font.image, 0, 0);
            
            bx.globalCompositeOperation = "multiply";
            bx.fillStyle = this.context.fillStyle;
            bx.fillRect(0, 0, buffer.width, buffer.height);

            bx.globalCompositeOperation = "destination-atop";
            bx.drawImage(this.#font.image, 0, 0);
        }
        
        // Draw lines
        for (let i = 0; i < lines.length; i ++) {
            const word = Utils.formatString(lines[i]);
            
            // Draw chars
            for (let j = 0; j < word.length; j ++) {
                const char = word[j].toLowerCase();
                const charPattern = this.fontPattern[char];

                const offsetX = charPattern?.offsetX || 0;
                const offsetY = charPattern?.offsetY || 0;
                
                let charOffset = 0;

                if (!this.drawing.monospace) {
                    // Calculate width of all previous char
                    for (let k = 0; k < word.slice(0, j).length; k ++) {
                        const prevChar = word.slice(0, j)[k];
                        const prevCharWidth = this.fontPattern[prevChar]?.width || config.CHAR_WIDTH;
                        const prevCharMargin = this.fontPattern[prevChar]?.margin || -1;
                        charOffset += prevCharWidth + prevCharMargin;
                    }
                } else {
                    charOffset = j * config.CHAR_WIDTH
                }
                
                this.#spriteChar(
                    buffer || this.#font.image,
                    x + charOffset + offsetX,
                    y + i*config.CHAR_HEIGHT + offsetY,
                    char
                );
            }
        }
    }
    getTextWidth(text: string | number): number {
        let widths = [];
        const lines = text.toString().split("\n");

        if (!this.drawing.monospace) {
            for (let i = 0; i < lines.length; i ++) {
                const word = Utils.formatString(lines[i]);
                widths.push(0);
                
                for (let j = 0; j < word.length; j ++) {
                    const char = word[j].toLowerCase();
                    const charPattern = this.fontPattern[char];

                    const width = charPattern?.width || config.CHAR_WIDTH;
                    const margin = charPattern?.margin || -1;
                    widths[i] += width + margin;
                }
            }
        } else {
            for (let i = 0; i < lines.length; i ++) {
                const word = Utils.formatString(lines[i]);
                widths.push(word.length*config.CHAR_WIDTH);
            }
        }

        return Math.max(...widths)+1;
    }

    // Utils
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    isButton(button: CustomGamepadButton): boolean {
        return this.gamepad.buttonIsPressed(button);
    }
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    justButton(button: CustomGamepadButton): boolean {
        return this.gamepad.buttonJustPressed(button);
    }
    /**
     * @param {string} code Can be used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    isKey(code: string): boolean {
        return this.keyboard.keyIsPressed(code);
    }
    /**
     * @param {string} code Can be used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    justKey(code: string): boolean {
        return this.keyboard.keyJustPressed(code);
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    isMouse(button: number=0): boolean {
        return this.mouse.buttonIsPressed(button);
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    justMouse(button: number=0): boolean {
        return this.mouse.buttonJustPressed(button);
    }
    /**
     * @param {number[][]} tilemap
     * @param {number} x
     * @param {number} y
     * @returns {number} Index of tile at `x` `y`
     */
    tile(tilemap: ITilemap, x: number, y: number): number {
        const _x = Math.floor(x/8);
        const _y = Math.floor(y/8);
        
        if (tilemap[_y])
            return tilemap[_y][_x] || -1;
        else
            return -1;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} [maxLifeTime=60]
     * @param {number} [velX=0]
     * @param {number} [velY=0]
     * @param {number} [size=8]
     * @param {string} [color="#fff"]
     */
    pushParticle(x: number, y: number, maxLifeTime: number=60, velX: number=0, velY: number=0, size: number=8, color: string="#fff") {
        this.particles.push(new Particle(x, y, maxLifeTime, velX, velY, size, color));
    }
    
    // 
    /**
     * @param {string} color
     * @returns {string}
     */
    getColor(color: string): string {
        return this.palette[color] ? this.palette[color] : color
    }
    /**
     * @param {(number | string)} index
     * @returns {{ x: number, y: number }}
     */
    getSheetPos(index: number | string): IPoint {
        const i = this.spritePattern[index] ? this.spritePattern[index] : +index;
        
        return {
            x: (i*config.SPRITE_SIZE % this.#spriteSheet.width),
            y: Math.floor(i*config.SPRITE_SIZE / this.#spriteSheet.width)*8
        }
    }
    
    /**
     * @param {{ [key: string]: string }} palette
     */
    setPalette(palette: IEctaPalette) {
        this.palette = { ...this.palette, ...palette };
    }
    /**
     * @param {{ [key: string]: string }} pattern
     */
    setSpritePattern(pattern: IEctaSpritePattern) {
        this.spritePattern = { ...this.spritePattern, ...pattern };
    }
    /**
     * @param {{ [key: string]: { width: number, offsetX?: number, offsetY?: number, margin?: number }}} pattern
     */
    setFontPattern(pattern: IEctaFontPattern) {
        this.fontPattern = { ...this.fontPattern, ...pattern };
    }
    /**
     * @param {string} mapping
     * @param {boolean} [override=true]
     */
    setFontMapping(mapping: string, override: boolean=true) {
        if (override)
            this.fontMapping = mapping;
        else
            this.fontMapping += mapping;
    }
    /**
     * @param {string} src
     */
    loadSpriteSheet(src: string) {
        this.#spriteSheet.image.src = src;
    }
    /**
     * @param {string} src
     */
    loadFontSheet(src: string) {
        this.#font.image.src = src;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {[r: number, g: number, b: number, a: number]}
     */
    getPixelColor(x: number, y: number): RGBA {
        return [
            this.imageData.data[(y * this.width + x)*4],
            this.imageData.data[(y * this.width + x)*4 + 1],
            this.imageData.data[(y * this.width + x)*4 + 2],
            this.imageData.data[(y * this.width + x)*4 + 3],
        ]
    }

    // Is
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isPointInCamera(x: number, y: number): boolean {
        const px = x - this.camera.x;
        const py = y - this.camera.y;

        return px >= 0 && px < this.width && py >= 0 && py < this.height;
    }

    // Get
    /**
     * @readonly
     * @type {number}
     */
    get width(): number {
        return this.canvas.width;
    }
    /**
     * @readonly
     * @type {number}
     */
    get height(): number {
        return this.canvas.height;
    }
    /**
     * @readonly
     * @type {{ image: HTMLImageElement, width: number, height: number }}
     */
    get spriteSheet(): Omit<IEctaSpriteSheet, "loaded"> {
        return {
            image: this.#spriteSheet.image,
            width: this.#spriteSheet.width,
            height: this.#spriteSheet.height,
        }
    }
    /**
     * @readonly
     * @type {{ image: HTMLImageElement }}
     */
    get font(): Omit<IEctaFontSheet, "loaded"> {
        return {
            image: this.#font.image,
        }
    }
    /**
     * @readonly
     * @type {number}
     */
    get time(): number {
        return this.clock.time;
    }
    /**
     * @readonly
     * @type {ImageData}
     */
    get imageData(): ImageData {
        return this.context.getImageData(0, 0, this.width, this.height);
    }
    /**
     * @readonly
     * @type {string}
     */
    get version(): string {
        return config.VERSION;
    }
    /**
     * @readonly
     * @type {string}
     */
    get versionName(): string {
        return config.VERSION_NAME;
    }
    
    //
    /**
     * @param {HTMLElement} [element=document.body]
     */
    init(element: HTMLElement=document.body) {
        this.canvas.width = this.settings.width;
        this.canvas.height = this.settings.height;

        // Default assets
        this.#font.image.src = config.DEFAULT_FONT;
        this.#spriteSheet.image.src = config.DEFAULT_SPRITE_SHEET;

        this.prestart();
        
        const start = ()=> {
            if (this.started) return;
            this.started = true;
            
            this.start();
            
            let lag = 0;
            let lastTime = Date.now();
            
            const loop = ()=> {
                requestAnimationFrame(loop);
                
                this.gamepad.update();
                this.keyboard.update();

                this.camera.update();

                while (lag >= 1000/60) {
                    this.clock.time ++;
                    
                    this.update();
    
                    for (let i = 0; i < this.particles.length; i ++) {
                        const part = this.particles[i];
                        part.update(this.particles, i);
                    }
                    
                    lag -= 1000/60;
                }
                this.draw();
    
                // Gamepad
                this.gamepad.updateAfter();
                // Keyboard
                this.keyboard.updateAfter();
                // Mouse
                this.mouse.updateAfter();

                this.clock.delta = Date.now() - lastTime;
                this.clock.fps = 1000 / this.clock.delta;
                lastTime = Date.now();
                lag += this.clock.delta;
            }
            loop();
        }

        this.#spriteSheet.image.addEventListener("load", ()=> {
            this.#spriteSheet.width = Math.floor(this.#spriteSheet.image.width/config.SPRITE_SIZE)*config.SPRITE_SIZE;
            this.#spriteSheet.height = Math.floor(this.#spriteSheet.image.height/config.SPRITE_SIZE)*config.SPRITE_SIZE;
            this.#spriteSheet.loaded = true;
            start();
        })
        this.#spriteSheet.image.addEventListener("error", (err)=> {
            console.error(`Ecta: Cannot load sprite sheet!\n${ err.message }`)
            this.#spriteSheet.loaded = false;
            start();
        })

        this.#font.image.addEventListener("load", ()=> {
            this.#font.loaded = true;
            start();
        })
        this.#font.image.addEventListener("error", (err)=> {
            console.error(`Ecta: Cannot load font!\n${ err.message }`)
            this.#font.loaded = false;
            start();
        })
            
        element.appendChild(this.canvas);

    }

    // Misc
    /**
     * @param {number} x
     * @param {number} y
     * @returns {{ x: number, y: number }}
     */
    point(x: number, y: number): IPoint {
        let px = x;
        let py = y;

        if (this.drawing.pixelPerfect)
            return {
                x: Math.floor(px),
                y: Math.floor(py),
            }
        
        return { x: px, y: py }
    }

    // Private
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} [cameraFactorX=1]
     * @param {number} [cameraFactorY=1]
     * @returns {{ x: number, y: number }}
     */
    #cameraFactorPoint(x: number, y: number, cameraFactorX: number=1, cameraFactorY: number=1): IPoint {
        let px = x - (this.camera.x * this.drawing.cameraFactor.x * cameraFactorX);
        let py = y - (this.camera.y * this.drawing.cameraFactor.y * cameraFactorY);

        if (this.drawing.pixelPerfect)
            return {
                x: Math.floor(px),
                y: Math.floor(py),
            }
        
        return { x: px, y: py }
    }
    #spriteChar(sheet: CanvasImageSource, x: number, y: number, char: string) {
        const index = this.fontMapping.indexOf(char.toLowerCase());
        const pos = this.#cameraFactorPoint(x, y);
        
        if (index >= 0 && this.#font.loaded) {
            const sx = index*6 % 78;
            const sy = Math.floor(index*6 / 78)*6;

            this.context.drawImage(sheet, sx, sy, config.CHAR_WIDTH, config.CHAR_HEIGHT, pos.x, pos.y, config.CHAR_WIDTH, config.CHAR_HEIGHT);
        } else {
            this.strokeRect(pos.x, pos.y, config.CHAR_WIDTH, config.CHAR_HEIGHT, 1, "#fff");
        }
    }
}