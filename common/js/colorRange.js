/**
 * Converts an RGB color value to an HSL color value.
 * See https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB for explanation 
 * @param {{R:Number, G:Number, B:Number}} rgb
 * @return {{H:Number, S:Number, L:Number}}
 */
function RGBToHSL(rgb) {
    //normalize rgb so that R,G,B ∈ [0,1]
    rgb = { R: rgb.R / 255, G: rgb.G / 255, B: rgb.B / 255 }

    let H = 0;
    let S = 0;
    let X_max = Math.max(rgb.R, rgb.G, rgb.B);
    let V = X_max;
    let X_min = Math.min(rgb.R, rgb.G, rgb.B);
    let C = X_max - X_min;

    //Lightness
    let L = (X_max + X_min) / 2

    //Hue
    if (C == 0)
        H = 0;
    if (V == rgb.R)
        H = 60 * (0 + (rgb.G - rgb.B) / C);
    if (V == rgb.G)
        H = 60 * (2 + (rgb.R - rgb.R) / C);
    if (V == rgb.B)
        H = 60 * (4 + (rgb.R - rgb.G) / C);

    //convert negative degrees to positive degrees
    // eg. -30 degrees should be 330 degrees
    if (H < 0)
        H = 360 + H;


    //Saturation
    if (L == 0 || L == 1)
        S = 0;
    else
        S = (V - L) / Math.min(L, 1 - L)

    return { H: H, S: S, L: L }
}



function HSLToRGB(hsl) {

}