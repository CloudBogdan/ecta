import { Art, Color, Utils } from "../dist/index.js";

const art = new Art();

art.prestart = prestart;
art.start = start;
art.update = update;
art.draw = draw;

const stars = [];
let isEcta = false;

let lastFps = 0;

let text = "";
let title = "This is Ecta!"

function prestart() {
    // Load some assets...
    art.loadSpriteSheet("./sprites.png");
}
function start() {
    // ...
}
function update() {
    // Spawn stars
    if (art.time % 10 == 0 || art.isMouse()) {
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

        if (star.size > 6)
            stars.splice(i, 1);
    }

    if (art.justMouse()) {
        isEcta = !isEcta;
        art.camera.shake(.1);

        for (let i = 10; i > 0; i --) {
            art.pushParticle(
                art.width/2 + Utils.randomInt(-20, 20), art.height/2,
                Utils.randomInt(40, 80),
                Utils.random(-2, 2), Utils.random(-2, 2),
                Utils.randomInt(8, 12),
                "white"
            )
        }
    }
    if (art.isMouse(2)) {
        for (let i = 10; i > 0; i --) {
            art.pushParticle(
                art.width/2 + Utils.randomInt(-20, 20), art.height/2,
                Utils.randomInt(40, 80),
                Utils.random(-2, 2), Utils.random(-2, 2),
                Utils.randomInt(8, 12),
                "white"
            )
        }
    }

    art.camera.move(
        +art.isButton("right") - +art.isButton("left"),
        +art.isButton("down") - +art.isButton("up"),
    );
}

function draw() {
    art.cameraFactor(0)
    art.background();
    art.pixelPerfect();
    art.cameraFactor(1)

    // HELLO trail
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
    // HELLO
    for (let i = 0; i < 5; i ++) {
        art.sprite(
            art.width/2 - 5*10/2 + i*10 + Utils.sin(art.time/20 + i/4, 1, 4),
            art.height/2-4 + Utils.sin(-art.time/20 + i/2, 2, 6),
            i+1 + (!isEcta ? 7 : 0)
        );
    }

    art.drawParticles();
    
    // Draw stars
    for (let i = 0; i < stars.length; i ++) {
        const star = stars[i];

        art.star(star.x, star.y, star.size, star.size > 4, star.color);
    }

    // Some text
    art.text(
        title,
        art.width/2 - art.getTextWidth(title)/2,
        art.height/2 + 32,
        "white"
    );

    const command = `>${ text }`;
    
    art.alpha(.2)
    art.strokeRect(
        art.width/2 - art.getTextWidth(command)/2,
        art.height/2+40,
        art.getTextWidth(command),
        7,
        1,"gray-brown"
    );
    art.alpha(1)
    
    art.text(command + ((art.time % 40 < 20) ? "_" : ""), art.width/2 - art.getTextWidth(command)/2, art.height/2 + 40, "gray-brown");
    art.text(lastFps.toFixed(0), art.width-12, 0, "white");
    art.text(art.particles.length, art.width-12, 12, "white");

    // Water
    const waterHeight = Math.floor(art.height/3);

    art.cameraFactor(0);
    art.alpha(.2);
    art.line(0, art.height-waterHeight-1, art.width, art.height-waterHeight-1, 1, "white");
    art.alpha(1);
    
    // Water pixels modifier (shader)
    art.pixelsModifier((index, x, y, color, imageData)=> {
        const px = x + Utils.sin(art.time/10 + y - art.camera.y, .4, 2);
        const py = y;

        return {
            x: y > art.height - waterHeight ? px : x,
            y: y > art.height - waterHeight ? py : y,
            color: y > art.height - waterHeight && [
                imageData.data[((art.height + waterHeight - y)*art.width + x)*4],
                imageData.data[((art.height + waterHeight - y)*art.width + x)*4+1],
                imageData.data[((art.height + waterHeight - y)*art.width + x)*4+2],
                imageData.data[((art.height + waterHeight - y)*art.width + x)*4+3],
            ]
        }
    });

    if (art.time%10 == 0) {
        lastFps = art.clock.fps
    }
}

art.keyboard.onKeyPressed(e=> {
    const key = e.key.toLowerCase();

    if (key == "backspace") {
        if (text.length > 0)
            text = text.substring(0, text.length-1);
    } else {
        if (!key.match(/shift|control|tab|alt/gm) && text.length < 24) {
            text += key.replace(/key|digit/gm, "").replace(/space/gm, " ");
        }
    }
})

// Start the art!
art.init();