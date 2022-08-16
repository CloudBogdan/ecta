import { Art, Color, Utils } from "../dist/index.js";

export const art = new Art();

art.prestart = prestart;
art.start = start;
art.update = update;
art.draw = draw;

const stars = [];
const points = [];
let text = "";
let isEcta = false;

function prestart() {
    // Load some assets...
    art.loadSpriteSheet("./sprites.png");
}
function start() {
    // ...
}
function update() {
    // Set points
    points.push({ x: art.mouse.x, y: art.mouse.y });
    if (points.length > 4)
        points.shift();
    
    // Spawn stars
    if (art.time % 40 == 0) {
        stars.push({
            x: Utils.random(art.width/2 - 40, art.width/2 + 40),
            y: Utils.random(art.height/2 - 24, art.height/2),
            size: 0,
            color: Color.randomHsl()
        });
    }

    // Update stars
    for (let i = 0; i < stars.length; i ++) {
        const star = stars[i];

        star.size += .4;

        if (star.size >= 6)
            stars.splice(i, 1);
    }

    if (art.justMouse()) {
        isEcta = !isEcta;
        art.camera.shake(.1);
    }
}
function draw() {
    art.background();
    art.pixelPerfect();

    // HELLO
    for (let count = 2; count > 0; count --) {

        for (let i = 0; i < 5; i ++) {
            // `art.tintedSprite` is very laggy!
            // Don't use it in large quantities!
            art.tintedSprite(
                art.width/2 - 5*10/2 + i*10 + Utils.sin(art.time/20 + i/4 - count/3, 1, 4),
                art.height/2-4 + Utils.sin(-art.time/20 + i/2 + count/3, 2, 6),
                i+1 + (!isEcta ? 7 : 0),
                Color.hsl((i * 40 + art.time*2 + count*10) % 360, 100, 50)
            );
        }

    }
    for (let i = 0; i < 5; i ++) {
        art.sprite(
            art.width/2 - 5*10/2 + i*10 + Utils.sin(art.time/20 + i/4, 1, 4),
            art.height/2-4 + Utils.sin(-art.time/20 + i/2, 2, 6),
            i+1 + (!isEcta ? 7 : 0)
        );
    }
    
    // Draw stars
    for (let i = 0; i < stars.length; i ++) {
        const star = stars[i];

        art.color(star.color);

        if (star.size <= 4) {
            art.star(star.x, star.y, star.size);
        } else {
            art.pixel(star.x-3, star.y);
            art.pixel(star.x+3, star.y);
            art.pixel(star.x, star.y-3);
            art.pixel(star.x, star.y+3);
        }
    }

    // Line
    for (let i = 0; i < points.length; i ++) {
        const lastPoint = points[i-1];
        const point = points[i];
        
        if (lastPoint) {
            art.line(lastPoint.x, lastPoint.y, point.x, point.y, 1, "white");
        }
    }

    // Some text
    art.text("This is ecta!", art.width/2 - 13/2*5, art.height/2+32, "white");
    art.text(">" + text + ((art.time % 40 < 20) ? "_" : ""), art.width/2 - (text.length+1)/2*5, art.height/2+38, "gray-brown");
}

addEventListener("keydown", e=> {
    const key = e.key.toLowerCase();

    if (key == "backspace") {
        if (text.length > 0)
            text = text.substring(0, text.length-1);
    } else {
        if (!key.match(/shift|control|tab|alt/gm)) {
            if (text.length >= 18)
                text = "";
            
            text += key.replace(/key|digit/gm, "").replace(/space/gm, " ");
        }
    }
})

// Start the art!
art.init();