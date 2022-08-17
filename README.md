![image](https://user-images.githubusercontent.com/60233692/184996819-9c8f7085-50e2-494c-a8bb-b5ce6cb8fef3.png)

A small JavaScript library that was inspired by PICO 8

You have only 128x128 canvas and a few useful utilities nothing else is needed!

## Features
1. Begginer friendly
2. Fast development
4. Useful utilities
3. This is pixel at! I like pixel art!

## Start project
```js
import { Art } from "ecta";
// Also try import { Utils, Algorithms }

const art = new Art();

art.prestart = prestart;
art.start = start;
art.update = update;
art.draw = draw;

function prestart() {
  // Load some assets...
  
  // Load 8x8 sprites sheet
  art.loadSpriteSheet("./path/to/sprite-sheet.png");
  // Set your own color pallete
  art.setPallete({
    "color-name": "#f5e",
    "red": "#f00"
  });
}
function start() {

}
function update() {
  // Checks if right button pressed (arrow right, key D, gamepad right button or gamepad joystick)
  if (art.isButton("right")) {
    console.log("Right")
  }
  // Checks if A button pressed (X key, K key, gamepad A, gamepad Y)
  if (art.isButton("A")) {
    console.log("A")
  }
  // Checks if B button pressed (Z key, L key, gamepad X, gamepad B)
  if (art.isButton("B")) {
    console.log("B")
  }

  // Moving the camera by x every frame
  art.camara.move(1, 0);
}
function draw() {
  art.background("black"); // Fill background with some color
  art.pixelPerfect(); // Blur removing
  
  // Draw red pixel at 10, 20 
  art.pixel(10, 20, "red");
  
  // Draw blue line and blue stoked rect 
  art.color("blue");
  art.line(4, 4, 20, 20);
  art.strokeRect(30, 30, 8, 8);
  
  // Draw pixel at mouse pos
  art.color("hsl(10, 100%, 50%)");
  art.pixel(art.mouse.x, art.mouse.y);
}
```

## Default palette
- white `#ffffff`
- black `#000000`
- dark-purple `#430067`
- purple `#94216a`
- red `#ff004d`
- orange `#ff8426`
- yellow `#ffdd34`
- green `#50e112`
- gray-green `#3fa66f`
- gray-blue `#365987`
- blue `#0033ff`
- light-blue `#29adff`
- teal `#00ffcc`
- light-gray `#fff1e8`
- gray `#c2c3c7`
- brown `#ab5236`
- gray-brown `#5f574f`

1.0 - alpha

@ Bogdanov :D 2022
