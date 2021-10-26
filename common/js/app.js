import { COVID19DataMunicipalityPerDay } from "/common/js/models/COVID19DataMunicipalityPerDay.js";
import { SVGMapOfDutchMunicipalities } from "/common/js/models/SVGMapOfDutchMunicipalities.js";
import { componentToHex, rgbToHex, colorRange } from "/common/js/utils/colorRange.js";

window.addEventListener('DOMContentLoaded', (event) => {

    console.log('DOM fully loaded and parsed');

    //let date = "2020-02-28";
    //
    let municipality = "GM0014";

    //COVID19DataMunicipalityPerDay.getDataByMunicipality(municipality, data => console.log(data));
    //COVID19DataMunicipalityPerDay.getDataByDate(date, (data) => {console.log(data)});
    //SVGMapOfDutchMunicipalities.getMap((svg)=> document.body.insertAdjacentHTML("afterbegin", svg))


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
        let dataTotalReported = covidMunicipalityData.map(element => element["Total_reported"]);

        //Get the data range to determine the colors for the map
        let maxValue = Math.max(...dataTotalReported);
        let minValue = 0;
        let colorMap = colorRange({ R: 0, G: 255, B: 0 }, { R: 255, G: 0, B: 0 }, minValue, maxValue, 10);


        //Color the elements in the svg map
        Array.from(svgElement.querySelectorAll("path, polygon")).forEach(childNode => {
            let municipalityCode = childNode.getAttribute("data-municipality-code");
            let dataItem = covidMunicipalityData.find(element => element["Municipality_code"] == municipalityCode);

            if (dataItem) {
                childNode.setAttribute("fill", rgbToHex(colorMap(dataItem["Total_reported"])));
                childNode.setAttribute("data-total-reported", dataItem["Total_reported"]);
            }

        })
    })
});