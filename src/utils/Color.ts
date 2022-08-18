import { HSLA, RGBA } from "./types.js";
import Utils from "./Utils.js";

/**
 * @author bogdanov
 * @class Color
 * @typedef {Color}
 */
class Color {
    
    /**
     * @param {[r: number, g: number, b: number, a?: number]} a
     * @param {[r: number, g: number, b: number, a?: number]} b
     * @param {boolean} [compareAlpha=false]
     * @returns {boolean}
     */
    compareRgb(a: RGBA, b: RGBA, compareAlpha: boolean=false): boolean {
        return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && (compareAlpha ? (a[3] || 1) == (b[3] || 1) : true);
    }
    
    /**
     * @param {(number | [r: number, g: number, b: number, a?: number])} r
     * @param {number} g
     * @param {number} b
     * @param {number} [a=1]
     * @returns {string}
     */
    rgb(r: number | RGBA, g?: number, b?: number, a: number=1): string {
        if (typeof r == "object")
            return `rgba(${ r[0] }, ${ r[1] }, ${ r[2] }, ${ r[3] || 1 })`;

        return `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
    }
    /**
     * @param {(number | [h: number, s: number, l: number, a?: number])} h
     * @param {number} s
     * @param {number} l
     * @param {number} [a=1]
     * @returns {string}
     */
    hsl(h: number | HSLA, s: number=100, l: number=50, a: number=1): string {
        if (typeof h == "object")
            return `hsl(${ h[0] }, ${ h[1] }%, ${ h[2] }%, ${ h[3] || 1 })`;

        return `hsl(${ h }, ${ s }%, ${ l }%, ${ a })`;
    }

    /**
     * @param {number} [s=50]
     * @param {number} [l=100]
     * @returns {string}
     */
    randomHsl(s: number=100, l: number=50): string {
        return this.hsl(Utils.randomInt(0, 360), s, l);
    }
}
export default new Color();