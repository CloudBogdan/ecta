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
var _Art_instances, _Art_spriteSheet, _Art_fontSheet, _Art_cameraFactorPoint, _Art_spriteChar;
import Particle from "../components/Particle.js";
import Algorithms from "../utils/Algorithms.js";
import config from "../utils/config.js";
import Utils from "../utils/Utils.js";
import Camera from "./Camera.js";
import { Gamepad } from "./Gamepad.js";
import { Keyboard } from "./Keyboard.js";
import { Mouse } from "./Mouse.js";
/**
 * @author bogdanov
 * @export
 * @class Art
 * @typedef {Art}
 */
export class Art {
    constructor(settings) {
        _Art_instances.add(this);
        this.started = false;
        _Art_spriteSheet.set(this, void 0);
        _Art_fontSheet.set(this, void 0);
        this.prestart = () => { };
        this.start = () => { };
        this.update = () => { };
        this.draw = () => { };
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.canvas.classList.add("monos-canvas");
        this.canvas.style.imageRendering = "pixelated";
        this.context.imageSmoothingEnabled = false;
        this.context.imageSmoothingQuality = "low";
        this.palette = config.DEFAULT_PALETTE;
        this.spritePattern = { "empty": 0 };
        this.clock = {
            time: 0,
            fps: 0,
            delta: 0
        };
        __classPrivateFieldSet(this, _Art_spriteSheet, {
            image: new Image(),
            width: 0,
            height: 0,
            loaded: false
        }, "f");
        __classPrivateFieldSet(this, _Art_fontSheet, {
            image: new Image(),
            loaded: false
        }, "f");
        this.mouse = new Mouse(this);
        this.keyboard = new Keyboard();
        this.gamepad = new Gamepad(this);
        this.camera = new Camera();
        this.utils = Utils;
        this.particles = [];
        this.settings = Object.assign({ width: config.CANVAS_SIZE, height: config.CANVAS_SIZE }, settings);
        this.drawing = {
            pixelPerfect: false,
            cameraFactor: { x: 1, y: 1 }
        };
    }
    // Draw
    /**
     * @param {number} x
     * @param {number} y
     * @param {(number | string)} index
     * @param {boolean} [flipX=false]
     * @param {boolean} [flipY=false]
     */
    sprite(x, y, index, flipX = false, flipY = false) {
        const sheetPos = this.getSheetPos(index);
        const pos = __classPrivateFieldGet(this, _Art_instances, "m", _Art_cameraFactorPoint).call(this, x, y);
        const size = config.SPRITE_SIZE;
        if (__classPrivateFieldGet(this, _Art_spriteSheet, "f").loaded) {
            this.save();
            this.translate(pos.x + size / 2, pos.y + size / 2);
            this.flip(flipX, flipY);
            this.context.drawImage(__classPrivateFieldGet(this, _Art_spriteSheet, "f").image, sheetPos.x, sheetPos.y, size, size, -size / 2, -size / 2, size, size);
            this.restore();
        }
        else
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
    tintedSprite(x, y, index, color, flipX = false, flipY = false) {
        const sheetPos = this.getSheetPos(index);
        const pos = __classPrivateFieldGet(this, _Art_instances, "m", _Art_cameraFactorPoint).call(this, x, y);
        const size = config.SPRITE_SIZE;
        color && this.color(color);
        if (__classPrivateFieldGet(this, _Art_spriteSheet, "f").loaded) {
            // Tint sprite
            const buffer = document.createElement("canvas");
            const bx = buffer.getContext("2d");
            buffer.width = size;
            buffer.height = size;
            bx.drawImage(__classPrivateFieldGet(this, _Art_spriteSheet, "f").image, -sheetPos.x, -sheetPos.y);
            bx.globalCompositeOperation = "multiply";
            bx.fillStyle = this.context.fillStyle;
            bx.fillRect(0, 0, buffer.width, buffer.height);
            bx.globalCompositeOperation = "destination-atop";
            bx.drawImage(__classPrivateFieldGet(this, _Art_spriteSheet, "f").image, -sheetPos.x, -sheetPos.y);
            // Draw sprite
            this.save();
            this.translate(pos.x + size / 2, pos.y + size / 2);
            this.flip(flipX, flipY);
            this.context.drawImage(buffer, -size / 2, -size / 2);
            this.restore();
        }
        else
            this.strokeRect(pos.x, pos.y, size, size, 1, "#fff");
    }
    /**
     * @param {string} color
     */
    color(color) {
        this.context.fillStyle = this.getColor(color);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {?string} [color]
     */
    pixel(x, y, color) {
        this.rect(x, y, 1, 1, color);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {?string} [color]
     */
    rect(x, y, width, height, color) {
        const pos = __classPrivateFieldGet(this, _Art_instances, "m", _Art_cameraFactorPoint).call(this, x, y);
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
    strokeRect(x, y, width, height, thickness = 1, color) {
        this.line(x, y, x + width, y, thickness, color);
        this.line(x + width, y, x + width, y + height, thickness, color);
        this.line(x + width, y + height, x, y + height, thickness, color);
        this.line(x, y, x, y + height, thickness, color);
    }
    /**
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @param {number} [thickness=1]
     * @param {?string} [color]
     */
    line(fromX, fromY, toX, toY, thickness = 1, color) {
        Algorithms.line(fromX, fromY, toX, toY, (x, y) => this.rect(x, y, thickness, thickness, color));
    }
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} [radiusX=4]
     * @param {number} [radiusY=4]
     * @param {?string} [color]
     */
    ellipse(cx, cy, radiusX = 4, radiusY = 4, color) {
        Algorithms.ellipse(cx, cy, radiusX, radiusY, (x, y) => this.pixel(x, y, color));
    }
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} [radiusX=4]
     * @param {number} [radiusY=4]
     * @param {?string} [color]
     */
    strokeEllipse(cx, cy, radiusX = 4, radiusY = 4, color) {
        Algorithms.strokeEllipse(cx, cy, radiusX, radiusY, (x, y) => this.pixel(x, y, color));
    }
    star(x, y, size, color) {
        const halfSize = Math.round(Math.floor(size / 1) * 1 / 2);
        this.line(x - halfSize, y, x + halfSize, y, 1, color);
        this.line(x, y - halfSize, x, y + halfSize, 1, color);
    }
    /**
     * @param {number[][]} tilemap
     */
    drawTilemap(tilemap) {
        for (let y = 0; y < tilemap.length; y++)
            for (let x = 0; x < tilemap[y].length; x++) {
                if (tilemap[y][x] >= 0)
                    this.sprite(x * 8, y * 8, tilemap[y][x]);
            }
    }
    drawParticles() {
        for (let i = 0; i < this.particles.length; i++) {
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
    translate(x, y) {
        const pos = this.point(x, y);
        this.context.translate(pos.x, pos.y);
    }
    /**
     * @param {boolean} [x=false]
     * @param {boolean} [y=false]
     */
    flip(x = false, y = false) {
        this.context.scale(x ? -1 : 1, y ? -1 : 1);
    }
    /**
     * @param {number} [alpha=1]
     */
    alpha(alpha = 1) {
        this.context.globalAlpha = alpha;
    }
    /**
     * @param {CanvasRenderingContext2D["globalCompositeOperation"]} [mode="source-over"]
     */
    blend(mode = "source-over") {
        this.context.globalCompositeOperation = mode;
    }
    /**
     * @param {string} [color="#000"]
     */
    background(color = "#000") {
        this.rect(0, 0, this.width, this.height, color);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} [width=1]
     * @param {number} [height=1]
     */
    clear(x, y, width = 1, height = 1) {
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
    dithering(x, y, width, height, color, offsetX = 0, offsetY = 0, size = 1) {
        Algorithms.dithering(x, y, width, height, (x, y) => {
            if ((color === null || color === void 0 ? void 0 : color.toLowerCase()) == "transparent")
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
    /**
     * @param {number} [factorX=1]
     * @param {number} [factorY]
     */
    cameraFactor(factorX = 1, factorY) {
        this.drawing.cameraFactor.x = factorX;
        this.drawing.cameraFactor.y = Utils.safeValue(factorY, factorX);
    }
    /**
     * @param {(string | number)} text
     * @param {number} x
     * @param {number} y
     */
    text(text, x, y, color) {
        const _text = text.toString().split("\n");
        color && this.color(color);
        let buffer;
        if (__classPrivateFieldGet(this, _Art_fontSheet, "f").loaded) {
            buffer = document.createElement("canvas");
            const bx = buffer.getContext("2d");
            buffer.width = config.FONT_SHEET_WIDTH;
            buffer.height = config.FONT_SHEET_HEIGHT;
            bx.drawImage(__classPrivateFieldGet(this, _Art_fontSheet, "f").image, 0, 0);
            bx.globalCompositeOperation = "multiply";
            bx.fillStyle = this.context.fillStyle;
            bx.fillRect(0, 0, buffer.width, buffer.height);
            bx.globalCompositeOperation = "destination-atop";
            bx.drawImage(__classPrivateFieldGet(this, _Art_fontSheet, "f").image, 0, 0);
        }
        for (let i = 0; i < _text.length; i++) {
            const t = _text[i].replace(/\\n/gm, "").replace(/ё/gm, "е").replace(/й/gm, "и");
            for (let j = 0; j < t.length; j++) {
                __classPrivateFieldGet(this, _Art_instances, "m", _Art_spriteChar).call(this, buffer || __classPrivateFieldGet(this, _Art_fontSheet, "f").image, x + j * config.CHAR_WIDTH, y + i * config.CHAR_HEIGHT, t[j]);
            }
        }
    }
    // Utils
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    isButton(button) {
        return this.gamepad.buttonIsPressed(button);
    }
    /**
     * @param {"right" | "left" | "up" | "down" | "A" | "B"} button
     * @returns {boolean}
     */
    justButton(button) {
        return this.gamepad.buttonJustPressed(button);
    }
    /**
     * @param {string} code Can be used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    isKey(code) {
        return this.keyboard.keyIsPressed(code);
    }
    /**
     * @param {string} code Can be used like `"KeyA"` or `"a"`
     * @returns {boolean}
     */
    justKey(code) {
        return this.keyboard.keyJustPressed(code);
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    isMouse(button = 0) {
        return this.mouse.buttonIsPressed(button);
    }
    /**
     * @param {number} [button=0] Default is LMB
     * @returns {boolean}
     */
    justMouse(button = 0) {
        return this.mouse.buttonJustPressed(button);
    }
    /**
     * @param {number[][]} tilemap
     * @param {number} x
     * @param {number} y
     * @returns {number} Index of tile at `x` `y`
     */
    tile(tilemap, x, y) {
        const _x = Math.floor(x / 8);
        const _y = Math.floor(y / 8);
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
    pushParticle(x, y, maxLifeTime = 60, velX = 0, velY = 0, size = 8, color = "#fff") {
        this.particles.push(new Particle(x, y, maxLifeTime, velX, velY, size, color));
    }
    // 
    /**
     * @param {string} color
     * @returns {string}
     */
    getColor(color) {
        return this.palette[color] ? this.palette[color] : color;
    }
    /**
     * @param {(number | string)} index
     * @returns {{ x: number, y: number }}
     */
    getSheetPos(index) {
        const i = this.spritePattern[index] ? this.spritePattern[index] : +index;
        return {
            x: (i * config.SPRITE_SIZE % __classPrivateFieldGet(this, _Art_spriteSheet, "f").width),
            y: Math.floor(i * config.SPRITE_SIZE / __classPrivateFieldGet(this, _Art_spriteSheet, "f").width) * 8
        };
    }
    /**
     * @param {{ [key: string]: string }} palette
     */
    setPalette(palette) {
        this.palette = Object.assign(Object.assign({}, this.palette), palette);
    }
    /**
     * @param {{ [key: string]: string }} pattern
     */
    setSpritePattern(pattern) {
        this.spritePattern = Object.assign(Object.assign({}, this.spritePattern), pattern);
    }
    /**
     * @param {string} src
     */
    loadSpriteSheet(src) {
        __classPrivateFieldGet(this, _Art_spriteSheet, "f").image.src = src;
    }
    /**
     * @param {string} src
     */
    loadFontSheet(src) {
        __classPrivateFieldGet(this, _Art_fontSheet, "f").image.src = src;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {[r: number, g: number, b: number, a: number]}
     */
    getPixelColor(x, y) {
        return [
            this.imageData.data[(y * this.width + x) * 4],
            this.imageData.data[(y * this.width + x) * 4 + 1],
            this.imageData.data[(y * this.width + x) * 4 + 2],
            this.imageData.data[(y * this.width + x) * 4 + 3],
        ];
    }
    // Is
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isPointInCamera(x, y) {
        const px = x - this.camera.x;
        const py = y - this.camera.y;
        return px >= 0 && px < this.width && py >= 0 && py < this.height;
    }
    // Get
    /**
     * @readonly
     * @type {number}
     */
    get width() {
        return this.canvas.width;
    }
    /**
     * @readonly
     * @type {number}
     */
    get height() {
        return this.canvas.height;
    }
    /**
     * @readonly
     * @type {{ image: HTMLImageElement, width: number, height: number }}
     */
    get spriteSheet() {
        return {
            image: __classPrivateFieldGet(this, _Art_spriteSheet, "f").image,
            width: __classPrivateFieldGet(this, _Art_spriteSheet, "f").width,
            height: __classPrivateFieldGet(this, _Art_spriteSheet, "f").height,
        };
    }
    /**
     * @readonly
     * @type {{ image: HTMLImageElement }}
     */
    get fontSheet() {
        return {
            image: __classPrivateFieldGet(this, _Art_fontSheet, "f").image,
        };
    }
    /**
     * @readonly
     * @type {number}
     */
    get time() {
        return this.clock.time;
    }
    /**
     * @readonly
     * @type {ImageData}
     */
    get imageData() {
        return this.context.getImageData(0, 0, this.width, this.height);
    }
    /**
     * @readonly
     * @type {string}
     */
    get version() {
        return config.VERSION;
    }
    /**
     * @readonly
     * @type {string}
     */
    get versionName() {
        return config.VERSION_NAME;
    }
    //
    /**
     * @param {HTMLElement} [element=document.body]
     */
    init(element = document.body) {
        this.canvas.width = this.settings.width;
        this.canvas.height = this.settings.height;
        // Default assets
        __classPrivateFieldGet(this, _Art_fontSheet, "f").image.src = config.DEFAULT_FONT;
        __classPrivateFieldGet(this, _Art_spriteSheet, "f").image.src = config.DEFAULT_SPRITE_SHEET;
        this.prestart();
        const start = () => {
            if (this.started)
                return;
            this.start();
            let lag = 0;
            let lastTime = Date.now();
            const loop = () => {
                requestAnimationFrame(loop);
                this.clock.time++;
                this.clock.delta = Date.now() - lastTime;
                this.clock.fps = 1000 / this.clock.delta;
                lastTime = Date.now();
                lag += this.clock.delta;
                this.gamepad.update();
                this.keyboard.update();
                this.camera.update();
                while (lag >= 1000 / 60) {
                    this.update();
                    for (let i = 0; i < this.particles.length; i++) {
                        const part = this.particles[i];
                        part.update(this.particles, i);
                    }
                    lag -= 1000 / 60;
                }
                this.draw();
                // Gamepad
                this.gamepad.updateAfter();
                // Keyboard
                this.keyboard.updateAfter();
                // Mouse
                this.mouse.justPressed = false;
                this.mouse.last.x = this.mouse.x;
                this.mouse.last.y = this.mouse.y;
            };
            loop();
        };
        __classPrivateFieldGet(this, _Art_spriteSheet, "f").image.addEventListener("load", () => {
            __classPrivateFieldGet(this, _Art_spriteSheet, "f").width = Math.floor(__classPrivateFieldGet(this, _Art_spriteSheet, "f").image.width / config.SPRITE_SIZE) * config.SPRITE_SIZE;
            __classPrivateFieldGet(this, _Art_spriteSheet, "f").height = Math.floor(__classPrivateFieldGet(this, _Art_spriteSheet, "f").image.height / config.SPRITE_SIZE) * config.SPRITE_SIZE;
            __classPrivateFieldGet(this, _Art_spriteSheet, "f").loaded = true;
        });
        __classPrivateFieldGet(this, _Art_spriteSheet, "f").image.addEventListener("error", (err) => {
            console.error(`Ecta: Cannot load sprite sheet!\n${err.message}`);
            __classPrivateFieldGet(this, _Art_spriteSheet, "f").loaded = false;
        });
        __classPrivateFieldGet(this, _Art_fontSheet, "f").image.addEventListener("load", () => {
            __classPrivateFieldGet(this, _Art_fontSheet, "f").loaded = true;
        });
        __classPrivateFieldGet(this, _Art_fontSheet, "f").image.addEventListener("error", (err) => {
            console.error(`Ecta: Cannot load font!\n${err.message}`);
            __classPrivateFieldGet(this, _Art_fontSheet, "f").loaded = false;
        });
        start();
        element.appendChild(this.canvas);
    }
    // Misc
    /**
     * @param {number} x
     * @param {number} y
     * @returns {{ x: number, y: number }}
     */
    point(x, y) {
        let px = x;
        let py = y;
        if (this.drawing.pixelPerfect)
            return {
                x: Math.floor(px),
                y: Math.floor(py),
            };
        return { x: px, y: py };
    }
}
_Art_spriteSheet = new WeakMap(), _Art_fontSheet = new WeakMap(), _Art_instances = new WeakSet(), _Art_cameraFactorPoint = function _Art_cameraFactorPoint(x, y, cameraFactorX = 1, cameraFactorY = 1) {
    let px = x - (this.camera.x * this.drawing.cameraFactor.x * cameraFactorX);
    let py = y - (this.camera.y * this.drawing.cameraFactor.y * cameraFactorY);
    if (this.drawing.pixelPerfect)
        return {
            x: Math.floor(px),
            y: Math.floor(py),
        };
    return { x: px, y: py };
}, _Art_spriteChar = function _Art_spriteChar(sheet, x, y, char) {
    const index = config.FONT_PATTERN.indexOf(char.toLowerCase());
    const pos = __classPrivateFieldGet(this, _Art_instances, "m", _Art_cameraFactorPoint).call(this, x, y);
    if (index >= 0 && __classPrivateFieldGet(this, _Art_fontSheet, "f").loaded) {
        const sx = index * 6 % 78;
        const sy = Math.floor(index * 6 / 78) * 6;
        this.context.drawImage(sheet, sx, sy, config.CHAR_WIDTH, config.CHAR_HEIGHT, pos.x, pos.y, config.CHAR_WIDTH, config.CHAR_HEIGHT);
    }
    else {
        this.strokeRect(pos.x, pos.y, config.CHAR_WIDTH, config.CHAR_HEIGHT, 1, "#fff");
    }
};
//# sourceMappingURL=Art.js.map