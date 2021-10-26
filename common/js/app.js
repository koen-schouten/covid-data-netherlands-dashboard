import { COVID19DataMunicipalityPerDay } from "/common/js/models/COVID19DataMunicipalityPerDay.js";
import { SVGMapOfDutchMunicipalities } from "/common/js/models/SVGMapOfDutchMunicipalities.js";
import { componentToHex, rgbToHex, colorRange } from "/common/js/utils/colorRange.js";

window.addEventListener('DOMContentLoaded', (event) => {
    let getMapPromise = SVGMapOfDutchMunicipalities.getMap();
    let getCOVID19DataMunicipalityPerDayPromise = COVID19DataMunicipalityPerDay.getDataByLatestDate();

    Promise.all([getMapPromise, getCOVID19DataMunicipalityPerDayPromise]).then((vals) => {
        //Getting the return values from the promises
        let mapSVG = vals[0];
        let covidMunicipalityData = vals[1];

        //Insert the svgMap into the page html
        let mapContainerElement = document.getElementById("dutch_municipality_map");
        mapContainerElement.insertAdjacentHTML("afterbegin", mapSVG);

        //Get the svg element from the HTML tree
        let svgElement = mapContainerElement.childNodes[0];
        //Calculate per capita data
        //Added "|| 0" to the end to convert NaN to 0
        let dataTotalReportedPerCapita = covidMunicipalityData.map(element => (element["Total_reported"]/element["population"] || 0 ));

        //Get the data range to determine the colors for the map
        let maxValue = Math.max(...dataTotalReportedPerCapita);
        let minValue = 0;
        let colorMap = colorRange({ R: 0, G: 255, B: 0 }, { R: 255, G: 0, B: 0 }, minValue, maxValue, 10);


        //Color the elements in the svg map
        Array.from(svgElement.querySelectorAll("path, polygon")).forEach(childNode => {
            let municipalityCode = childNode.getAttribute("data-municipality-code");
            let dataItem = covidMunicipalityData.find(element => element["Municipality_code"] == municipalityCode);

            if (dataItem) {
                childNode.setAttribute("fill", rgbToHex(colorMap(dataItem["Total_reported"] / dataItem["population"] || 0 )));
                childNode.setAttribute("data-total-reported", dataItem["Total_reported"]);
            }

        })
    })
});