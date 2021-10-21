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


/**
 * Converts an HSL color value to an HSL color value.
 * See https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB for explanation 
 * @param {{H:Number, S:Number, L:Number}} rgb
 * @return {{R:Number, R:Number, B:Number}}
 */
function HSLToRGB(hsl) {
    let C = (1 - Math.abs(2 * hsl.L  - 1)) * hsl.S;
    let H1 = hsl.H / 60;
    let X = C * (1 - Math.abs(H1 % 2 - 1))
    
    let rgb1;

    if(H1 >= 0 && H1 < 1)
        rgb1 = {R: C ,G: X ,B: 0};
    if(H1 >= 1 && H1 < 2)
        rgb1 = {R: X ,G: C ,B: 0};
    if(H1 >= 2 && H1 < 3)
        rgb1 = {R: 0 ,G: C ,B: X};
    if(H1 >= 3 && H1 < 4)
        rgb1 = {R: 0 ,G: X ,B: C};
    if(H1 >= 4 && H1 < 5)
        rgb1 = {R: X ,G: 0 ,B: C};
    if(H1 >= 5 && H1 < 6)
        rgb1 = {R: C ,G: 0 ,B: X};

    let m = hsl.L - (C/2);

    return {R: (rgb1.R + m) * 255, 
           G: (rgb1.G + m) * 255, 
           B:(rgb1.B + m) * 255}
}