let w = 4.0; // start range (-2,2)
let cx = 0;
let cy = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
    noLoop();
}

function mouseClicked(event) {

    const h = (w * height) / width;

    // recalculate center depending on click position
    cx = cx + ((event.x / width) - 0.5) * w;
    cy = cy + ((event.y / height) - 0.5) * h;

    // zoom in
    w = w / 2.0;

    redraw();
}

function draw() {
    background(0);

    const h = (w * height) / width;

    const xmin = (-w / 2) + cx;
    const ymin = (-h / 2) + cy;

    loadPixels();

    // Maximum number of iterations - should be increased with smaller width
    const maxiterations = 50;

    const xmax = xmin + w;
    const ymax = ymin + h;

    // Calculate amount we increment x,y for each pixel
    const dx = (xmax - xmin) / (width);
    const dy = (ymax - ymin) / (height);

    // Start y
    let y = ymin;
    for (let j = 0; j < height; j++) {
        // Start x
        let x = xmin;
        for (let i = 0; i < width; i++) {

            // For each coordinate check if iterates towards infinity and how fast
            let a = x;
            let b = y;

            let n = 0;
            while (n < maxiterations) {
                const aa = a * a;
                const bb = b * b;
                const twoab = 2.0 * a * b;
                a = aa - bb + x;
                b = twoab + y;

                // if it goes towards infinity (fast check)
                if (aa + bb > 4) {
                    break;
                }
                n++;
            }

            // We color each pixel based on how long it takes to get to infinity
            // only needed if not black (which is default color)
            if (n < maxiterations) {
                const pix = (i + j * width) * 4;
                const norm = map(n, 0, maxiterations, 0, 1);
                const bright = map(norm, 0, 1, 0, 255);

                pixels[pix + 0] = bright;
                pixels[pix + 1] = bright;
                pixels[pix + 2] = 0;
                pixels[pix + 3] = 255;
            }
            x += dx;
        }
        y += dy;
    }
    updatePixels();

    textSize(32);
    fill(255, 255, 255);
    text('Click / Tap to zoom in', 32, 64);
}