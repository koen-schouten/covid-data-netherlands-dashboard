export const COVID19DataMunicipalityPerDay = function () {
    //URL where the data is fetched
    const MUNICIPALITY_COVID_DATA_URL = "https://raw.githubusercontent.com/koen-schouten/COVID19-Dataset-Netherlands/main/data/COVID-19_aantallen_gemeente_per_dag.json";
    const MUNICIPALITY_POPULATION_DATA_URL = "https://raw.githubusercontent.com/koen-schouten/COVID19-Dataset-Netherlands/main/data/gemeente_bevolkings_data.json";



    // variables where the data is stored as cache.
    let municipality_covid_data;
    let municipality_population_data;


    /**
     * Fetches covid data for every municipality.
     */
    async function _fetchMunicipalityCovidData() {
        //If data hasn't been set, fetch the data from URL.
        //Else just use the data that has already been set.
        if(!municipality_covid_data){
            let response = await fetch(MUNICIPALITY_COVID_DATA_URL);
            municipality_covid_data = await response.json();
            return municipality_covid_data;
        }else{
            return municipality_covid_data;
        }
    }

    async function _fetchMunicipalityPopulationData() {
        if(!municipality_population_data){
            let response = await fetch(MUNICIPALITY_POPULATION_DATA_URL);
            let populationData = await response.json();
            //convert data array to hashmap for easy access
            let hashmap = new Map();
            populationData.forEach(dateElement => {
                let population = parseInt(dateElement.population)
                hashmap.set(dateElement.Municipality_code, population)
            });
            municipality_population_data = hashmap;
            return municipality_population_data;
        }else{
            return municipality_population_data;
        } 
    }

    /**
     * Adds population data to a covidData set
     * @param {[{"Date_of_publication": STRING, 
     *           "Municipality_code": STRING, 
     *           "Total_reported": NUMNBER, 
     *           "Deceased": NUMNBER}, 
     *          ...]]} covidData array representing municipality covid data.
     * @returns {[{"Date_of_publication": STRING, 
     *           "Municipality_code": STRING, 
     *           "Total_reported": NUMNBER, 
     *           "Deceased": NUMNBER,
     *           "Population" :NUMNBER},
     *          ...]]} covidData arrayy with population added
     */
    async function addPopulationData(covidData){
        let populationData = await _fetchMunicipalityPopulationData();
        covidData.map(x =>{ x['population'] = populationData.get(x.Municipality_code);
        })
        return covidData
    }

    /**
     * Fetches covid data for every municipality by date
     * @param {String} date a string representing a data. format: "YYYY-MM-DD" 
     */
    async function getDataByDate(date) {
        let covidData = await _fetchMunicipalityCovidData();
        covidData = covidData.filter(element => element["Date_of_publication"] == date);
        return await addPopulationData(covidData);
    }
    

    /**
    * Fetches covid data for every municipality by municipalitycode
    * @param {String} date a string representing a municipality code. format: "GM0014" 
    */
    async function getDataByMunicipality(municipalityCode, callback) {
        let data = await _fetchMunicipalityCovidData();
        data = data.filter((element) => element["Municipality_code"] == municipalityCode);
        return await addPopulationData(data);
    }

    /**
     * Get the maximum number of total reported on a day
     */
    async function getMaxTotalReported(){
        let data = await _fetchMunicipalityCovidData();
        let dataTotalReported = data.map(element => element["Total_reported"]);
        let maxTotalReported = Math.max(dataTotalReported);
        return maxTotalReported
    }

    /**
     * Get the maximum number of total deceased on a day
     */
    async function getMaxTotalDeceased(){
        let data = await _fetchMunicipalityCovidData();
        let dataDeceased = data.map(element => element["Deceased"]);
        let maxDeceased = Math.max(dataDeceased);
        return maxDeceased
    }

    async function getLatestDate(){
        let data = await _fetchMunicipalityCovidData();
        let latestDate = data.at(-1)["Date_of_publication"];
        return latestDate
    }

    /**
     * Gets all the data for the latest date
     */
    async function getDataByLatestDate(){
        let latestDate = await getLatestDate();
        let data = await getDataByDate(latestDate);
        return await addPopulationData(data);
    }

    return {
        "getDataByLatestDate" : getDataByLatestDate,
        "getMaxTotalDeceased": getMaxTotalDeceased,
        "getMaxTotalReported": getMaxTotalReported,
        "getLatestDate": getLatestDate,
        "getDataByDate": getDataByDate,
        "getDataByMunicipality": getDataByMunicipality
    };
}();

