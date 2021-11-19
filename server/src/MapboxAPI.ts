
// import axios from 'axios';
import mbxGeocode from "@mapbox/mapbox-sdk/services/geocoding";
import iReverseGeocodeAPI, { ReversedLocation } from "./iReverseGeocodeAPI";

export default class MapboxAPI implements iReverseGeocodeAPI {

    private geocodingClient = mbxGeocode({
        accessToken: "YOUR_API_KEY",
    });

    async reverseLatLon(lat: string, lon: string): Promise<ReversedLocation | null> {

        try {
            var res = await this.geocodingClient.reverseGeocode({
                query: [parseFloat(lon), parseFloat(lat)],
                limit: 1,
            }).send();

            var county = [];
            var state = [];

            for (let feature of res.body.features) {
                if (feature.context) {
                    for (let elem of feature.context) {
                        if (elem.id.startsWith("district")) {
                            county.push(elem.text);
                        }
                        else if (elem.id.startsWith("region")) {
                            state.push(elem.short_code.replace(/^US-/, ""));
                        }
                    }
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
            console.error(err);
            return null;
        }
    }
}
