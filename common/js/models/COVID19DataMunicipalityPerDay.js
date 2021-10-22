export const COVID19DataMunicipalityPerDay = function () {
    //URL where the data is fetched
    const DATA_URL = "https://raw.githubusercontent.com/koen-schouten/COVID19-Dataset-Netherlands/main/data/COVID-19_aantallen_gemeente_per_dag.json"

    // variable where the data is stored as cache.
    let data;

    /**
     * Fetches covid data for every municipality.
     * @param {*} callback 
     */
    function _fetchData(callback) {
        //If data hasn't been set, fetch the data from URL.
        //Else just use the data that has already been set.
        if (!data) {
            fetch(DATA_URL)
                .then(response => response.json())
                .then(response => data = response)
                .then(() => callback(data))
        }
        else {
            callback(data)
        }
    }

    /**
     * Fetches covid data for every municipality by date
     * @param {String} date a string representing a data. format: "YYYY-MM-DD" 
     * @param {*} callback the callback function that gets executed after fetching the data.
     */
    function getDataByDate(date, callback) {
        _fetchData((data) => {
            data = data.filter(element => element["Date_of_publication"] == date);
            callback(data);
        })
    }

    /**
    * Fetches covid data for every municipality by municipalitycode
    * @param {String} date a string representing a municipality code. format: "GM0014" 
    * @param {*} callback the callback function that gets executed after fetching the data.
    */
    function getDataByMunicipality(municipalityCode, callback) {
        _fetchData((data) => {
            data = data.filter((element) => element["Municipality_code"] == municipalityCode);
            callback(data);
        });
    }

    return {
        "getDataByDate": getDataByDate,
        "getDataByMunicipality": getDataByMunicipality
    };
}();

