export const COVID19DataMunicipalityPerDay = function () {
    //URL where the data is fetched
    const DATA_URL = "https://raw.githubusercontent.com/koen-schouten/COVID19-Dataset-Netherlands/main/data/COVID-19_aantallen_gemeente_per_dag.json"

    // variable where the data is stored as cache.
    let data;


    /**
     * Fetches covid data for every municipality.
     */
    async function _fetchData() {
        //If data hasn't been set, fetch the data from URL.
        //Else just use the data that has already been set.
        if(!data){
            let response = await fetch(DATA_URL);
            data = await response.json();
            return data;
        }else{
            return data;
        }
    }
    

    /**
     * Fetches covid data for every municipality by date
     * @param {String} date a string representing a data. format: "YYYY-MM-DD" 
     */
    async function getDataByDate(date) {
        let data = await _fetchData();
        data = data.filter(element => element["Date_of_publication"] == date);
        return data;
    }

    /**
    * Fetches covid data for every municipality by municipalitycode
    * @param {String} date a string representing a municipality code. format: "GM0014" 
    */
    async function getDataByMunicipality(municipalityCode, callback) {
        let data = await _fetchData();
        data = data.filter((element) => element["Municipality_code"] == municipalityCode);
        return data;
    }

    /**
     * Get the maximum number of total reported on a day
     */
    async function getMaxTotalReported(){
        let data = await _fetchData();
        let dataTotalReported = data.map(element => element["Total_reported"]);
        let maxTotalReported = Math.max(dataTotalReported);
        return maxTotalReported
    }

    /**
     * Get the maximum number of total deceased on a day
     */
    async function getMaxTotalDeceased(){
        let data = await _fetchData();
        let dataDeceased = data.map(element => element["Deceased"]);
        let maxDeceased = Math.max(dataDeceased);
        return maxDeceased
    }

    async function getLatestDate(){
        let data = await _fetchData();
        let latestDate = data.at(-1)["Date_of_publication"];
        return latestDate
    }

    /**
     * Gets all the data for the latest date
     */
    async function getDataByLatestDate(){
        let latestDate = await getLatestDate();
        let data = await getDataByDate(latestDate);
        return data;
    }

    return {
        "getMaxTotalDeceased": getMaxTotalDeceased,
        "getMaxTotalReported": getMaxTotalReported,
        "getLatestDate": getLatestDate,
        "getDataByDate": getDataByDate,
        "getDataByMunicipality": getDataByMunicipality
    };
}();

