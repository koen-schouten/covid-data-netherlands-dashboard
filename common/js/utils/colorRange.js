/**
 * Converst a base 10 to base 16 number with a fixed length.
 * @param {{R:Number, G:Number, B:Number}} number the number that needs to be converted
 * @returns {String} the Hexidecimal number as string
 */
function componentToHex(number) {
    // the radix param of toString allows conversion from base 10 to base 16 
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#parameters
    let hex = number.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Generates an rgb hexidecimal string from an RGB object
 * @param {{R:Number, G:Number, B:Number}} rgb an rgb object
 * @returns {String} rgb and hexidecimal rgb string
 */
function rgbToHex(rgb) {
    return "#" + componentToHex(rgb.R) + componentToHex(rgb.G) + componentToHex(rgb.B);
}


/**
 * Generates a function used for generating colorgradients for maps or charts.
 * It generates a color gradient that can be used to map a datapoint to a color.
 * 
 * Example:
 * 
 * An usecase for this function would for example be generating a map to show 
 * Average Household Income. Household Income could range from $20,000 to 
 * $80,000. An income of $20,000 would be represented by a red color. An 
 * income of $80,000 would be represented by a green color. All the values 
 * between would be represented by colors between red and green.
 * 
 * For this usecase the function could be used as:
 *  
 * let colorMap = colorRange({R:255, G:0, B:0}, {R:0, G:255, B:0}, 20000, 80000, 10)
 * colorMap(20000) // Object { R: 255, G: 0, B: 0 }
 * colorMap(80000) // Object { R: 0, G: 255, B: 0 }
 * colorMap(45000) // Object { R: 255, G: 227, B: 0 }
 * 
 * @param {{R:Number, G:Number, B:Number}} startColor the colorgradient starting color
 * @param {{R:Number, G:Number, B:Number}} endColor the colorgradient starting endcolor
 * @param {Number} startValue the range starting value
 * @param {Number} endValue the range end value
 * @param {Number} colorCount the number of colors in the gradient
 * @returns {function(value)} a function that converts a number into a color
 */
function colorRange(startColor, endColor, startValue, endValue, colorCount){
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
        else if (V == rgb.R)
            H = 60 * (0 + (rgb.G - rgb.B) / C);
        else if (V == rgb.G)
            H = 60 * (2 + (rgb.R - rgb.R) / C);
        else if (V == rgb.B)
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
     * @param {{H:Number, S:Number, L:Number}} hsl 
     * @return {{R:Number, R:Number, B:Number}}
     */
    function HSLToRGB(hsl) {
        let C = (1 - Math.abs(2 * hsl.L  - 1)) * hsl.S;
        let H1 = hsl.H / 60;
        let X = C * (1 - Math.abs(H1 % 2 - 1))
        
        let rgb1 = {R: 0 ,G: 0 ,B: 0};

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

        return {R: Math.round((rgb1.R + m) * 255), 
            G: Math.round((rgb1.G + m) * 255), 
            B: Math.round((rgb1.B + m) * 255)}
    }

    /**
     * Generate an even distribution of numbers between startVal and endVal.
     * 
     * For example generateEvenDistribution(50, 100, 5) generates:
     * 
     * [ 50, 62.5, 75, 87.5, 100 ]
     * 
     * @param {Number} startVal the first value in the range
     * @param {Number} endVal the last value in the range
     * @param {Number} count the amount of values in the range
     * @return {Array.<Number>}
     */
    function generateEvenDistribution(startVal, endVal, count){
        let stepSize = (endVal - startVal) / (count - 1);

        let values = [];

        for(let i = 0; i < count; i++){
            values[i] = startVal + i * stepSize
        }

        return values;
    }

    /**
     * Generate an Color gradient as an Array of RGB values.
     * 
     * @param {Number} startColor the startcolor
     * @param {Number} endColor the endcolor
     * @param {Number} colorCount the number of colors in the gradient
     * @return {Array.<RGB>}
     */
    function generateColorGradient(startColor, endColor, colorCount){
        if(colorCount < 2){
            throw new RangeError("The color count should be at least 2.")
        }

        startColor = RGBToHSL(startColor);
        endColor = RGBToHSL(endColor);

        let colors = []
        
        let HVals = generateEvenDistribution(startColor.H, endColor.H, colorCount)
        let SVals = generateEvenDistribution(startColor.S, endColor.S, colorCount)
        let LVals = generateEvenDistribution(startColor.L, endColor.L, colorCount)

        let color;
        for(let i = 0; i < colorCount; i++){
            color = {H: HVals[i], S: SVals[i], L: LVals[i]}
            colors.push(HSLToRGB(color));
        }

        return colors;
    }


    return function(value){
        let colors = generateColorGradient(startColor, endColor, colorCount)
        let values = generateEvenDistribution(startValue, endValue, colorCount + 1)

        if(value < values[0] || value > values[values.length - 1]){
            throw new RangeError("The argument must be between the smallest and largest value in number range.")
        }

        for(let i = 1; i < values.length; i++){
            if( value >= values[i - 1] && value <= values[i])
                return colors[i - 1];
        }
    }
}

export {componentToHex, rgbToHex, colorRange}