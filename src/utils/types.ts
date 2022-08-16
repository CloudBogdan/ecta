export type RGBA = [r: number, g: number, b: number, a?: number];
export type HSLA = [h: number, s: number, l: number, a?: number];

export type ITilemap = number[][];
export interface IPoint {
    x: number
    y: number
}
export interface IRect {
    x: number
    y: number
    width: number
    height: number
}
export type IShortRect = [x: number, y: number, width: number, height: number];
export interface IDrawableObject {
    draw: (...args: any[])=> void
    update: (...args: any[])=> void
}

export type CustomGamepadButton = "right" | "left" | "up" | "down" | "A" | "B";