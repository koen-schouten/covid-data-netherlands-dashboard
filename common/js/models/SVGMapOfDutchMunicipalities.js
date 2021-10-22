export const SVGMapOfDutchMunicipalities = function () {
    //URL where the data is fetched
    const DATA_URL = "https://raw.githubusercontent.com/koen-schouten/dutch-municipalities-map/main/data/dutch_municipalities_map.svg"

    let mapSVG;

    /**
     * Fetches dutch municipalityMap.
     * @param {*} callback 
     */
    function _fetchMap(callback) {
        if (!mapSVG) {
            fetch(DATA_URL)
                .then(response => response.text())
                .then(svg => mapSVG = svg)
                .then(() => callback(mapSVG));
        } else {
            callback(mapSVG)
        }

    }

    /**
     * Fetches dutch municipalityMap as SVG.
     * @param {*} callback 
     */
    function getMap(callback) {
        _fetchMap((mapSVG) => {
            callback(mapSVG);
        })
    }

    return { "getMap": getMap };
}();
