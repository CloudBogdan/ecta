import Utils from "./Utils.js";

/**
 * @author bogdanov
 * @class Algorithms
 * @typedef {Algorithms}
 */
class Algorithms {
    /**
     * Code stolen from https://gist.github.com/DavidMcLaughlin208/60e69e698e3858617c322d80a8f174e2
     *
     * @param {number} fromX
     * @param {number} fromY
     * @param {number} toX
     * @param {number} toY
     * @param {(x: number, y: number)=> void} pixel
     */
    line(fromX: number, fromY: number, toX: number, toY: number, pixel: (x: number, y: number)=> void) {
        if (fromX == toX && fromY == toY)
            return pixel(fromX, fromY);

        pixel(fromX, fromY);

        const xDiff = fromX - toX;
        const yDiff = fromY - toY;
        const xDiffIsLarger = Math.abs(xDiff) > Math.abs(yDiff);

        const xModifier = xDiff < 0 ? 1 : -1;
        const yModifier = yDiff < 0 ? 1 : -1;

        const longerSideLength = Math.max(Math.abs(xDiff), Math.abs(yDiff));
        const shorterSideLength = Math.min(Math.abs(xDiff), Math.abs(yDiff));
        const slope = (shorterSideLength == 0 || longerSideLength == 0) ? 0 : shorterSideLength / longerSideLength;

        let shorterSideIncrease;
        for (let i = 1; i <= longerSideLength; i++) {
            shorterSideIncrease = Math.round(i * slope);
            let yIncrease, xIncrease;
            if (xDiffIsLarger) {
                xIncrease = i;
                yIncrease = shorterSideIncrease;
            } else {
                yIncrease = i;
                xIncrease = shorterSideIncrease;
            }
            const currentY = fromY + (yIncrease * yModifier);
            const currentX = fromX + (xIncrease * xModifier);

            pixel(currentX, currentY);
        }
    }
    
    /**
     * @param {number} cx
     * @param {number} cy
     * @param {number} radiusX
     * @param {number} radiusY
     * @param {(x: number, y: number)=> void} pixel
     */
    ellipse(cx: number, cy: number, radiusX: number, radiusY: number, pixel: (x: number, y: number)=> void) {        
        const rx = Math.floor(radiusX);
        const ry = Math.floor(radiusY);

        this.strokeEllipse(cx, cy, radiusX, radiusY, pixel);
        
        for(let y=-ry; y<=ry; y++) {
            for(let x=-rx; x<=rx; x++) {
                if(x*x*radiusY*radiusY + y*y*radiusX*radiusX < radiusY*radiusY*radiusX*radiusX)
                    pixel(cx+x, cy+y);
            }
        }
    }
    /**
     * Code stolen from https://www.geeksforgeeks.org/midpoint-ellipse-drawing-algorithm/
     *
     * @param {number} cx
     * @param {number} cy
     * @param {number} radiusX
     * @param {number} radiusY
     * @param {(x: number, y: number)=> void} pixel
     */
    strokeEllipse(cx: number, cy: number, radiusX: number, radiusY: number, pixel: (x: number, y: number)=> void) {
        if (radiusY == 0) {
            this.line(cx-radiusX, cy-radiusY, cx+radiusX, cy+radiusY, pixel);
            return;
        }
        
        var dx, dy, d1, d2, x, y;
        x = 0;
        y = radiusY;
     
        d1 = (radiusY * radiusY) - (radiusX * radiusX * radiusY) + (0.25 * radiusX * radiusX);
        dx = 2 * radiusY * radiusY * x;
        dy = 2 * radiusX * radiusX * y;
     
        while (dx < dy) {        
    
            pixel(x+cx, y+cy);
            pixel(-x+cx, y+cy);
            pixel(x+cx, -y+cy);
            pixel(-x+cx, -y+cy);
     
            if (d1 < 0) {
                x++;
                dx = dx + (2 * radiusY * radiusY);
                d1 = d1 + dx + (radiusY * radiusY);
            }
            else {
                x++;
                y--;
                dx = dx + (2 * radiusY * radiusY);
                dy = dy - (2 * radiusX * radiusX);
                d1 = d1 + dx - dy + (radiusY * radiusY);
            }
        }
     
        d2 = ((radiusY * radiusY) * ((x + 0.5) * (x + 0.5))) +
             ((radiusX * radiusX) * ((y - 1) * (y - 1))) -
              (radiusX * radiusX * radiusY * radiusY);
     
        while (y >= 0) {
     
            pixel(x+cx, y+cy);
            pixel(-x+cx, y+cy);
            pixel(x+cx, -y+cy);
            pixel(-x+cx, -y+cy);
     
            if (d2 > 0) {
                y--;
                dy = dy - (2 * radiusX * radiusX);
                d2 = d2 + (radiusX * radiusX) - dy;
            }
            else {
                y--;
                x++;
                dx = dx + (2 * radiusY * radiusY);
                dy = dy - (2 * radiusX * radiusX);
                d2 = d2 + dx - dy + (radiusX * radiusX);
            }
        }
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {(x: number, y: number)=> void} pixel
     */
    dithering(x: number, y: number, width: number, height: number, pixel: (x: number, y: number)=> void, offsetX: number, offsetY: number, size: number) {
        let rw = width;
        let rh = height;
        let rx = x;
        let ry = y;

        if (width < 0) {
            rw = -width;
            rx = x + width+1;
        }
        if (height < 0) {
            rh = -height;
            ry = y + height+1;
        }
        
        for (let i = 0; i < Math.floor(rw); i ++) {
            for (let j = 0; j < Math.floor(rh); j ++) {
                const cx = rx + i;
                const cy = ry + j;
                
                if ((Math.floor((cx - Math.floor(offsetX)) / size) + Math.floor((cy - Math.floor(offsetY)) / size)) % 2 == 0)
                    pixel(rx + i, ry + j);
            }
        }
    }
}
export default new Algorithms();