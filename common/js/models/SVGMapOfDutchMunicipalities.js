export const SVGMapOfDutchMunicipalities = function () {
    //URL where the data is fetched
    const DATA_URL = "https://raw.githubusercontent.com/koen-schouten/dutch-municipalities-map/main/data/dutch_municipalities_map.svg"

    let mapSVG;

    /**
     * Fetches dutch municipalityMap.
     */
    async function _fetchMap() {
        if (!mapSVG) {
            let response = await fetch(DATA_URL);
            mapSVG = await response.text();
        }
        return mapSVG;
    }

    /**
     * Fetches dutch municipalityMap as SVG.
     */
     async function getMap() {
        return await _fetchMap();
    }

    return { "getMap": getMap };
}();
