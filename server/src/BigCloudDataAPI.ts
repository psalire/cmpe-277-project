
import axios from 'axios';
import iReverseGeocodeAPI, { ReversedLocation } from "./iReverseGeocodeAPI";

export default class BigCloudDataAPI implements iReverseGeocodeAPI {

    async reverseLatLon(lat: string, lon: string): Promise<ReversedLocation | null> {
        try {
            const axios_res = await axios.get(
                'https://api.bigdatacloud.net/data/reverse-geocode',
                {
                    params: {
                        key: 'YOUR_API_KEY',
                        localityLanguage: 'en',
                        latitude: lat,
                        longitude: lon,
                    }
                }
            );

            if (axios_res.data.countryCode != "US") {
                console.warn(`countryCode is ${axios_res.data.countryCode}. Ignoring...`);
                return null;
            }
            var county = [];
            var state = [];
            for (let elem of axios_res.data.localityInfo.administrative) {
                switch (elem.adminLevel) {
                    case 6:
                        if (elem.name.toLowerCase().includes("county") ||
                            elem.description.toLowerCase().includes("county")) {
                            county.push(elem.name);
                        }
                        break;
                    case 4:
                        state.push(elem.isoCode.replace(/^US-/, ""));
                        break;
                }
            }
            if (county.length > 1) {
                let countyInName = county.filter(elem => elem.toLowerCase().includes("county"));
                if (countyInName.length) {
                    county = countyInName;
                }
            }
            console.log(county);
            console.log(state);
            if (county.length != 1) {
                console.warn(`county.length!=1: ${county}`);
            }
            if (state.length != 1) {
                console.warn(`state.length!=1: ${state}`);
            }

            return {
                county: county[0],
                state: state[0],
            };
        }
        catch (err) {

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
            } else if (err.request) {
                // The request was made but no response was received
                // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', err.message);
            }
            console.log(err.config);
            // res.status(500).end();
            return null;
        }
    }
}
